import { createBrowserRouter } from "react-router-dom";
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Auth from "./pages/Auth";

const router =  createBrowserRouter([
    {
       path: "/",
       element: <Home/>,
       children:[
        {
            path:"dashboard",
            element:<Dashboard/>
        },
        {
            path:"incomes",
            element:<Income/>
        },
        {
            path:"expenses",
            element:<Expenses/>
        },
       ]
    },

    {
        path: '/auth',
        element: <Auth/>,
        children:[
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "signup",
                element: <Signup/>
            },
        ]
    }
]);



export default router;