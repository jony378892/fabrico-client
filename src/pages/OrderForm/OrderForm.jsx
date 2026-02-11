import { useNavigate, useParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Shared/Loading";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function OrderForm() {
  const { user, loading } = useAuth();
  const { currentUser } = useCurrentUser();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch product
  const { isLoading, data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const result = await axiosSecure.get(`/products/${id}`);
      return result.data;
    },
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: product?.moq || 1,
    },
  });

  // Watch quantity
  const quantity = useWatch({ control, name: "quantity" });

  // Total price
  const totalPrice = product && quantity ? product.price * quantity : 0;

  if (isLoading || loading) {
    return <Loading />;
  }

  const onSubmit = async (data) => {
    const orderPayload = {
      ...data,
      productId: product._id,
      productName: product.name,
      unitPrice: product.price,
      totalPrice: totalPrice,
      status: "pending",
      createdAt: new Date(),
      createdBy: product.createdBy,
    };

    if (product.paymentMethod == "cash_on_delivery") {
      orderPayload.paymentMethod = "cash_on_delivery";
    } else {
      orderPayload.paymentMethod == "stripe";
    }

    // console.log("Order Data:", orderPayload);
    if (currentUser.status === "suspended" && currentUser.role === "buyer") {
      return Swal.fire({
        title: "User suspended",
        text: "Your can't place order",
        icon: "error",
      });
    }

    try {
      const orderResponse = await axiosSecure.post("/orders", orderPayload);

      if (orderResponse.data.insertedId) {
        toast.success("Order created successfully.");
        // console.log("Order created:", orderResponse.data);

        if (product.paymentMethod == "stripe") {
          const checkoutResponse = await axiosSecure.post(
            "/create-checkout-session",
            orderPayload,
          );

          if (checkoutResponse.data.url) {
            window.location.href = checkoutResponse.data.url;
          } else {
            toast.error("Something went wrong. Try again later.");
            throw new Error("No checkout URL received");
          }
        } else {
          navigate("/products");
        }
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Failed to process order. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">Place Your Order</h2>

      {/* Email */}
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          value={user.email}
          readOnly
          className="input input-bordered w-full bg-gray-100"
          {...register("email")}
        />
      </div>

      {/* Product Name */}
      <div>
        <label className="label">Product</label>
        <input
          type="text"
          value={product.title}
          readOnly
          className="input input-bordered w-full bg-gray-100"
          {...register("name")}
        />
      </div>

      {/* Unit Price */}
      <div>
        <label className="label">Price per Unit</label>{" "}
        <input
          type="number"
          value={product.price}
          readOnly
          className="input input-bordered w-full bg-gray-100"
          {...register("unitPrice")}
        />
      </div>

      {/* Customer Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">First Name *</label>
          <input
            className="input input-bordered w-full"
            {...register("firstName", {
              required: "required",
            })}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="label">Last Name *</label>
          <input
            className="input input-bordered w-full"
            {...register("lastName", {
              required: "required",
            })}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="label">Order Quantity *</label>
        <input
          type="number"
          className="input input-bordered w-full"
          placeholder={`Minimum ${product.moq}`}
          {...register("quantity", {
            valueAsNumber: true,
            required: "Quantity is required",
            min: {
              value: product.moq,
              message: `Minimum order is ${product.moq}`,
            },
            max: {
              value: product.availableQuantity,
              message: `Only ${product.availableQuantity} available`,
            },
          })}
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm">{errors.quantity.message}</p>
        )}
      </div>

      {/* Total Price */}
      <div>
        <label className="label">Total Price</label>
        <input
          type="text"
          readOnly
          value={`$${totalPrice.toFixed(2)}`}
          className="input input-bordered w-full bg-gray-100 font-semibold"
        />
      </div>

      {/* Contact */}
      <div>
        <label className="label">Contact Number *</label>
        <input
          type="tel"
          className="input input-bordered w-full"
          {...register("contact", {
            required: "required",
          })}
        />
        {errors.contact && (
          <p className="text-red-500 text-sm">{errors.contact.message}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="label">Delivery Address *</label>
        <textarea
          className="textarea textarea-bordered w-full"
          {...register("address", {
            required: "required",
          })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="label">Additional Notes</label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Any special instructions (optional)"
          {...register("notes")}
        />
      </div>

      {/* Submit button */}
      {product.paymentMethod == "cash_on_delivery" ? (
        <button className="btn btn-primary w-full">
          Proceed(Cash on delivery)
        </button>
      ) : (
        <button className="btn btn-primary w-full">
          Proceed and Pay (Stripe)
        </button>
      )}
    </form>
  );
}
