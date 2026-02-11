import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";

export default function Login() {
  const { signInUser } = useAuth();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogIn = (data) => {
    const { email, password } = data;

    signInUser(email, password)
      .then(() => {
        toast.success("Login successful!");

        if (location.state) {
          navigate(location.state);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        toast(error);
      });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="hero min-h-screen">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-none sm:shadow-2xl my-10">
        <form className="card-body" onSubmit={handleSubmit(handleLogIn)}>
          <div className="mb-5 text-center">
            <h2 className="text-3xl font-bold">
              <br />
              Welcome Back
            </h2>
            <small className="text-gray-500">Login now to get started.</small>
          </div>
          <fieldset className="fieldset">
            {/* Email */}
            <label className="label">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="input outline-none"
              placeholder="Email"
              required
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Email is required</p>
            )}

            {/* Password */}
            <label className="label">Password</label>
            <input
              {...register("password", {
                required: true,
              })}
              type="password"
              className="input outline-none"
              placeholder="Password"
              required
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}

            <div>
              <Link to="/auth/forget-password" className="link link-hover">
                Forgot password?
              </Link>
            </div>
            <button className="btn btn-neutral mt-4 mr-4">Login </button>
            <p className="font-semibold text-xs">
              Don't have an account?{" "}
              <Link to={"/register"} className="text-blue-700 underline">
                Signup Now
              </Link>
            </p>
            <div className="divider text-sm mr-4">OR</div>
            <SocialLogin />
          </fieldset>
        </form>
      </div>
    </div>
  );
}
