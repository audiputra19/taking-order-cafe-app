import clsx from "clsx";
import moment from "moment";
import { Fragment, useEffect, useState, type FC } from "react";
import { LuSettings2 } from "react-icons/lu";
import { MdClose, MdOutlineDoneOutline, MdOutlineKeyboardArrowDown, MdOutlinePaid, MdPrint } from "react-icons/md";
import { RiFileExcel2Line, RiFilePdf2Line } from "react-icons/ri";
import { TbCurrencyDollarOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { DetailRow } from "../../components/detailRow";
import { exportOrdersToExcel } from "../../components/orderToExcel";
import { exportOrdersToPDF } from "../../components/orderToPdf";
import { useGetOrderCompleteQuery, useLazyGetOrderByIdQuery } from "../../services/apiOrder";
import { socket, socket2 } from "../../socket";

export const Completed: FC = () => {
    const currentYear = moment().year();
    const years = [currentYear, currentYear - 1, currentYear - 2];
    const months = [
        { label: "Semua Bulan", value: 0 },
        { label: "Januari", value: 1 },
        { label: "Februari", value: 2 },
        { label: "Maret", value: 3 },
        { label: "April", value: 4 },
        { label: "Mei", value: 5 },
        { label: "Juni", value: 6 },
        { label: "Juli", value: 7 },
        { label: "Agustus", value: 8 },
        { label: "September", value: 9 },
        { label: "Oktober", value: 10 },
        { label: "November", value: 11 },
        { label: "Desember", value: 12 }
    ];
    const process = [
        { label: "Semua Status", value: "all" },
        { label: "Done", value: "done" },
        { label: "Canceled", value: "canceled" },
    ];
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(0);
    const [selectedProcess, setSelectedProcess] = useState<string>("all");
    const { data: getOrder, refetch } = useGetOrderCompleteQuery(
        { year: selectedYear, month: selectedMonth, process: selectedProcess }, 
        { refetchOnMountOrArgChange: true }
    );
    const [fetchDetail, { data: getOrderDetail = [], isFetching }] = useLazyGetOrderByIdQuery();
    const [openRow, setOpenRow] = useState<string | null>(null);
    const navigate = useNavigate();
    const subtotal = getOrderDetail.reduce((sum, d) => sum + d.qty * d.harga, 0);
    const grandTotal = getOrder?.reduce((sum, x) => sum + x.total, 0) ?? 0;

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
        <>
            <div className="flex justify-between items-center gap-3">
                <div className="flex gap-3">
                    <div className="dropdown dropdown-start">
                        <div
                            tabIndex={0}
                            className="flex items-center gap-3 text-sm font-semibold border border-base-300 px-3 py-2 rounded cursor-pointer"
                        >
                            <LuSettings2 size={18} className="text-green-500" />
                            {selectedYear}
                        </div>

                        <ul
                            tabIndex={1}
                            className="dropdown-content menu bg-base-100 border border-base-300 shadow-lg z-1 w-52 p-2 mt-2 rounded"
                        >
                            {years.map((y) => (
                                <li key={y}>
                                    <a
                                        onClick={() => {
                                            setSelectedYear(y);
                                            (document.activeElement as HTMLElement)?.blur();
                                        }}
                                    >
                                        {y}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="dropdown dropdown-start">
                        <div tabIndex={0} className="flex items-center gap-3 text-sm font-semibold border border-base-300 px-3 py-2 rounded cursor-pointer">
                            <LuSettings2 size={18} className="text-green-500" />
                            {months.find((m) => m.value === selectedMonth)?.label}
                        </div>
                        <ul tabIndex={1} className="dropdown-content menu bg-base-100 border border-base-300 shadow-lg z-1 w-52 p-2 mt-2 rounded">
                            {months.map((m) => (
                                <li key={m.value}>
                                    <a onClick={() => { setSelectedMonth(m.value); (document.activeElement as HTMLElement)?.blur(); }}>
                                        {m.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="dropdown dropdown-start">
                        <div tabIndex={0} className="flex items-center gap-3 text-sm font-semibold border border-base-300 px-3 py-2 rounded cursor-pointer">
                            <LuSettings2 size={18} className="text-green-500" />
                            {process.find((p) => p.value === selectedProcess)?.label}
                        </div>
                        <ul tabIndex={1} className="dropdown-content menu bg-base-100 border border-base-300 shadow-lg z-1 w-52 p-2 mt-2 rounded">
                            {process.map((p) => (
                                <li key={p.value}>
                                    <a onClick={() => { setSelectedProcess(p.value); (document.activeElement as HTMLElement)?.blur(); }}>
                                        {p.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="btn btn-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded border-none"
                        onClick={() =>
                            exportOrdersToExcel(
                                getOrder ?? [],
                                fetchDetail,
                                {
                                    year: selectedYear,
                                    month: selectedMonth,
                                    status: selectedProcess
                                }
                            )
                        }
                    >
                        <RiFileExcel2Line size={17}/>Export Excel
                    </button>
                    <button
                        className="btn btn-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded border-none"
                        onClick={() => 
                            exportOrdersToPDF(
                                getOrder ?? [],
                                fetchDetail,
                                {
                                    year: selectedYear,
                                    month: selectedMonth,
                                    status: selectedProcess
                                }
                            )
                        }
                    >
                        <RiFilePdf2Line size={17}/>Export Pdf
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto max-h-[378px] mt-5">
                <table className="table table-zebra">
                    <thead className="sticky top-0 bg-base-100 z-10">
                        <tr>
                            <th></th>
                            <th className="text-center">Detail</th>
                            <th className="text-center">Oder ID</th>
                            <th className="text-center">Tanggal</th>
                            <th className="text-center">No. Meja</th>
                            <th className="text-center">Total</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Proses</th>
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
                                case "failed":
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
                                        <th className="text-center">{i + 1}</th>
                                        <td className="flex justify-center items-center">
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
                                        <td className="text-center min-w-[230px]">{item.order_id}</td>
                                        <td className="text-center min-w-[185px]">{moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                                        <td className="text-center">{item.meja}</td>
                                        <td className="text-right min-w-[135px]">Rp. {item.total.toLocaleString("id-ID")}</td>
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
                                    </tr>

                                    <DetailRow show={openRow === item.order_id} colSpan={8}>
                                        {isFetching ? (
                                            <div className="p-2 text-gray-500">Loading detail...</div>
                                        ) : getOrderDetail.length > 0 ? (
                                            <div className="border-l-4 border-green-500">
                                                <div className="overflow-x-auto border-y border-r border-base-300">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center w-12"></th>
                                                                <th>Nama Produk</th>
                                                                <th className="text-center">Catatan</th>
                                                                <th className="text-center w-20">Varian</th>
                                                                <th className="text-center w-20">Qty</th>
                                                                <th className="text-right w-32">Harga</th>
                                                                <th className="text-right w-32">Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getOrderDetail.map((d, idx) => (
                                                            <tr key={`${d.order_id}-${idx}`}>
                                                                <td className="text-center">{idx + 1}</td>
                                                                <td className="font-semibold">{d.nama}</td>
                                                                <td className="text-left">{d.catatan ? d.catatan : '-'}</td>
                                                                <td className="text-center">{d.tipe ? d.tipe : '-'}</td>
                                                                <td className="text-center">{d.qty}</td>
                                                                <td className="text-right">{Number(d.harga).toLocaleString("id-ID")}</td>
                                                                <td className="text-right">
                                                                {(d.qty * d.harga).toLocaleString("id-ID")}
                                                                </td>
                                                            </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <div className="p-4 border-base-300 border-b">
                                                        {/* SUBTOTAL */}
                                                        <div className="flex justify-end items-center mb-3">
                                                            <div className="font-semibold text-gray-500">Subtotal</div>
                                                            <div className="font-semibold text-end min-w-[100px]">
                                                                {subtotal.toLocaleString("id-ID")}
                                                            </div>
                                                        </div>

                                                        {/* VOUCHER (JIKA ADA) */}
                                                        {item.voucher && (
                                                            <div className="flex justify-end items-center mb-3">
                                                                <div className="text-gray-500 text-sm">
                                                                    Voucher {item.voucher} ({item.diskon}%)
                                                                </div>
                                                                <div className="text-sm text-red-500 text-end min-w-[100px]">
                                                                    -{((subtotal * item.diskon) / 100).toLocaleString("id-ID")}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* TOTAL SETELAH DISKON */}
                                                        <div className="flex justify-end items-center mt-2 pt-3 border-t border-base-300">
                                                            <div className="font-bold text-green-600">Total</div>
                                                            <div className="font-bold text-green-600 text-end min-w-[100px]">
                                                                {(
                                                                    subtotal -
                                                                    (item.voucher ? (subtotal * item.diskon) / 100 : 0)
                                                                ).toLocaleString("id-ID")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end p-4">
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
                    <tfoot className="sticky bottom-0 bg-base-100">
                        <tr>
                            <th colSpan={5} className="text-right font-bold">Total</th>
                            <th className="text-right font-bold">
                                Rp. {grandTotal.toLocaleString("id-ID")}
                            </th>
                            <th colSpan={2}></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}