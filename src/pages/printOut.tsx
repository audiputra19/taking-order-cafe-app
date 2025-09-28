import type { FC } from "react";
import { useGetOrderByIdQuery } from "../services/apiOrder";
import { useParams } from "react-router-dom";
import { MdPrint } from "react-icons/md";
import moment from 'moment';
import "moment/dist/locale/id";

moment.locale("id");

const PrintOut: FC = () => {
    const { id = "" } = useParams();
    const { data: getOrderDetail = [] } = useGetOrderByIdQuery(id);
    let totalAll = 0;

    const handlePrint = () => {
        window.print()
    }

    return (
        <>
            <div className="flex flex-col gap-3 justify-center items-center">
                <div className="border border-base-300 rounded p-5 w-[450px]">
                    <div id="receipt">
                        <div className="flex justify-between">
                            <p className="text-xs font-semibold">
                                {getOrderDetail.length > 0 ? getOrderDetail[0].order_id : "-"}
                            </p>
                            <p className="text-xs font-semibold">
                                {getOrderDetail.length > 0
                                ? moment(getOrderDetail[0].created_at).format("dddd, DD MMM YYYY")
                                : "-"}
                            </p>
                        </div>
                        <div className="flex justify-center mt-10">
                            <p className="text-xl font-bold">Your receipt is here</p>
                        </div>
                        <div className="mt-10">
                            <p className="font-semibold">Payment Summary</p>
                            <table className="w-full mt-3 border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-sm">
                                        <th className="text-left">Items</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getOrderDetail.map(item => {
                                        totalAll += item.qty * item.harga;

                                        return (
                                            <tr 
                                                className="text-sm"
                                                key={item.nama}
                                            >
                                                <td className="max-w-[100px]">{item.nama}</td>
                                                <td className="text-center">{Number(item.qty).toLocaleString("id-ID")}</td>
                                                <td className="text-right">{Number(item.harga).toLocaleString("id-ID")}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div className="mt-5">
                                <div className="border border-dashed w-full"></div>
                            </div>
                            <div className="mt-5">
                                <div className="flex justify-between">
                                    <p className="font-bold">TOTAL</p>
                                    <p className="font-bold text-green-500">{totalAll.toLocaleString("id-ID")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end w-[450px]">
                    <button 
                        className="btn bg-gradient-to-r from-green-600 to-green-500 text-white border-none rounded"
                        onClick={handlePrint}
                    >
                        <MdPrint size={20} />
                        Print
                    </button>
                </div>
            </div>
            <style>{`
                @media print {
                    :root {
                        --color-base-100: oklch(100% 0 0);
                        --color-base-200: oklch(98% 0 0);
                        --color-base-300: oklch(92.8% 0.006 264.531);
                        --color-base-content: oklch(21% 0.006 285.885);
                        --color-primary: oklch(45% 0.24 277.023);
                        --color-primary-content: oklch(93% 0.034 272.788);
                        --color-secondary: oklch(65% 0.241 354.308);
                        --color-secondary-content: oklch(94% 0.028 342.258);
                        --color-accent: oklch(77% 0.152 181.912);
                        --color-accent-content: oklch(38% 0.063 188.416);
                        --color-neutral: oklch(14% 0.005 285.823);
                        --color-neutral-content: oklch(92% 0.004 286.32);
                        --color-info: oklch(74% 0.16 232.661);
                        --color-info-content: oklch(29% 0.066 243.157);
                        --color-success: oklch(76% 0.177 163.223);
                        --color-success-content: oklch(37% 0.077 168.94);
                        --color-warning: oklch(82% 0.189 84.429);
                        --color-warning-content: oklch(41% 0.112 45.904);
                        --color-error: oklch(71% 0.194 13.428);
                        --color-error-content: oklch(27% 0.105 12.094);
                    }

                    html {
                        color-scheme: light !important;
                    }

                    body * {
                        visibility: hidden;
                    }
                    #receipt, #receipt * {
                        visibility: visible;
                    }
                    #receipt {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%; /* biar full page saat print */
                    }
                }
            `}</style>
        </>
    )
}

export default PrintOut;