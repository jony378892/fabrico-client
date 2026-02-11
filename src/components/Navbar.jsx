import { Link, NavLink } from "react-router";
import Logo from "./Shared/Logo";

import useAuth from "../hooks/useAuth";
import { IoMdMenu } from "react-icons/io";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logOutUser } = useAuth();
  // console.log(user);

  const handleLogOut = () => {
    logOutUser()
      .then(() => {
        toast.success("Logout successful");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const links = (
    <>
      <div className="md:flex items-center gap-4 text-sm hidden">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/products">Products</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      </div>
      <div className="flex items-center gap-3">
        <li>
          <NavLink className="hidden md:inline-block" to="/about">
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink className="hidden md:inline-block" to="/contact">
            Contact
          </NavLink>
        </li>
      </div>
    </>
  );

  return (
    <div className="sticky top-0 inset-x-0 bg-white z-10 shadow-lg">
      <div className="flex items-center justify-between px-3 py-1.5 mx-auto max-w-7xl">
        <div className="flex items-center">
          <div className="dropdown md:hidden">
            <div tabIndex={0} role="button" className="cursor-pointer">
              <IoMdMenu size={24} className="mr-2" />
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg border border-gray-300"
            >
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/products">Products</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/about">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
            </ul>
          </div>
          <Logo />
        </div>
        <div className="flex-none">
          <ul className="flex text-sm items-center gap-4 px-3">{links}</ul>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                className="btn btn-error btn-sm ml-2"
                onClick={handleLogOut}
              >
                Logout
              </button>
              <figure>
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="rounded-full w-10 h-10 object-cover object-center"
                />
              </figure>
            </>
          ) : (
            <Link to="/login">
              <button className="btn btn-sm sm:btn-md btn-outline btn-primary">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
