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
import { OnProcess } from "../subPages/order/onProcess";
import { Completed } from "../subPages/order/completed";
import ItemInput from "../subPages/input/itemInput";
import { ItemList } from "../subPages/input/itemList";
import ItemEdit from "../subPages/input/itemEdit";
import Discontinue from "../subPages/input/discontinue";
import UserInput from "../subPages/outlet/userInput";
import { UserList } from "../subPages/outlet/userList";
import VoucherInput from "../subPages/input/voucherInput";
import { VoucherList } from "../subPages/input/voucherList";
import VoucherEdit from "../subPages/input/voucherEdit";
import PrintOut from "../pages/printOut";
import Register from "../pages/register";
import Outlet from "../pages/outlet";
import OutletInput from "../subPages/outlet/outletInput";
import { OutletList } from "../subPages/outlet/outletList";

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
                },
                {
                    path: '/edit-voucher/:id',
                    element: <Input />
                },
                {
                    path: '/order-process',
                    element: <OnProcess />
                },
                {
                    path: '/order-completed',
                    element: <Completed />
                },
                {
                    path: '/item-input',
                    element: <ItemInput />
                },
                {
                    path: '/item-list',
                    element: <ItemList />
                },
                {
                    path: '/item-edit/:id',
                    element: <ItemEdit />
                },
                {
                    path: '/discontinue',
                    element: <Discontinue />
                },
                {
                    path: '/user-input',
                    element: <UserInput />
                },
                {
                    path: '/user-list',
                    element: <UserList />
                },
                {
                    path: '/voc-input',
                    element: <VoucherInput />
                },
                {
                    path: '/voc-list',
                    element: <VoucherList />
                },
                {
                    path: '/voc-edit/:id',
                    element: <VoucherEdit />
                },
                {
                    path: '/print-order/:id',
                    element: <PrintOut />
                },
                {
                    path: '/outlet',
                    element: <Outlet />
                },
                {
                    path: '/outlet-input',
                    element: <OutletInput />
                },
                {
                    path: '/outlet-list',
                    element: <OutletList />
                }
            ]
        },
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/register',
            element: <Register />
        },
    ];

    const element = useRoutes(routes);

    return element;
}

export default Router;