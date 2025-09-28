import type { FC } from "react";
import { LuBadgeCheck, LuBadgePercent, LuBadgeX } from "react-icons/lu";
import { MdInsertChart, MdOutlineInfo, MdOutlineTrendingUp } from "react-icons/md";
import DonutChart from "../../components/charts/DonutChart";
import LineChart from "../../components/charts/lineChart";
import BarChart from "../../components/charts/barChart";
import { TbClockCheck } from "react-icons/tb";

export const SalesPerformance: FC = () => {
    const productOrders = [
        { name: "Chicken Katsu Ala Jepang", qty: 150 },
        { name: "Iced Caramel Latte", qty: 100 },
        { name: "Kopi Butterscotch", qty: 80 },
        { name: "French Fries", qty: 75 },
        { name: "Cheese Cake", qty: 55 },
    ];

    const categoryOrders = [
        { category: "Food", qty: 320 },
        { category: "Beverage", qty: 200 },
        { category: "Coffee", qty: 180 },
        { category: "Dessert", qty: 140 },
        { category: "Snack", qty: 90 },
    ];

    const peakOrderTime = [
        { category: "11 AM", qty: 52 },
        { category: "9 AM", qty: 48 },
        { category: "8 AM", qty: 36 },
    ];

    const orders = [
        { id: 1, createdAt: "2025-09-01T10:00:00Z", qty: 2 },
        { id: 2, createdAt: "2025-09-05T15:30:00Z", qty: 5 },
        { id: 3, createdAt: "2025-09-07T12:45:00Z", qty: 1 },
        { id: 4, createdAt: "2025-09-08T09:20:00Z", qty: 3 },
        { id: 5, createdAt: "2025-09-12T14:10:00Z", qty: 4 },
        { id: 6, createdAt: "2025-09-15T18:25:00Z", qty: 6 },
        { id: 7, createdAt: "2025-09-16T20:40:00Z", qty: 7 },
        { id: 8, createdAt: "2025-09-22T11:05:00Z", qty: 2 },
        { id: 9, createdAt: "2025-10-20T09:15:00Z", qty: 3 },
        { id: 10, createdAt: "2025-11-22T13:50:00Z", qty: 4 },
        { id: 11, createdAt: "2025-12-25T16:30:00Z", qty: 8 },
        { id: 12, createdAt: "2025-12-27T08:45:00Z", qty: 5 },
    ];

    const colorBest = ["#031F44","#07489C","#0B70F4","#63A3F8","#BBD7FC","#E7F1FE",]
    const colorLowest = ["#750000","#A30000","#FF0000","#FF5C5C","#FF8A8A","#FFE6E6",]

    return (
        <>
            <div>
                <p className="text-xl font-semibold flex items-center gap-2">
                    <MdInsertChart size={28}/> 
                    Sales Performance
                </p>
            </div>

            {/* Part 1 */}

            <div className="mt-5">
                <div className="grid grid-cols-3 gap-5">
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Total Order</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <LuBadgeCheck size={35} className="text-green-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-2xl font-bold">1086 orders</p>
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
                            <p className="text-lg font-semibold">Order Canceled</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <LuBadgeX size={35} className="text-red-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-2xl font-bold">12 orders</p>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                <MdOutlineTrendingUp size={25} className="text-green-500"/>
                                <p className="text-xs text-gray-400">+5% from past month</p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Average Orders per day</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <LuBadgePercent size={35} className="text-blue-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-2xl font-bold">36 orders / day</p>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                <MdOutlineTrendingUp size={25} className="text-green-500"/>
                                <p className="text-xs text-gray-400">+5% from past month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Part 2 */}

            <div className="mt-5">
                <div className="grid grid-cols-2 gap-5">
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div>
                            <p className="text-lg font-semibold">Order Trend</p>
                        </div>
                        <div className="mt-3">
                            <LineChart
                                orders={orders}
                                range="last30"
                                height={150}
                            />
                        </div>
                    </div>
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div>
                            <p className="text-lg font-semibold">Category Performance</p>
                        </div>
                        <div className="mt-3">
                            <BarChart
                                data={categoryOrders}
                                height={150}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Part 3 */}

            <div className="mt-5">
                <div className="grid grid-cols-3 gap-5">
                    <div className="row-span-2 border border-base-300 bg-base-100 p-5 rounded">
                        <div>
                            <p className="text-lg font-semibold">Top 5 Best-Selling Products</p>
                        </div>
                        <div className="mt-2">
                            <DonutChart 
                                orders={productOrders} 
                                height={380}
                                colors={colorBest}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 row-span-2">
                        <div className="border border-base-300 bg-base-100 p-5 rounded">
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold">Average Fulfillment Time</p>
                            </div>
                            <div className="mt-1">
                                <p className="text-2xl font-bold">20 minutes</p>
                            </div>
                            <div className="mt-1">
                                <div className="flex flex-col gap-1 border border-base-300 bg-base-200 rounded p-2 text-xs text-gray-500">
                                    <div className="flex">
                                        <p className="w-18">Acc Kasir</p>
                                        <span>: 1 menit</span>
                                    </div>
                                    <div className="flex">
                                        <p className="w-18">Acc Dapur</p>
                                        <span>: 5 menit</span>
                                    </div>
                                    <div className="flex">
                                        <p className="w-18">Ready</p>
                                        <span>: 14 menit</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center gap-2">
                                    <MdOutlineInfo size={20} className="text-red-500"/>
                                    <p className="text-xs text-gray-400">The process takes too long</p>
                                </div>
                            </div>
                        </div>
                        <div className="border border-base-300 bg-base-100 p-5 rounded h-full">
                            <div>
                                <p className="text-lg font-semibold">Peak Order Time</p>
                            </div>
                            <div className="mt-3">
                                <BarChart
                                    data={peakOrderTime}
                                    height={150}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row-span-2 border border-base-300 bg-base-100 p-5 rounded">
                        <div>
                            <p className="text-lg font-semibold">Top 5 Lowest-Selling Products</p>
                        </div>
                        <div className="mt-2">
                            <DonutChart 
                                orders={productOrders} 
                                height={380}
                                colors={colorLowest}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}