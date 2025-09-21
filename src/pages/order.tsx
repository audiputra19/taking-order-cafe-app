import { useEffect, useState, type FC } from "react";
import { LuBookCheck, LuClock, LuPrinter } from "react-icons/lu";
import { Completed } from "../subPages/order/completed";
import { PendingPayment } from "../subPages/order/pendingPayment";
import PrintOut from "./printOut";
import { useLocation, useNavigate } from "react-router-dom";

const Order:FC = () => {
    const location = useLocation();
    const state = location.state?.from;
    const path = location.pathname;
    const isPrintPage = path.startsWith('/print-out');
    const [activeTab, setActiveTab] = useState<string>("pending");
    const navigate = useNavigate();

    useEffect(() => {
        if(state === "order-edit") {
            setActiveTab("completed");
        }
    }, [state]);

    return (
        <>
            <div className="tabs tabs-lift">
                <label 
                    className="tab z-0"
                    onClick={() => {
                        setActiveTab("pending");
                        navigate('/order');
                    }}
                >
                    <input type="radio" name="my_tabs_4" checked={activeTab === "pending"} readOnly />
                    <LuClock size={18} className="mr-2"/>
                    Pending Payment
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-5">
                    <PendingPayment />
                </div>

                <label 
                    className="tab"
                    onClick={() => {
                        setActiveTab("completed");
                        navigate('/order');
                    }}
                >
                    <input type="radio" name="my_tabs_4" checked={activeTab === "completed"} readOnly />
                    <LuBookCheck size={18} className="mr-2"/>
                    Completed
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-5">
                    <Completed />
                </div>

                {isPrintPage && (
                    <>
                        <label className="tab">
                            <input type="radio" name="my_tabs_4" defaultChecked />
                            <LuPrinter size={18} className="mr-2"/>
                            Print Out
                        </label>
                        <div className="tab-content bg-base-100 border-base-300 p-5">
                            <PrintOut />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Order;