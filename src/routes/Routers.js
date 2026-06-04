import { useSelector } from "react-redux";
import { useRoutes, Navigate } from "react-router-dom";
import CustomerLayout from "../Common/Layout/CustomerLayout/CustomerLayout";
import Home from "../Pages/Home/Home";
import ProfileOverview from "../Pages/ProfileOverview/ProfileOverview";
import EditProfile from "../Pages/EditProfile/EditProfile";
import Login from "../Common/Account/Login/Login";
import Register from "../Common/Account/Register/Register";
import ForgotPassword from "../Common/Account/ForgotPassword/ForgotPassword";
import Cart from "../Pages/Cart/Cart";
import About from "../Pages/About/About";
import Checkout from "../Pages/Checkout/Checkout";
import Journal from "../Pages/Journal/Journal";
import Contact from "../Pages/Contact/Contact";
import FAQ from "../Pages/FAQ/FAQ";
import ProductDetail from "../Pages/Product/ProductDetail";
import Shop from "../Pages/Shop/Shop";
import NotFoundPage from "../Pages/NotFound/NotFoundPage";
import OurStory from "../Pages/OurStory/OurStory";
import Sustainability from "../Pages/Sustainability/Sustainability";
import ShippingPolicy from "../Pages/ShippingPolicy/ShippingPolicy";
import ReturnsRefund from "../Pages/ReturnsRefund/ReturnsRefund";
import JournalDetails from "../Pages/Journal/JournalDetails/JournalDetails";
import Layout from "../Common/Layout/Layout";
import Dashboard from "../Pages/Admin/Dashboard/Dashboard";
import Orders from "../Pages/Admin/Orders/Orders";
import ProductEdit from "../Pages/Admin/Products/ProductEdit";
import Products from "../Pages/Admin/Products/Products";
import Campaigns from "../Pages/Admin/Campaigns/Campaigns";
import DesignLibrary from "../Pages/Admin/DesignLibrary/DesignLibrary";
import Customers from "../Pages/Admin/Customers/Customers";
import Categories from "../Pages/Admin/Categories/Categories";
import Blogs from "../Pages/Admin/Blogs/Blogs";
import CustomDesign from "../Pages/CustomDesign/CustomDesign";

const Routers = () => {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth || { isAuthenticated: false, user: null },
  );
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const authenticatedRedirectPath = isAdmin ? "/admin/dashboard" : "/";

  const routing = useRoutes([
    {
      path: "/",
      element: <CustomerLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "profile", element: <ProfileOverview /> },
        { path: "profile/edit", element: <EditProfile /> },
        { path: "cart", element: <Cart /> },
        { path: "about", element: <About /> },
        { path: "checkout", element: <Checkout /> },
        { path: "journal", element: <Journal /> },
        { path: "journal/:id", element: <JournalDetails /> },
        { path: "contact", element: <Contact /> },
        { path: "faq", element: <FAQ /> },
        { path: "product/:id", element: <ProductDetail /> },
        { path: "shop", element: <Shop /> },
        { path: "our-story", element: <OurStory /> },
        { path: "sustainability", element: <Sustainability /> },
        { path: "shipping-policy", element: <ShippingPolicy /> },
        { path: "returns-refund", element: <ReturnsRefund /> },
        { path: "custom-design", element: <CustomDesign /> }, 
      ],
    },
    {
      path: "/admin",
      element: isAdmin ? <Layout /> : <Navigate to="/login" />, 
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "orders", element: <Orders /> },
        { path: "products", element: <Products /> },
        { path: "products/edit/:productId", element: <ProductEdit /> },
        { path: "products/add", element: <ProductEdit /> },
        { path: "categories", element: <Categories /> },
        { path: "campaigns", element: <Campaigns /> },
        { path: "design-library", element: <DesignLibrary /> },
        { path: "blogs", element: <Blogs /> },
        { path: "customers", element: <Customers /> },
      ],
    },
    {
      path: "/login",
      element: !isAuthenticated ? <Login /> : <Navigate to={authenticatedRedirectPath} replace />,
    },
    { path: "/register", element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },

    { path: "*", element: <NotFoundPage /> },
  ]);

  return routing;
};

export default Routers;