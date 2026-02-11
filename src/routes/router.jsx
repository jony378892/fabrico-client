import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import AuthLayout from "../layouts/AuthLayout";
import Products from "../pages/Products/Products";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import Loading from "../components/Shared/Loading";
import PrivateRoute from "./PrivateRoute";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentCancelled from "../pages/Payment/PaymentCancelled";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import ManageUsers from "../pages/Dashboard/AdminOnly/ManageUsers/ManageUsers";
import DashboardLayout from "../layouts/DashboardLayout";
import AllProducts from "../pages/Dashboard/AdminOnly/AllProducts/AllProducts";
import AllOrders from "../pages/Dashboard/AdminOnly/AllOrders/AllOrders";
import MyProfile from "../pages/Dashboard/MyProfile/MyProfile";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import AddProduct from "../pages/Dashboard/ManagerOnly/AddProduct/AddProduct";
import ManageProducts from "../pages/Dashboard/ManagerOnly/ManageProducts/ManageProducts";
import PendingOrders from "../pages/Dashboard/ManagerOnly/PendingOrders/PendingOrders";
import ApproveOrders from "../pages/Dashboard/ManagerOnly/ApprovedOrders/ApprovedOrders";
import MyOrders from "../pages/Dashboard/BuyerOnly/MyOrders/MyOrders";
import TrackOrder from "../pages/Dashboard/BuyerOnly/TrackOrder/TrackOrder";
import OrderForm from "../pages/OrderForm/OrderForm";
import OrderDetails from "../pages/Dashboard/AdminOnly/AllOrders/OrderDetails/OrderDetails";
import UpdateProduct from "../pages/Dashboard/ManagerOnly/UpdateProduct/UpdateProduct";
import NotFound from "../components/NotFound";
import UpdateProductAdmin from "../pages/Dashboard/AdminOnly/UpdateProductAdmin/UpdateProductAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "about",
        Component: About,
        handle: {
          title: "About page - Fabrico",
        },
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "products",
        Component: Products,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "order-form/:id",
        element: (
          <PrivateRoute>
            <OrderForm />
          </PrivateRoute>
        ),
      },
      {
        path: "dashboard/payment-success",
        Component: PaymentSuccess,
      },
      {
        path: "dashboard/payment-cancelled",
        Component: PaymentCancelled,
      },
      {
        path: "",
        Component: AuthLayout,
        children: [
          {
            path: "login",
            Component: Login,
          },
          {
            path: "register",
            Component: Register,
          },
        ],
      },
    ],
  },
  {
    path: "dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "my-orders",
        element: (
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "track-order/:id",
        element: (
          <PrivateRoute>
            <TrackOrder />
          </PrivateRoute>
        ),
      },
      {
        path: "order-details/:id",
        element: (
          <PrivateRoute>
            <OrderDetails />
          </PrivateRoute>
        ),
      },

      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "update-product/:id",
        element: (
          <ManagerRoute>
            <UpdateProduct />
          </ManagerRoute>
        ),
      },
      {
        path: "update-product/:id/admin",
        element: (
          <AdminRoute>
            <UpdateProductAdmin />
          </AdminRoute>
        ),
      },

      {
        path: "all-products",
        element: (
          <AdminRoute>
            <AllProducts />
          </AdminRoute>
        ),
      },
      {
        path: "all-orders",
        element: (
          <AdminRoute>
            <AllOrders />
          </AdminRoute>
        ),
      },
      {
        path: "add-product",
        element: (
          <ManagerRoute>
            <AddProduct />
          </ManagerRoute>
        ),
      },
      {
        path: "manage-products",
        element: (
          <ManagerRoute>
            <ManageProducts />
          </ManagerRoute>
        ),
      },
      {
        path: "pending-orders",
        element: (
          <ManagerRoute>
            <PendingOrders />
          </ManagerRoute>
        ),
      },
      {
        path: "approved-orders",
        element: (
          <ManagerRoute>
            <ApproveOrders />
          </ManagerRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/*",
    Component: NotFound,
  },
]);
