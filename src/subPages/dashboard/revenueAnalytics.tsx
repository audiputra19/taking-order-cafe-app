import { useEffect, type FC } from "react";
import { MdOutlineTrendingFlat, MdOutlineTrendingUp } from "react-icons/md";
import { RiMoneyDollarBoxFill, RiMoneyDollarCircleLine } from "react-icons/ri";
import { TbCirclePercentage } from "react-icons/tb";
import BarChart from "../../components/charts/barChart";
import DonutChart from "../../components/charts/DonutChart";
import LineChart, { type RangeType } from "../../components/charts/lineChart";
import { getCategoryName } from "../../components/getCategoryName";
import { getRangeLineChart } from "../../components/getRangeLineChart";
import { useAverageOrderValueMutation, useRevenueByCategoryMutation, useRevenueByProductMutation, useRevenueTrendQuery, useTopPaymentMethodMutation, useTotalProfitMutation, useTotalRevenueMutation } from "../../services/apiDashboard";

interface RevenueAnalyticsProps {
    selectPeriode: number;
}

export const RevenueAnalytics: FC<RevenueAnalyticsProps> = ({ selectPeriode }) => {
    const [totalRevenue, { data: getTotalRevenue, isLoading: isLoadingTotalRevenue }] = useTotalRevenueMutation();
    const [totalProfit, { data: getTotalProfit }] = useTotalProfitMutation();
    const [averageOrderValue, { data: getAverageOrderValue }] = useAverageOrderValueMutation();
    const [revenueByProduct, { data: getRevenueByProduct }] = useRevenueByProductMutation();
    const [revenueByCategory, { data: getRevenueByCategory }] = useRevenueByCategoryMutation();
    const { data: getRevenueTrend } = useRevenueTrendQuery();
    const [topPaymentMethod, { data: getTopPaymentMethod }] = useTopPaymentMethodMutation();

    useEffect(() => {
        if(selectPeriode) {
            totalRevenue({ periode: selectPeriode })
            totalProfit({ periode: selectPeriode })
            averageOrderValue({ periode: selectPeriode })
            revenueByProduct({ periode: selectPeriode })
            revenueByCategory({ periode: selectPeriode })
            topPaymentMethod({ periode: selectPeriode })
        }
    }, [selectPeriode])

    // console.log(getTopPaymentMethod);

    const colors = ["#011f4b",/*"#03396c","#005b96","#6497b1",*/"#b3cde0",]

    const generateGrowthPercent = (current: number, previous: number): string => {
        const curr = current || 0;
        const prev = previous || 0;

        if (prev > 0) {
            const percent = ((curr - prev) / prev) * 100;
            return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;
        } else if (curr > 0) {
            return "+100%";
        } else {
            return "0%";
        }
    }

    const renderTrendIcon = (current: number, previous: number) => {
        const curr = current ?? 0;
        const prev = previous ?? 0;

        if (prev === 0) {
            if (curr > 0) {
                return <MdOutlineTrendingUp size={25} className="text-green-500" />;
            }
            return <MdOutlineTrendingFlat size={25} className="text-gray-400" />;
        }

        return curr >= prev ? (
            <MdOutlineTrendingUp size={25} className="text-green-500" />
        ) : (
            <MdOutlineTrendingUp size={25} className="rotate-180 text-red-500" />
        );
    };

    return (
        <>
            <div>
                <p className="text-xl font-semibold flex items-center gap-2">
                    <RiMoneyDollarBoxFill size={28}/> 
                    Revenue Analytics
                </p>
            </div>

            {/* Part 1 */}

            <div className="mt-5">
                <div className="grid grid-cols-3 gap-5">
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div className="flex justify-between items-center">
                            <p className="text-lg text-gray-500 font-semibold">Total Revenue</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <RiMoneyDollarCircleLine size={35} className="text-green-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-2xl font-bold flex gap-1 items-center">
                                Rp. 
                                {isLoadingTotalRevenue ? (
                                    <div className="skeleton h-5 w-32"></div>
                                ) : (
                                    <span>{getTotalRevenue?.current.total_revenue.toLocaleString("id-ID") ?? 0}</span>
                                )}
                            </p>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                {renderTrendIcon(
                                    getTotalRevenue?.current.total_revenue ?? 0,
                                    getTotalRevenue?.previous.total_revenue ?? 0
                                )}
                                <p className="text-xs text-gray-400">
                                    {generateGrowthPercent(
                                        getTotalRevenue?.current.total_revenue ?? 0, 
                                        getTotalRevenue?.previous.total_revenue ?? 0
                                    )} 
                                    <span className="ml-1">from past month</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div className="flex justify-between items-center">
                            <p className="text-lg text-gray-500 font-semibold">Profit</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <RiMoneyDollarCircleLine size={35} className="text-yellow-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-2xl font-bold flex gap-1 items-center">
                                Rp. 
                                {isLoadingTotalRevenue ? (
                                    <div className="skeleton h-5 w-32"></div>
                                ) : (
                                    <span>{getTotalProfit?.current.total_profit.toLocaleString("id-ID") ?? 0}</span>
                                )}
                            </p>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                {renderTrendIcon(
                                    getTotalProfit?.current.total_profit ?? 0,
                                    getTotalProfit?.previous.total_profit ?? 0
                                )}
                                <p className="text-xs text-gray-400">
                                    {generateGrowthPercent(
                                        getTotalProfit?.current.total_profit ?? 0, 
                                        getTotalProfit?.previous.total_profit ?? 0
                                    )} 
                                    <span className="ml-1">from past month</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div className="flex justify-between items-center">
                            <p className="text-lg text-gray-500 font-semibold">Average Order value</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <TbCirclePercentage size={35} className="text-blue-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-2xl font-bold flex gap-1 items-center">
                                Rp. 
                                {isLoadingTotalRevenue ? (
                                    <div className="skeleton h-5 w-32"></div>
                                ) : (
                                    <span>{getAverageOrderValue?.current.total.toLocaleString("id-ID") ?? 0}</span>
                                )}
                            </p>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                {renderTrendIcon(
                                    getAverageOrderValue?.current.total ?? 0,
                                    getAverageOrderValue?.previous.total ?? 0
                                )}
                                <p className="text-xs text-gray-400">
                                    {generateGrowthPercent(
                                        getAverageOrderValue?.current.total ?? 0, 
                                        getAverageOrderValue?.previous.total ?? 0
                                    )} 
                                    <span className="ml-1">from past month</span>
                                </p>
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
                            <p className="text-lg text-gray-500 font-semibold">Revenue by Product</p>
                        </div>
                        <div className="mt-3">
                            {getRevenueByProduct ? (
                                <BarChart
                                    data={getRevenueByProduct ?? []}
                                    height={150}
                                />
                            ) : (
                                <div className="flex justify-center mt-5">
                                    <p className="text-sm text-gray-400">No data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div>
                            <p className="text-lg text-gray-500 font-semibold">Revenue by Category</p>
                        </div>
                        <div className="mt-3">
                            {getRevenueByCategory ? (
                                <BarChart
                                    data={(getRevenueByCategory ?? []).map(d => ({
                                        category: getCategoryName(d.category),
                                        qty: Number(d.qty),
                                    }))}
                                    height={150}
                                />
                            ) : (
                                <div className="flex justify-center mt-5">
                                    <p className="text-sm text-gray-400">No data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Part 3 */}

            <div className="mt-5">
                <div className="grid grid-cols-3 gap-5">
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div>
                            <p className="text-lg text-gray-500 font-semibold">Top Payment Method</p>
                        </div>
                        <div className="mt-2">
                            {getTopPaymentMethod ? (
                                <DonutChart
                                    orders={getTopPaymentMethod ?? []} 
                                    height={250} 
                                    colors={colors}
                                />
                            ) : (
                                <div className="flex justify-center mt-5">
                                    <p className="text-sm text-gray-400">No data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2 border border-base-300 bg-base-100 p-5 rounded">
                        <div>
                            <p className="text-lg text-gray-500 font-semibold">Revenue Trend</p>
                        </div>
                        <div className="mt-3">
                            {getRevenueTrend ? (
                                <LineChart
                                    orders={getRevenueTrend ?? []}
                                    label="Revenue"
                                    range={getRangeLineChart(selectPeriode) as RangeType}
                                    height={240}
                                />
                            ) : (
                                <div className="flex justify-center mt-5">
                                    <p className="text-sm text-gray-400">No data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}