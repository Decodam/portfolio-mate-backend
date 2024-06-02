import React, {  } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import LandingPage from './app/pages/LandingPage';
import ErrorPage from './app/pages/ErrorPage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './app/context/ThemeContext';
import { UserProvider } from './app/context/AuthContext';
import Dashbaord from './app/pages/Dashboard';
import PrivateRoute from './app/components/PrivateRoute';
import SiteBuildPage from './app/pages/SiteBuildPage';


const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/dashboard",
        element: <PrivateRoute><Dashbaord /></PrivateRoute>
    },
    {
        path: "/dashboard/build",
        element: <PrivateRoute><SiteBuildPage /></PrivateRoute>
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
]);

const App = (props) => {
    return(
        <UserProvider>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </UserProvider>
    );
}


export default App;