import clsx from "clsx";
import { useState, type FC } from "react";
import { BiMessageSquareEdit, BiQr } from "react-icons/bi";
import { LuCircleUser, LuLogOut, LuSquareArrowUpRight } from "react-icons/lu";
import { MdOutlineSpaceDashboard, MdOutlineStickyNote2 } from "react-icons/md";
import { PiCoffeeBeanFill } from "react-icons/pi";
import { TbBuildingStore } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { usePostMeQuery } from "../services/apiAuth";
import { useGetCompanyProfileQuery } from "../services/apiProfile";
import { useAppDispatch } from "../store";
import { clearToken } from "../store/authSlice";
import { BASE_URL } from "./BASE_URL";

interface SidebarProps {
    pathname: string;
    collapsed: boolean;
    onSelect?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ pathname, collapsed, onSelect }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { data: MeData } = usePostMeQuery();
    const user = MeData?.user;
    // console.log(user);
    const { data: getCompanyProfile } = useGetCompanyProfileQuery({
        outlet_id: user?.outlet_id
    }, {
        refetchOnReconnect: true,
        refetchOnFocus: true
    });
    const [openSubmenu, setOpenSubmenu] = useState<{ [key: number]: boolean }>({});

    const toggleSubmenu = (id: number) => {
        setOpenSubmenu(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };


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
            icon: <MdOutlineStickyNote2 size={20}/>,
            submenu: [
                { id: '2-1', name: "On Process", path: "/order-process" },
                { id: '2-2', name: "Completed", path: "/order-completed" },
            ]
        },
        {
            id: 3,
            name: 'Input',
            path: '/input',
            icon: <BiMessageSquareEdit size={20}/>,
            submenu: [
                { id: '3-1', name: "Item Input", path: "/item-input" },
                { id: '3-2', name: "Item List", path: "/item-list" },
                { id: '3-3', name: "Discontinue", path: "/discontinue" },
                { id: '3-6', name: "Voc Input", path: "/voc-input" },
                { id: '3-7', name: "Voc List", path: "/voc-list" },
            ]
        },
        {
            id: 4,
            name: 'Outlet',
            path: '/outlet',
            icon: <TbBuildingStore size={20}/>,
            submenu: [
                { id: '4-1', name: "Outlet Input", path: "/outlet-input" },
                { id: '4-2', name: "Outlet List", path: "/outlet-list" },
                { id: '4-3', name: "User Input", path: "/user-input" },
                { id: '4-4', name: "User List", path: "/user-list" },
            ]
        },
        {
            id: 5,
            name: 'QR Generator',
            path: '/qr-generate',
            icon: <BiQr size={20}/>
        },
    ];

    const listMenu = menu.map(item => {
        const isMobile = window.innerWidth < 768;

        return (
            <div key={item.id}>
                {!collapsed ? (
                    <>
                        <div 
                            onClick={() => {
                                if (item.submenu && isMobile) {
                                    toggleSubmenu(item.id);
                                    return;
                                }

                                onSelect?.();
                                navigate(item.path);
                            }}
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
                            {!collapsed && <p className="text-sm">{item.name}</p>}
                        </div>

                        {/* Submenu Mobile */}
                        <div
                            className={clsx(
                                "md:hidden ml-5 flex flex-col overflow-hidden transition-all duration-400 ease-in-out",
                                openSubmenu[item.id] ? "max-h-[300px] mt-1 mb-1" : "max-h-0"
                            )}
                        >
                            {item.submenu?.map(sub => (
                                <div key={sub.id} className="border-l-2 border-base-300">
                                    <div
                                        onClick={() => {
                                            navigate(sub.path);
                                            onSelect?.();
                                        }}
                                        className={clsx(
                                            "p-2 ml-2 rounded cursor-pointer text-sm",
                                            pathname === sub.path
                                                ? "bg-green-500 text-white"
                                                : "hover:bg-base-300"
                                        )}
                                    >
                                        {sub.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="tooltip tooltip-right" data-tip={item.name}>
                            <div 
                                onClick={() => {
                                    onSelect?.();
                                    navigate(item.path);
                                }}
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
                            </div>
                        </div>

                        {/* Submenu Mobile (collapsed mode) */}
                        <div
                            className={clsx(
                                "md:hidden ml-8 flex flex-col gap-1 overflow-hidden transition-all duration-400 ease-in-out",
                                openSubmenu[item.id] ? "max-h-[300px] mt-1" : "max-h-0"
                            )}
                        >
                            {item.submenu?.map(sub => (
                                <div
                                    key={sub.id}
                                    onClick={() => {
                                        navigate(sub.path);
                                        onSelect?.();
                                    }}
                                    className={clsx(
                                        "p-2 rounded cursor-pointer text-sm",
                                        pathname === sub.path
                                            ? "bg-green-500 text-white"
                                            : "hover:bg-base-300"
                                    )}
                                >
                                    {sub.name}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    })

    return (
        <>
            <div className="h-screen bg-base-200 border-r border-base-300 flex flex-col">
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
                <div className="flex-1 overflow-y-auto p-3">
                    {!collapsed && <p className="px-2 pb-3 text-xs">Menu</p>}
                    <div className="flex flex-col gap-1">
                        {listMenu}
                    </div>
                </div>
                <div className={clsx("p-3", !collapsed ? 'w-[250px]' : 'w-[60px]')}>
                    <div className="dropdown dropdown-top w-full">
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
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                {!collapsed && (
                                    <div>
                                        <p className="font-semibold text-sm">{user?.name}</p>
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
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{user?.name}</p>
                                    <p className="text-xs">{bagian}</p>
                                </div>  
                            </div>
                            <li 
                                className="border-b border-base-300 p-1"
                                onClick={() => {
                                    onSelect?.();
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