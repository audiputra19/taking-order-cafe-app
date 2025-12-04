import { useEffect, type FC } from "react";
import { LuBadgeCheck, LuBadgePercent, LuBadgeX } from "react-icons/lu";
import { MdCheckCircleOutline, MdInsertChart, MdOutlineInfo, MdOutlineTrendingFlat, MdOutlineTrendingUp } from "react-icons/md";
import BarChart from "../../components/charts/barChart";
import DonutChart from "../../components/charts/DonutChart";
import LineChart, { type RangeType } from "../../components/charts/lineChart";
import { getCategoryName } from "../../components/getCategoryName";
import { getRangeLineChart } from "../../components/getRangeLineChart";
import { useAverageFulfillmentTimeMutation, useAverageOrderMutation, useBestSellingProductsMutation, useCategoryPerformanceMutation, useLowestSellingProductsMutation, useOrderCanceledMutation, useOrderTrendQuery, usePeakOrderTimeMutation, useTotalOrderMutation } from "../../services/apiDashboard";

interface SalesPerformanceProps {
    selectPeriode: number;
}

export const SalesPerformance: FC<SalesPerformanceProps> = ({ selectPeriode }) => {
    const [totalOrder, { data: getTotalOrder, isLoading: isLoadingGetTotalOrder }] = useTotalOrderMutation();
    const [orderCanceled, { data: getOrderCanceled, isLoading: isLoadingGetOrderCanceled }] = useOrderCanceledMutation();
    const [averageOrder, { data: getAverageOrder, isLoading: isLoadingGetAverageOrder }] = useAverageOrderMutation();
    const [categoryPerformance, { data: getCategoryPerformance }] = useCategoryPerformanceMutation();
    const { data: getOrderTrend } = useOrderTrendQuery(undefined, {
        refetchOnReconnect: true,
        refetchOnFocus: true
    });
    const [bestSellingProd, { data: getBestSellingProd }] = useBestSellingProductsMutation();
    const [lowestSellingProd, { data: getLowestSellingProd }] = useLowestSellingProductsMutation();
    const [averageFulfillmentTime, { data: getAverageFulFillmentTime, isLoading: isLoadingGetAverageFulFillmentTime }] = useAverageFulfillmentTimeMutation();
    const [peakOrderTime, { data: getPeakOrderTime }] = usePeakOrderTimeMutation();

    // console.log(getAverageFulFillmentTime)
    
    useEffect(() => {
        if(selectPeriode) {
            totalOrder({ periode: selectPeriode });
            orderCanceled({ periode: selectPeriode });
            averageOrder({ periode: selectPeriode });
            categoryPerformance({ periode: selectPeriode });
            bestSellingProd({ periode: selectPeriode });
            lowestSellingProd({ periode: selectPeriode });
            averageFulfillmentTime({ periode: selectPeriode });
            peakOrderTime({ periode: selectPeriode });
        }
    }, [selectPeriode])
    
    const generateGrowthPercent = (current: number, previous: number): string => {
        const curr = current || 0;
        const prev = previous || 0;

        if (prev === 0 && curr > 0) return "+100%";
        if (prev === 0 && curr === 0) return "0%";

        let percent = ((curr - prev) / prev) * 100;

        return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;
    };

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

    const colorBest = ["#011f4b","#03396c","#005b96","#6497b1","#b3cde0",]
    const colorLowest = ["#a70000","#ff0000","#ff5252","#ff7b7b","#ffbaba",]

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
                            <p className="text-lg text-gray-500 font-semibold">Total Order</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <LuBadgeCheck size={35} className="text-green-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            {isLoadingGetTotalOrder ? (
                                <div className="skeleton h-5 w-32"></div>
                            ) : (
                                <p className="text-2xl font-bold">{getTotalOrder?.current.total_order ?? 0} orders</p>
                            )}
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                {renderTrendIcon(
                                    getTotalOrder?.current.total_order ?? 0,
                                    getTotalOrder?.previous.total_order ?? 0
                                )}
                                <p className="text-xs text-gray-400">
                                    {generateGrowthPercent(
                                        getTotalOrder?.current.total_order ?? 0, 
                                        getTotalOrder?.previous.total_order ?? 0
                                    )} 
                                    <span className="ml-1">from past month</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div className="flex justify-between items-center">
                            <p className="text-lg text-gray-500 font-semibold">Order Canceled</p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <LuBadgeX size={35} className="text-red-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            {isLoadingGetOrderCanceled ? (
                                <div className="skeleton h-5 w-32"></div>
                            ) : (
                                <p className="text-2xl font-bold">{getOrderCanceled?.current.total_order ?? 0} orders</p>
                            )}
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                {renderTrendIcon(
                                    getOrderCanceled?.current.total_order ?? 0,
                                    getOrderCanceled?.previous.total_order ?? 0
                                )}
                                <p className="text-xs text-gray-400">
                                    {generateGrowthPercent(
                                        getOrderCanceled?.current.total_order ?? 0, 
                                        getOrderCanceled?.previous.total_order ?? 0
                                    )} 
                                    <span className="ml-1">from past month</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-base-300 bg-base-100 p-5 rounded">
                        <div className="flex justify-between items-center">
                            <p className="text-lg text-gray-500 font-semibold">
                                Average Orders per {getAverageOrder?.current.unit ?? 'days'}
                            </p>
                            <div className="border border-base-300 p-1 bg-base-200 rounded-full">
                                <LuBadgePercent size={35} className="text-blue-500"/>    
                            </div>
                        </div>
                        <div className="mt-1">
                            {isLoadingGetAverageOrder ? (
                                <div className="skeleton h-5 w-32"></div>
                            ) : (
                                <p className="text-2xl font-bold">
                                    {getAverageOrder?.current.average ?? 0} orders / {getAverageOrder?.current.unit ?? 'days'}
                                </p>
                            )}
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                {renderTrendIcon(
                                    getAverageOrder?.current.average ?? 0,
                                    getAverageOrder?.previous.average ?? 0
                                )}
                                <p className="text-xs text-gray-400">
                                    {generateGrowthPercent(
                                        getAverageOrder?.current.average ?? 0, 
                                        getAverageOrder?.previous.average ?? 0
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
                            <p className="text-lg text-gray-500 font-semibold">Order Trend</p>
                        </div>
                        <div className="mt-3">
                            {getOrderTrend ? (
                                <LineChart
                                    orders={getOrderTrend ?? []}
                                    label="Orders"
                                    range={getRangeLineChart(selectPeriode) as RangeType}
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
                            <p className="text-lg text-gray-500 font-semibold">Category Performance</p>
                        </div>
                        <div className="mt-3">
                            {getCategoryPerformance ? (
                                <BarChart
                                    data={(getCategoryPerformance ?? []).map(d => ({
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
                    <div className="row-span-2 border border-base-300 bg-base-100 p-5 rounded">
                        <div>
                            <p className="text-lg text-gray-500 font-semibold">Top 5 Best-Selling Products</p>
                        </div>
                        <div className="mt-2">
                            {getBestSellingProd ? (
                                <DonutChart 
                                    orders={getBestSellingProd ?? []} 
                                    height={380}
                                    colors={colorBest}
                                />
                            ) : (
                                <div className="flex justify-center mt-5">
                                    <p className="text-sm text-gray-400">No data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 row-span-2">
                        <div className="border border-base-300 bg-base-100 p-5 rounded">
                            <div className="flex justify-between items-center">
                                <p className="text-lg text-gray-500 font-semibold">Average Fulfillment Time</p>
                            </div>
                            <div className="mt-2">
                                {isLoadingGetAverageFulFillmentTime ? (
                                    <div className="skeleton h-5 w-32"></div>
                                ) : (
                                    <p className="text-2xl font-bold">
                                        {getAverageFulFillmentTime?.total ?? 0} minutes
                                    </p>
                                )}
                            </div>
                            <div className="mt-2">
                                <div className="flex flex-col gap-1 border border-base-300 bg-base-200 rounded p-3 text-xs text-gray-500">
                                    <div className="flex">
                                        <p className="w-18">Acc Kasir</p>
                                        {isLoadingGetAverageFulFillmentTime ? (
                                            <div className="skeleton h-3 w-32"></div>
                                        ) : (
                                            <span>: {getAverageFulFillmentTime?.acc_kasir ?? 0} minutes</span>
                                        )}
                                    </div>
                                    <div className="flex">
                                        <p className="w-18">Acc Dapur</p>
                                        {isLoadingGetAverageFulFillmentTime ? (
                                            <div className="skeleton h-3 w-32"></div>
                                        ) : (
                                            <span>: {getAverageFulFillmentTime?.acc_dapur ?? 0} minutes</span>
                                        )}
                                    </div>
                                    <div className="flex">
                                        <p className="w-18">Ready</p>
                                        {isLoadingGetAverageFulFillmentTime ? (
                                            <div className="skeleton h-3 w-32"></div>
                                        ) : (
                                            <span>: {getAverageFulFillmentTime?.ready ?? 0} minutes</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                    {getAverageFulFillmentTime && 
                                    getAverageFulFillmentTime?.total < 15 && (
                                        <div className="flex items-center gap-2">
                                            <MdCheckCircleOutline size={20} className="text-green-500"/>
                                            <p className="text-xs text-gray-400">The process is good</p>
                                        </div>
                                    )}

                                    {getAverageFulFillmentTime && getAverageFulFillmentTime?.total > 15 && (
                                        <div className="flex items-center gap-2">
                                            <MdOutlineInfo size={20} className="text-red-500"/>
                                            <p className="text-xs text-gray-400">The process takes too long</p>
                                        </div>
                                    )}
                            </div>
                        </div>
                        <div className="border border-base-300 bg-base-100 p-5 rounded h-full">
                            <div>
                                <p className="text-lg text-gray-500 font-semibold">Peak Order Time</p>
                            </div>
                            <div className="mt-3">
                                {getPeakOrderTime ? (
                                    <BarChart
                                        data={getPeakOrderTime ?? []}
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
                    <div className="row-span-2 border border-base-300 bg-base-100 p-5 rounded">
                        <div>
                            <p className="text-lg text-gray-500 font-semibold">Top 5 Lowest-Selling Products</p>
                        </div>
                        <div className="mt-2">
                            {getLowestSellingProd ? (
                                <DonutChart 
                                    orders={getLowestSellingProd ?? []} 
                                    height={380}
                                    colors={colorLowest}
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