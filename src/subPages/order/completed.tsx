import clsx from "clsx";
import moment from "moment";
import { Fragment, useEffect, useState, type FC } from "react";
import { MdClose, MdOutlineDoneOutline, MdOutlineKeyboardArrowDown, MdOutlinePaid, MdPrint } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { DetailRow } from "../../components/detailRow";
import { useGetOrderCompleteQuery, useLazyGetOrderByIdQuery } from "../../services/apiOrder";
import { socket, socket2 } from "../../socket";
import { TbCurrencyDollarOff } from "react-icons/tb";

export const Completed: FC = () => {
    const { data: getOrder, refetch } = useGetOrderCompleteQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    const [fetchDetail, { data: getOrderDetail = [], isFetching }] = useLazyGetOrderByIdQuery();
    const [openRow, setOpenRow] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("order:update", () => {
            refetch();
        })

        socket2.on("order:update", () => {
            refetch();
        })

        return () => {
            socket.off("order:update");
            socket2.off("order:update");
        }
    }, [refetch]);

    const toggleRow = async (orderId: string) => {
        if (openRow === orderId) {
            setOpenRow(null);
        } else {
            setOpenRow(orderId);
            await fetchDetail(orderId).unwrap();
        }
    };

    return (
        <div className="overflow-x-auto max-h-[435px]">
            <table className="table table-zebra">
                <thead className="sticky top-0 bg-base-100 z-10">
                    <tr>
                        <th></th>
                        <th className="text-center">Oder ID</th>
                        <th className="text-center">Tanggal</th>
                        <th className="text-center">No. Meja</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Status Pembayaran</th>
                        <th className="text-center">Proses</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {getOrder && getOrder.length > 0 ? (
                    getOrder?.map((item, i) => {
                        let colorStatus = "border-green-500 text-green-500";
                        let iconStatus = <MdOutlinePaid size={16}/>;
                        switch(item.status) {
                            case "expired":
                                colorStatus = "border-red-500 text-red-500";
                                iconStatus = <TbCurrencyDollarOff size={16} />;
                                break;
                            case "canceled":
                                colorStatus = "border-red-500 text-red-500";
                                iconStatus = <TbCurrencyDollarOff size={16} />;
                                break;        
                        }

                        let colorProses = "border-green-500 text-green-500";
                        let iconProses = <MdOutlineDoneOutline size={16}/>;
                        switch(item.proses) {
                            case "canceled":
                                colorProses = "border-red-500 text-red-500";
                                iconProses = <MdClose size={16} />;
                                break;     
                        }

                        return (
                            <Fragment key={item.order_id}>
                                <tr>
                                    <th>{i + 1}</th>
                                    <td className="text-center">
                                        <span className="border border-base-300 rounded-xl p-2 font-semibold">{item.order_id}</span>
                                    </td>
                                    <td className="text-center">{moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                                    <td className="text-center">{item.meja}</td>
                                    <td className="text-right">Rp. {item.total.toLocaleString("id-ID")}</td>
                                    <td className="text-center">
                                        <span className="flex justify-center items-center gap-2">
                                            <div 
                                                className={`py-1 px-4 rounded text-xs flex justify-center items-center gap-2 border ${colorStatus} font-bold`}
                                            >
                                                {iconStatus}<span>{item.status}</span>
                                            </div>
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <span className="flex justify-center items-center gap-2">
                                            <div 
                                                className={`py-1 px-4 rounded text-xs flex justify-center items-center gap-2 border ${colorProses} font-bold`}
                                            >
                                                {iconProses}<span>{item.proses}</span>
                                            </div>
                                        </span>
                                    </td>
                                    <td>
                                        <div 
                                            className={clsx("w-7 h-7 border-2 flex justify-center items-center rounded-full cursor-pointer",
                                                openRow === item.order_id
                                                ? "border-green-500 bg-green-500 text-white"
                                                : "border-base-300 bg-base-100"
                                            )}
                                            onClick={() => toggleRow(item.order_id)}
                                        >
                                            <MdOutlineKeyboardArrowDown
                                                size={20}
                                                className={clsx(
                                                    "transition-transform duration-200 ease-in-out",
                                                    openRow === item.order_id ? "rotate-180" : "rotate-0"
                                                )}
                                            />
                                        </div>
                                    </td>
                                </tr>

                                <DetailRow show={openRow === item.order_id}>
                                    {isFetching ? (
                                        <div className="p-2 text-gray-500">Loading detail...</div>
                                    ) : getOrderDetail.length > 0 ? (
                                        <div className="border-l-4 border-green-500">
                                            <div className="overflow-x-auto border-y border-r border-base-300">
                                                <table className="table">
                                                    <thead>
                                                        <tr className="text-green-500">
                                                            <th className="text-center w-12"></th>
                                                            <th>Nama Produk</th>
                                                            <th className="text-center w-20">Qty</th>
                                                            <th className="text-right w-32">Harga</th>
                                                            <th className="text-right w-32">Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getOrderDetail.map((d, idx) => (
                                                        <tr key={`${d.order_id}-${idx}`}>
                                                            <td className="text-center">{idx + 1}</td>
                                                            <td className="font-medium">{d.nama}</td>
                                                            <td className="text-center">{d.qty}</td>
                                                            <td className="text-right">{Number(d.harga).toLocaleString("id-ID")}</td>
                                                            <td className="text-right">
                                                            {(d.qty * d.harga).toLocaleString("id-ID")}
                                                            </td>
                                                        </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="font-semibold text-green-500">
                                                            <td colSpan={4} className="text-right pr-4">Total</td>
                                                            <td className="text-right">
                                                                {getOrderDetail
                                                                .reduce((sum, d) => sum + d.qty * d.harga, 0)
                                                                .toLocaleString("id-ID")}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                                <div className="flex justify-end px-4 pb-4">
                                                    <button
                                                        className="btn btn-sm border-none rounded bg-gradient-to-r from-green-600 to-green-500 text-white"
                                                        onClick={() => navigate(`/print-out/${item.order_id}`)}
                                                    >
                                                        <MdPrint size={18}/>
                                                        Print                
                                                    </button>                    
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-gray-500">Tidak ada detail.</div>
                                    )}
                                </DetailRow>
                            </Fragment>
                        )
                    })
                ) : (
                    <tr>
                        <td colSpan={8} className="text-center py-3 text-gray-500 bg-base-100">
                            No data available in table
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}