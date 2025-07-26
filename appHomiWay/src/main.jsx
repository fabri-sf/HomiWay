import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./index.css";

import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";

import UserProvider from "./components/User/UserProvider";
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

import DetailRental from "./components/Rental/DetailRental";
import { CreateMovieRental } from "./components/Rental/CreateMovieRental";
import { GraphRetal } from "./components/Rental/GraphRental";

import { GetUbicacion } from "./components/Ubicacion/Ubicacion";

import Promotion from "./components/Promotion/Promotion";
import ProductosConPromociones from "./components/Promotion/ListProductPromotion";
import CreatePromotion from "./components/Promotion/CreatePromotion"; // Nuevo componente
import PromotionDetail from "./components/Promotion/PromotionDetail"; // Asumo que existe

import ListResena from "./components/Resena/ListResena";
import ListPedido from "./components/Pedido/ListPedido";
import DetailPedido from "./components/Pedido/DetailPedido";

import { CreateResena } from "./components/Resena/CreateResena";

const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '*',
        element: <PageNotFound />
      },
      {
        path: '/',
        element: <Auth requiredRoles={['Administrador']} />,
        children: [
          {
            path: '/movie-table',
            element: <TableAlojamiento />
          },
          {
            path: '/promociones/crear',
            element: <CreatePromotion /> // Ruta protegida para crear promociones
          }
        ]
      },
      {
        path: '/alojamientos',
        element: <ListAlojamiento />
      },
      { 
        path: "/alojamiento",            
        element: <GetAlojamiento /> 
      },
      {
        path: '/alojamiento/:id',
        element: <DetailAlojamiento />
      },
      { 
        path: "/alojamiento/crear", 
        element: <CreateAlojamiento /> 
      },
      {
        path: '/promociones',
        element: <Promotion />
      },
      {
        path: '/promociones/:id',
        element: <PromotionDetail /> // Ruta para detalle de promoción
      },
      {
        path: '/promocionesDis',
        element: <ProductosConPromociones />
      },
      {
        path: '/pedidos',
        element: <ListPedido />
      },
      {
        path: '/pedido/:id',
        element: <DetailPedido />
      },
      {
        path: '/resenas',
        element: <ListResena />
      },
      {
        path: '/ubicacion/:id',
        element: <GetUbicacion />
      },
      {
        path: '/retal/:id',
        element: <DetailRental />
      },
      {
        path: '/rental/crear/',
        element: <CreateMovieRental />
      },
      {
        path: '/rental/graph',
        element: <GraphRetal />
      },
      {
        path: '/resena/crear/:idAlojamiento',
        element: <CreateResena />
      },
      {
        path: '/unauthorized',
        element: <Unauthorized />
      },
      {
        path: '/user/login',
        element: <Login />
      },
      {
        path: '/user/logout',
        element: <Logout />
      },
      {
        path: '/user/create',
        element: <Signup />
      }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={rutas} />
    </UserProvider>
  </StrictMode>
);