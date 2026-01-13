import clsx from "clsx";
import { useState, type FC } from "react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { ThemeSwitcher } from "../components/themeSwitcher";
import { LuMenu } from "react-icons/lu";

const MainLayout: FC = () => {
    const location = useLocation();
    const path = location.pathname;
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    
    const getTitle = (path: string) => {
        if (path === "/") return "Dashboard";
        if (path === "/order") return "Order";
        if (path === "/input") return "Input";
        if (path === "/outlet") return "Outlet";
        if (path === "/qr-generate") return "QR Generator";
        if (path.startsWith("/edit-input")) return "Edit Item";
        if (path === "/company-profile") return "Company Profile";
        if (path.startsWith("/print-out")) return "Print Out";
        if (path.startsWith("/edit-voucher")) return "Edit Voucher";
        if (path === "/order-process") return "On Process";
        if (path === "/order-completed") return "Completed";
        if (path === "/item-input") return "Item Input";
        if (path === "/item-list") return "Item List";
        if (path === "/discontinue") return "Discontinue";
        if (path === "/user-input") return "User Input";
        if (path === "/user-list") return "User List";
        if (path === "/voc-input") return "Voucher Input";
        if (path === "/voc-list") return "Voucher List";
        if (path.startsWith("/item-edit")) return "Edit Item";
        if (path.startsWith("/voc-edit")) return "Edit Voucher";
        if (path.startsWith("/print-order")) return "Print Out";
        return "";
    };

    return (
        <>
            <div className="flex">
                <div 
                    className={clsx(
                        "hidden md:block fixed top-0 left-0 h-screen transition-all duration-300 bg-base-200 z-[20] sidebar-print-hide", 
                        collapsed ? 'w-[63px]' : 'w-[250px]'
                )}>
                    <Sidebar pathname={path} collapsed={collapsed}/>
                </div>
                {/* ============== MOBILE SIDEBAR SLIDE ============== */}
                <div
                    className={clsx(
                        "md:hidden fixed top-0 left-0 h-screen w-[250px] bg-base-200 z-[30] transition-transform duration-300",
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <Sidebar pathname={path} collapsed={false} onSelect={() => setMobileOpen(false)} />
                </div>
                {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-[25]"
                    onClick={() => setMobileOpen(false)}
                ></div>
)}
                <div 
                    className={clsx(
                        "flex-1 flex flex-col min-h-screen bg-base-100 transition-[margin] duration-300 overflow-hidden content-print-full",
                        collapsed ? "md:ml-[63px]" : "md:ml-[250px]"
                )}>
                    <div className="sticky top-0 left-0 right-0 p-3 bg-base-100 z-20 border-b border-base-300 no-print">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div 
                                    className="hidden md:block p-2 rounded-xl cursor-pointer hover:bg-base-200"
                                    onClick={() => setCollapsed(!collapsed)}
                                >
                                    {collapsed 
                                    ? <TbLayoutSidebarLeftExpand size={20}/> 
                                    : <TbLayoutSidebarLeftCollapse size={20}/>}
                                </div>
                                <div 
                                    className="md:hidden p-1 rounded-xl cursor-pointer hover:bg-base-200"
                                    onClick={() => setMobileOpen(true)}
                                >
                                    <LuMenu size={25} />
                                </div>
                                <div className="border-l border-gray-200 h-5 ml-3 mr-5"></div>
                                <p className="font-semibold">{getTitle(path)}</p>
                            </div>
                            <div>
                                <ThemeSwitcher />
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[calc(100vh-60px)] overflow-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainLayout;