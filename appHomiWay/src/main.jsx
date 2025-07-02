import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
//import Promotion from "./components/Promotion/Promotion";
//import ProductosConPromociones from "./components/Promotion/ListProductPromotion";
import { Home } from "./components/Home/Home";
import { RouterProvider } from "react-router";
import { PageNotFound } from "./components/Home/PageNotFound";
import ListRentals from "./components/Rental/ListRentals";
import DetailRental from "./components/Rental/DetailRental";
import TableMovies from "./components/Alojamiento/TableAlojamiento";
import { CreateMovie } from "./components/Alojamiento/CreateMovie";
import { UpdateMovie } from "./components/Alojamiento/UpdateMovie";
import { CreateMovieRental } from "./components/Rental/CreateMovieRental";
import { GraphRetal } from "./components/Rental/GraphRental";
import UserProvider from "./components/User/UserProvider";
import { Unauthorized } from "./components/User/Unauthorized";
import { Login } from "./components/User/Login";
import { Logout } from "./components/User/Logout";
import { Signup } from "./components/User/Signup";
import { Auth } from "./components/User/Auth";
import {  GetUbicacion } from './components/Ubicacion/Ubicacion';



import { ListAlojamiento } from './components/Alojamiento/ListAlojamiento';
import { DetailAlojamiento } from './components/Alojamiento/DetailAlojamiento';

const rutas=createBrowserRouter(
  [
    {
      element: <App />,
      children:[
        {
          //Para que sea lo primero en mostrarse
          path:'/',
          element: <Home />
        },
        {
          path: '*',
          element: <PageNotFound />
        },
        //Grupos de rutas a autorizar
        //Grupo 1: Administrador
        //Grupo 2: Cliente
        //Grupo 3: Administrador y el Cliente
        {
          //Grupo 1
          path:'/',
          element: <Auth requiredRoles={['Administrador']} />,
          children:[
            {
              path:'/movie-table',
              element: <TableMovies />
            },
            {
              path:'/movie/crear/',
              element: <CreateMovie />
            },
            {
              path:'/movie/update/:id',
              element: <UpdateMovie />
            },
          ]
        },
        {
          path: '/alojamientos',
          element: <ListAlojamiento />
        },
        {
          path: '/alojamiento/:id',
          element: <DetailAlojamiento />
        },
        
        { path: '/ubicacion/:id',
           element: <GetUbicacion /> 
        },
           



        
        {
          path:'/retal/:id',
          element: <DetailRental />
        },
       
        {
          path: '/rental/crear/',
          element: <CreateMovieRental />,
        },
        {
          path: '/rental/graph',
          element: <GraphRetal />,
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
          path:'/user/logout',
          element: <Logout />
        },
        {
          path: '/user/create',
          element: <Signup />
        }
      ]
    }
  ]
)

createRoot(document.getElementById("root")).render(
  <StrictMode> 
    <UserProvider>
      <RouterProvider router={rutas} /> 
    </UserProvider>
</StrictMode>, 
);
