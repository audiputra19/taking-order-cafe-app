import { useState, type FC } from "react";
import { LuCalendar, LuSettings2 } from "react-icons/lu";
import { SalesPerformance } from "../subPages/dashboard/salesPerformance";
import { RevenueAnalytics } from "../subPages/dashboard/revenueAnalytics";

const Dashboard: FC = () => {
    const [selectFilter, setSelectFilter] = useState<number>(1);
    const [selectPeriode, setSelectPeriode] = useState<number>(1);
    const filter = selectFilter === 1 ? "Sales Performance" : "Revenue Analytics"

    return (
        <div className="w-full">
            {/* Filter */}
            <div className="flex justify-between gap-3">
                <div className="flex items-center gap-5">
                    <div className="dropdown dropdown-start">
                        <div 
                            tabIndex={0} 
                            className="flex items-center gap-3 text-sm font-semibold border border-base-300 px-3 py-2 rounded cursor-pointer"
                        >
                            <LuSettings2 size={18} className="text-green-500"/>
                            {filter}
                        </div>
                        <ul tabIndex={1} className="dropdown-content menu bg-base-100 border border-base-300 shadow-lg z-1 w-52 p-2 mt-2 rounded">
                            <li>
                                <a 
                                    onClick={() => {
                                        setSelectFilter(1);
                                        (document.activeElement as HTMLElement)?.blur();
                                    }}
                                >Sales Performance
                                </a>
                            </li>
                            <li>
                                <a 
                                    onClick={() => {
                                        setSelectFilter(2);
                                        (document.activeElement as HTMLElement)?.blur();
                                    }}
                                >Revenue Analytics
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="dropdown dropdown-start w-36">
                        <div 
                            tabIndex={1} 
                            className="flex items-center gap-3 text-sm font-semibold border border-base-300 px-3 py-2 rounded cursor-pointer"
                        >
                            <LuCalendar size={18} className="text-green-500"/>
                            {(selectPeriode === 1) 
                            ? "Last 30 days" 
                            : (selectPeriode === 2) 
                            ? "Last 3 month" 
                            : "Year to day"}
                        </div>
                        <ul tabIndex={1} className="dropdown-content menu bg-base-100 border border-base-300 shadow-lg z-1 w-52 p-2 mt-2 rounded">
                            <li>
                                <a 
                                    onClick={() => {
                                        setSelectPeriode(1);
                                        (document.activeElement as HTMLElement)?.blur();
                                    }}
                                >Last 30 days
                                </a>
                            </li>
                            <li>
                                <a 
                                    onClick={() => {
                                        setSelectPeriode(2);
                                        (document.activeElement as HTMLElement)?.blur();
                                    }}
                                >Last 3 month
                                </a>
                            </li>
                            <li>
                                <a 
                                    onClick={() => {
                                        setSelectPeriode(3);
                                        (document.activeElement as HTMLElement)?.blur();
                                    }}
                                >Year to day
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>  
            <div className="mt-10">
                {selectFilter === 1 ? (
                    <SalesPerformance selectPeriode={selectPeriode} />
                ) : (
                    <RevenueAnalytics selectPeriode={selectPeriode} />
                )}
            </div>
        </div>
    )
}

export default Dashboard;