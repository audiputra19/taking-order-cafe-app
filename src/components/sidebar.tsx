import clsx from "clsx";
import type { FC } from "react";
import { BiMessageSquareEdit, BiQr } from "react-icons/bi";
import { LuCircleUser, LuLogOut, LuSquareArrowUpRight } from "react-icons/lu";
import { MdOutlineSpaceDashboard, MdOutlineStickyNote2 } from "react-icons/md";
import { PiCoffeeBeanFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store";
import { clearToken } from "../store/authSlice";
import { usePostMeQuery } from "../services/apiAuth";
import { useGetCompanyProfileQuery } from "../services/apiProfile";
import { BASE_URL } from "./BASE_URL";

interface SidebarProps {
    pathname: string;
    collapsed: boolean;
}

const Sidebar: FC<SidebarProps> = ({ pathname, collapsed }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { data: MeData } = usePostMeQuery();
    const user = MeData?.user;
    const { data: getCompanyProfile } = useGetCompanyProfileQuery(undefined, {
        refetchOnReconnect: true,
        refetchOnFocus: true
    })

    let bagian = ''
    switch(user?.hak_akses) {
        case 1:
            bagian = 'Admin';
            break;
        case 2:
            bagian = 'Kasir';
            break;
        case 3:
            bagian = 'Dapur';
            break;        
    }

    const menu = [
        {
            id: 1,
            name: 'Dashboard',
            path: '/',
            icon: <MdOutlineSpaceDashboard size={20}/>
        },
        {
            id: 2,
            name: 'Orders',
            path: '/order',
            icon: <MdOutlineStickyNote2 size={20}/>
        },
        {
            id: 3,
            name: 'Input',
            path: '/input',
            icon: <BiMessageSquareEdit size={20}/>
        },
        {
            id: 4,
            name: 'QR Generator',
            path: '/qr-generate',
            icon: <BiQr size={20}/>
        },
    ];

    const listMenu = menu.map(item => {
        return (
            !collapsed ? (
                <div 
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={clsx(
                        "flex items-center gap-2 p-2 cursor-pointer rounded",
                        pathname === item.path 
                            ? 'bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white' 
                            : 'hover:bg-base-300'
                    )}
                >
                    <div className="w-[22px] flex justify-center items-center">
                        {item.icon}
                    </div>
                    {!collapsed && <p className="text-sm transition-all ease-in-out duration-300">{item.name}</p>}
                </div>    
            ) : (
                <div className="tooltip tooltip-right" data-tip={item.name}>
                    <div 
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={clsx(
                            "flex items-center gap-2 p-2 cursor-pointer rounded",
                            pathname === item.path 
                                ? 'bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white' 
                                : 'hover:bg-base-300'
                        )}
                    >
                        <div className="w-[22px] flex justify-center items-center">
                            {item.icon}
                        </div>
                        {!collapsed && <p className="text-sm transition-all ease-in-out duration-300">{item.name}</p>}
                    </div>
                </div>
            )
        )
    })

    return (
        <>
            <div className="min-h-screen bg-base-200 border-r border-base-300">
                <div 
                    className={clsx(
                        "sticky top-0",
                        !collapsed ? 'w-[250px] p-3' : 'w-[60px] p-3'
                    )}
                >
                    <div 
                        className={clsx(
                            "flex gap-3 items-center transition-all ease-in-out duration-300",
                            !collapsed ? 'p-2' : ''
                        )}
                    >
                        <div className="flex gap-3 items-center">
                            {getCompanyProfile ? (
                                <div className="w-9 h-9">
                                    <img 
                                        src={`${BASE_URL}${getCompanyProfile.image_path}`}
                                        alt={getCompanyProfile.image_title} 
                                        className="rounded"
                                    />
                                </div>    
                            ) : (
                                <div className={clsx(
                                    "flex justify-center items-center rounded bg-gradient-to-r from-green-600 to-green-500 w-9 h-9 text-base-200",
                                    !collapsed ? 'p-2' : ''
                                )}>
                                    <PiCoffeeBeanFill size={20}/>
                                </div>
                            )}
                            {!collapsed && (
                                <div>
                                    <p className="font-semibold">{getCompanyProfile?.name}</p>
                                    <p className="text-xs">Taking Order App</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-3">
                    {!collapsed && <p className="px-2 pb-3 text-xs">Menu</p>}
                    <div className="flex flex-col">
                        {listMenu}
                    </div>
                </div>
                <div 
                    className={clsx(
                        "fixed bottom-0 p-3",
                        !collapsed ? 'w-[250px]' : 'w-[60px]'
                    )}
                >
                    <div className="dropdown dropdown-right dropdown-end w-full">
                        <div 
                            tabIndex={0}
                            className={clsx(
                                "flex justify-between items-center rounded cursor-pointer transition-all ease-in-out duration-300 hover:bg-base-300",
                                !collapsed ? 'p-2' : ''
                            )}
                        >
                            <div className="flex gap-3 items-center">
                                {/* <img 
                                    src="https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg"
                                    alt="profile picture"
                                    className="w-9 h-9 object-cover rounded"
                                /> */}
                                <div className="w-9 h-9 rounded bg-black flex items-center justify-center text-blue-500 text-2xl font-semibold">
                                    {user?.nama?.charAt(0).toUpperCase() || "U"}
                                </div>
                                {!collapsed && (
                                    <div>
                                        <p className="font-semibold text-sm">{user?.nama}</p>
                                        <p className="text-xs">{bagian}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                {!collapsed && (<LuSquareArrowUpRight size={20}/>)}
                            </div>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded border border-base-300 p-0 ml-1 z-1 w-52 shadow-lg">
                            <div className="flex gap-3 px-3 pt-3 pb-2">
                                {/* <img 
                                    src="https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg"
                                    alt="profile picture"
                                    className="w-9 h-9 object-cover rounded"
                                /> */}
                                <div className="w-9 h-9 rounded bg-black flex items-center justify-center text-blue-500 text-2xl font-semibold">
                                    {user?.nama?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{user?.nama}</p>
                                    <p className="text-xs">{bagian}</p>
                                </div>  
                            </div>
                            <li 
                                className="border-b border-base-300 p-1"
                                onClick={() => {
                                    navigate('/company-profile');
                                    (document.activeElement as HTMLElement)?.blur();
                                }}
                            >
                                <span><LuCircleUser size={18} className="text-gray-500"/>Company Profile</span>
                            </li>
                            <li 
                                className="p-1"
                                onClick={() => dispatch(clearToken())}
                            >
                                <span><LuLogOut size={18} className="text-gray-500"/>Log Out</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;