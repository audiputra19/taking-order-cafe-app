import { useState, type FC } from "react";
import Sidebar from "../components/sidebar";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Outlet, useLocation } from "react-router-dom";
import path from "path";
import { ThemeSwitcher } from "../components/themeSwitcher";
import clsx from "clsx";

const MainLayout: FC = () => {
    const location = useLocation();
    const path = location.pathname;
    const [collapsed, setCollapsed] = useState<boolean>(false);
    
    const getTitle = (path: string) => {
        if (path === "/") return "Dashboard";
        if (path === "/order") return "Order";
        if (path === "/input") return "Input";
        if (path === "/qr-generate") return "QR Generator";
        if (path.startsWith("/edit-input")) return "Edit Item";
        return "";
    };

    return (
        <>
            <div className="flex">
                <div 
                    className={clsx(
                        "fixed top-0 left-0 h-screen transition-all duration-300 bg-base-200 z-[20]", 
                        collapsed ? 'w-[63px]' : 'w-[250px]'
                )}>
                    <Sidebar pathname={path} collapsed={collapsed}/>
                </div>
                <div 
                    className={clsx(
                        "flex-1 flex flex-col min-h-screen bg-base-100 transition-[margin] duration-300",
                        collapsed ? "ml-[63px]" : "ml-[250px]"
                )}>
                    <div className="sticky top-0 p-3 bg-base-100 z-10 border-b border-base-300">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div 
                                    className="p-2 rounded-xl cursor-pointer hover:bg-base-200"
                                    onClick={() => setCollapsed(!collapsed)}
                                >
                                    {collapsed 
                                    ? <TbLayoutSidebarLeftExpand size={20}/> 
                                    : <TbLayoutSidebarLeftCollapse size={20}/>}
                                </div>
                                <div className="border-l border-gray-200 h-5 ml-3 mr-5"></div>
                                <p>{getTitle(path)}</p>
                            </div>
                            <div>
                                <ThemeSwitcher />
                            </div>
                        </div>
                    </div>
                    <div className="m-5 rounded-lg">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainLayout;