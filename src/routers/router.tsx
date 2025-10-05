import { type FC } from "react";
import { useRoutes } from "react-router-dom";
import MainLayout from "../layouts/mainLayout";
import Dashboard from "../pages/dashboard";
import Input from "../pages/input";
import Login from "../pages/login";
import Order from "../pages/order";
import QRTableGenerator from "../pages/qrTableGenerator";
import { ProtectedRoute } from "./protectedRoute";
import CompanyProfile from "../pages/companyProfile";

const Router: FC = () => {
    const routes = [
        {
            path: '/',
            element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
            children: [
                {
                    index: true,
                    element: <Dashboard />
                },
                {
                    path: '/order',
                    element: <Order />
                },
                {
                    path: '/input',
                    element: <Input />
                },
                {
                    path: '/edit-input/:id',
                    element: <Input />
                },
                {
                    path: '/qr-generate',
                    element: <QRTableGenerator />
                },
                {
                    path: '/print-out/:id',
                    element: <Order />
                },
                {
                    path: '/company-profile',
                    element: <CompanyProfile />
                }
            ]
        },
        {
            path: '/login',
            element: <Login />
        }
    ];

    const element = useRoutes(routes);

    return element;
}

export default Router;