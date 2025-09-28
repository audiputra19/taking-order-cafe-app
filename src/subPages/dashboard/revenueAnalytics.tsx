import type { FC } from "react";
import DonutChart from "../../components/charts/DonutChart";
import { MdOutlineTrendingDown, MdOutlineTrendingUp } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { PiHandshake } from "react-icons/pi";
import { LuBadgeCheck } from "react-icons/lu";

export const RevenueAnalytics: FC = () => {
    const productOrders = [
        { name: "Chicken Katsu Ala Jepang", qty: 150 },
        { name: "Iced Caramel Latte", qty: 100 },
        { name: "Kopi Butterscotch", qty: 80 },
        { name: "French Fries", qty: 75 },
        { name: "Cheese Cake", qty: 55 },
    ];

    const colors = ["#031F44","#07489C","#0B70F4","#63A3F8","#BBD7FC","#E7F1FE",]

    return (
        <>
            <div>
                <div className="grid grid-cols-3 gap-5">
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Total Order</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <LuBadgeCheck size={35} className="text-green-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-2xl font-bold">857 orders</p>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                <MdOutlineTrendingUp size={25} className="text-green-500"/>
                                <p className="text-xs text-gray-400">+10% from past month</p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Total Sale</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <PiHandshake size={35} className="text-green-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-2xl font-bold">952 Items</p>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                <MdOutlineTrendingUp size={25} className="text-green-500"/>
                                <p className="text-xs text-gray-400">+8% from past month</p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Total Revenue</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <RiMoneyDollarCircleLine size={35} className="text-green-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-2xl font-bold">Rp. 52.000.000</p>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                <MdOutlineTrendingDown size={25} className="text-red-500"/>
                                <p className="text-xs text-gray-400">-5% from past month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="grid grid-cols-3 gap-5">
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div>
                            <p className="text-lg font-semibold">Top 3 Favorite Order</p>
                        </div>
                        <div className="mt-5">
                            <DonutChart
                                orders={productOrders} 
                                height={400} 
                                colors={colors}
                            />
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}