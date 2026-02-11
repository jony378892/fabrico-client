import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Shared/Loading";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";

export default function Products() {
  const axiosInstance = useAxiosSecure();

  const { isLoading, data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/products");
      return res.data;
    },
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our Products
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Browse our collection of high-quality garments designed for modern
            production and comfort.
          </p>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 gap-y-10">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <figure className="overflow-hidden">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-72 w-full object-top object-cover hover:scale-105 transition duration-300"
                  />
                </figure>

                <div className="p-5 flex flex-col gap-3">
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition cursor-pointer">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-gray-800">
                      $ {product.price}
                    </span>

                    <Link to={`/product/${product._id}`}>
                      <button className="btn btn-sm btn-primary">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
