import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

import i18n from "./i18n/config";
import { I18nextProvider } from "react-i18next";

import App from "./App.jsx";
import UserProvider from "./components/User/UserProvider.jsx";

import { CartProvider } from './context/CartContext.jsx';



import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Unauthorized } from "./components/User/Unauthorized";
import { Login } from "./components/User/Login";
import { Logout } from "./components/User/Logout";
import { Signup } from "./components/User/Signup";
import { Auth } from "./components/User/Auth";

import { Home } from "./components/Home/Home";
import { PageNotFound } from "./components/Home/PageNotFound";

import { ListAlojamiento } from "./components/Alojamiento/ListAlojamiento";
import { DetailAlojamiento } from "./components/Alojamiento/DetailAlojamiento";
import CreateAlojamiento from "./components/Alojamiento/CreateAlojamiento";
import TableAlojamiento from "./components/Alojamiento/TableAlojamiento";
import GetAlojamiento from "./components/Alojamiento/GetAlojamiento";
import UpdateAlojamiento from "./components/Alojamiento/UpdateAlojamiento";

// 1) Importa el AuthProvider:
import { AuthProvider } from './context/AuthContext.jsx';





import DetailRental from "./components/Rental/DetailRental";
//import { CreateMovieRental } from "./components/Rental/CreateMovieRental";
import { GraphRetal } from "./components/Rental/GraphRental";

import { GetUbicacion } from "./components/Ubicacion/Ubicacion";

import Promotion from "./components/Promotion/Promotion";
import ProductosConPromociones from "./components/Promotion/ListProductPromotion";
import CreatePromotion from "./components/Promotion/CreatePromotion";
import PromotionDetail from "./components/Promotion/PromotionDetail";

import ListResena from "./components/Resena/ListResena";
import ResenaAlojamiento from "./components/Resena/ResenaAlojamiento";

import ListPedido from "./components/Pedido/ListPedido";
import DetailPedido from "./components/Pedido/DetailPedido";

import { CreateResena } from "./components/Resena/CreateResena";

import Carrito from "./components/Carrito/Carrito";

const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
      {
        path: "/Carrito",
        element: <Carrito />,
      },
      {
        path: "/",
        element: <Auth requiredRoles={["Administrador"]} />,
        children: [
          {
            path: "/movie-table",
            element: <TableAlojamiento />,
          },
          {
            path: "/promociones/crear",
            element: <CreatePromotion />, 
          },
        ],
      },
      {
        path: "/alojamientos",
        element: <ListAlojamiento />,
      },
      {
        path: "/alojamiento",
        element: <GetAlojamiento />,
      },
      {
        path: "/alojamiento/:id",
        element: <DetailAlojamiento />,
      },
      {
        path: "/alojamiento/crear",
        element: <CreateAlojamiento />,
      },
      {
        path: "/alojamiento/editar/:id",
        element: <UpdateAlojamiento />,
      },
      {
        path: "/promociones",
        element: <Promotion />,
      },
      {
        path: "/promociones/:id",
        element: <PromotionDetail />, // Ruta para detalle de promoción
      },
      {
        path: "/promocionesDis",
        element: <ProductosConPromociones />,
      },
      {
        path: "/pedidos",
        element: <ListPedido />,
      },
      {
        path: "/pedido/:id",
        element: <DetailPedido />,
      },
      {
        path: "/resenas",
        element: <ListResena />,
      },
      {
        path: "/resena/alojamiento/:id",
        element: <ResenaAlojamiento />,
      },

      {
        path: "/ubicacion/:id",
        element: <GetUbicacion />,
      },
      {
        path: "/retal/:id",
        element: <DetailRental />,
      },
      /* {
        path: "/rental/crear/",
        element: <CreateMovieRental />,
      },*/
      {
        path: "/rental/graph",
        element: <GraphRetal />,
      },
      {
        path: "/resena/crear/:idAlojamiento",
        element: <CreateResena />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "/user/login",
        element: <Login />,
      },
      {
        path: "/user/logout",
        element: <Logout />,
      },
      {
        path: "/user/create",
        element: <Signup />,
      },
    ],
  },
]);

 createRoot(document.getElementById("root")).render(
   <StrictMode>
     <I18nextProvider i18n={i18n}>
      <AuthProvider>
         <UserProvider>
           <CartProvider>
             <RouterProvider router={rutas} />
           </CartProvider>
         </UserProvider>
      </AuthProvider>
     </I18nextProvider>
   </StrictMode>

);
