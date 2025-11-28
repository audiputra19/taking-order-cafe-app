import moment from 'moment';
import { Fragment, useEffect, useState, type FC } from "react";
import { LuFileClock, LuPackageCheck } from 'react-icons/lu';
import { MdOutlineKeyboardArrowDown, MdOutlinePaid } from 'react-icons/md';
import { TbCurrencyDollarOff, TbRotateClockwise2 } from 'react-icons/tb';
import LoadingPage from '../../components/loadingPage';
import { usePostMeQuery } from '../../services/apiAuth';
import { useAcceptOrderByDapurMutation, useAcceptOrderByKasirMutation, useCancelOrderByKasirMutation, useFinishOrderMutation, useGetOrderQuery, useLazyGetOrderByIdQuery, usePaidOrderByKasirMutation, useReadyOrderMutation } from "../../services/apiOrder";
import { socket, socket2 } from "../../socket";
import clsx from 'clsx';
import { DetailRow } from '../../components/detailRow';

export const OnProcess: FC = () => {
    const { data: getOrder, isLoading: isLoadingGetOrder, isError, refetch } = useGetOrderQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const { data: MeData } = usePostMeQuery();
    const user = MeData?.user;
    const [paidByKasir, {isLoading: isLoadingPaidByKasir}] = usePaidOrderByKasirMutation();
    const [cancelByKasir, {isLoading: isLoadingCancelByKasir}] = useCancelOrderByKasirMutation();
    const [acceptByKasir, {isLoading: isLoadingAccByKasir}] = useAcceptOrderByKasirMutation();
    const [acceptByDapur, {isLoading: isLoadingAccByDapur}] = useAcceptOrderByDapurMutation();
    const [ready, {isLoading: isLoadingReady}] = useReadyOrderMutation();
    const [finish, {isLoading: isLoadingFinish}] = useFinishOrderMutation();
    const [openRow, setOpenRow] = useState<string | null>(null);
    const [fetchDetail, { data: getOrderDetail = [], isFetching }] = useLazyGetOrderByIdQuery();
    const subtotal = getOrderDetail.reduce((sum, d) => sum + d.qty * d.harga, 0);

    useEffect(() => {
        if(isError) {
            refetch();
        }
    }, [isError, refetch]);

    useEffect(() => {
        socket2.on("order:new", () => {
            refetch();
        });

        socket.on("order:update", () => {
            refetch();
        })

        socket2.on("order:update", () => {
            refetch();
        })

        return () => {
            socket2.off("order:new");
            socket.off("order:update");
            socket2.off("order:update");
        }
    }, [refetch]);

    function Confirm(): boolean {
        return window.confirm("Apakah Anda yakin ingin melanjutkan proses?");
    }

    const handlePaidByKasir = async (order_id: string) => {
        if (!Confirm()) return;
        await paidByKasir({ order_id });
        refetch();
    };

    const handleCancelByKasir = async (order_id: string) => {
        if (!Confirm()) return;
        await cancelByKasir({ order_id });
        refetch();
    };

    const handleAcceptByKasir = async (order_id: string) => {
        if (!Confirm()) return;
        await acceptByKasir({ order_id });
        refetch();
    };

    const handleAcceptByDapur = async (order_id: string) => {
        if (!Confirm()) return;
        await acceptByDapur({ order_id });
        refetch();
    };

    const handleReady = async (order_id: string) => {
        if (!Confirm()) return;
        await ready({ order_id });
        refetch();
    };

    const handleFinish = async (order_id: string) => {
        if (!Confirm()) return;
        await finish({ order_id });
        refetch();
    };

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
            {isLoadingGetOrder || isLoadingPaidByKasir || isLoadingCancelByKasir || isLoadingAccByKasir || 
            isLoadingAccByDapur || isLoadingReady || isLoadingFinish && (
                <LoadingPage />
            )}
            <div className="overflow-x-auto max-h-[435px]">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="text-center">Detail</th>
                            <th className="text-center">Oder ID</th>
                            <th className="text-center">Tanggal</th>
                            <th className="text-center">No. Meja</th>
                            <th className="text-center">Total</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Proses</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {getOrder && getOrder.length > 0 ? (
                        getOrder?.map((item, i) => {

                            let colorStatus = "border text";
                            let iconStatus = <TbCurrencyDollarOff size={16} />;
                            switch(item.status) {
                                case "paid":
                                    colorStatus = "border-green-500 text-green-500";
                                    iconStatus = <MdOutlinePaid size={16} />;
                                    break;     
                            }

                            let colorProses = "border text";
                            let iconProses = <LuFileClock size={16} />;
                            switch(item.proses) {
                                case "acc kasir":
                                    colorProses = "border-yellow-500 text-yellow-500";
                                    iconProses = <TbRotateClockwise2 size={16} />;
                                    break;

                                case "acc dapur":
                                    colorProses = "border-yellow-500 text-yellow-500";
                                    iconProses = <TbRotateClockwise2 size={16} />;
                                    break;

                                case "ready":
                                    colorProses = "border-blue-500 text-blue-500";
                                    iconProses = <LuPackageCheck size={16} />;  
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
                                                    {iconStatus}
                                                    <span>{item.status}</span>
                                                </div>
                                            </span>
                                        </td>
                                        <td className="text-center min-w-[150px]">
                                            <span className="flex justify-center items-center gap-2">
                                                <div 
                                                    className={`py-1 px-4 rounded text-xs flex justify-center items-center gap-2 border ${colorProses} font-bold`}
                                                >
                                                    {iconProses}
                                                    <span>{item.proses}</span>
                                                </div>
                                            </span>
                                        </td>
                                        <td className="text-center min-w-[160px]">
                                            {/* Hak Kasir */}
                                            {user?.hak_akses === 2 ? (
                                                item.metode === "cash" && item.status === "unpaid" ? (
                                                    <div className='flex justify-center items-center gap-2'>
                                                        <button
                                                            className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                                            onClick={() => handlePaidByKasir(item.order_id)}
                                                        >
                                                            Paid
                                                        </button>

                                                        {/* Cancel Button */}
                                                        <button
                                                            className="btn btn-sm bg-gradient-to-r from-red-600 to-red-500 text-white rounded border-none"
                                                            onClick={() => handleCancelByKasir(item.order_id)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    item.proses === "pending" ? (
                                                        <button
                                                            className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                                            onClick={() => handleAcceptByKasir(item.order_id)}
                                                        >
                                                            Proses By Kasir
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded border-none"
                                                        >
                                                            Sedang Diproses
                                                        </button>
                                                    )
                                                )
                                                
                                            // Hak Dapur    
                                            ) : user?.hak_akses === 3 ? (
                                                <>
                                                    {item.proses === "pending" && (
                                                        <button
                                                            className="btn btn-sm bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded border-none"
                                                        >
                                                            Belum Acc Kasir
                                                        </button>
                                                    )}
                                                    {item.proses === "acc kasir" && (
                                                        <button
                                                            className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                                            onClick={() => handleAcceptByDapur(item.order_id)}
                                                        >
                                                            Proses By Dapur
                                                        </button>
                                                    )}
                                                    {item.proses === "acc dapur" && (
                                                        <button
                                                            className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                                            onClick={() => handleReady(item.order_id)}
                                                        >
                                                            Pesanan Siap
                                                        </button>
                                                    )}
                                                    {item.proses === "ready" && (
                                                        <button
                                                            className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                                            onClick={() => handleFinish(item.order_id)}
                                                        >
                                                            Pesanan Selesai
                                                        </button>
                                                    )}
                                                </>

                                            // Hak Admin    
                                            ) : (
                                                <>
                                                    {item.metode === "cash" && item.status === "unpaid" ? (
                                                        <div className='flex justify-center items-center gap-2'>
                                                            <button
                                                                className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                                                onClick={() => handlePaidByKasir(item.order_id)}
                                                            >
                                                                Paid
                                                            </button>

                                                            {/* Cancel Button */}
                                                            <button
                                                                className="btn btn-sm bg-gradient-to-r from-red-600 to-red-500 text-white rounded border-none"
                                                                onClick={() => handleCancelByKasir(item.order_id)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {item.proses === "pending" && (
                                                                <button
                                                                    className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                                                    onClick={() => handleAcceptByKasir(item.order_id)}
                                                                >
                                                                    Proses By Kasir
                                                                </button>
                                                            )}
                                                            {item.proses === "acc kasir" && (
                                                                <button
                                                                    className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                                                    onClick={() => handleAcceptByDapur(item.order_id)}
                                                                >
                                                                    Proses By Dapur
                                                                </button>
                                                            )}
                                                            {item.proses === "acc dapur" && (
                                                                <button
                                                                    className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                                                    onClick={() => handleReady(item.order_id)}
                                                                >
                                                                    Pesanan Siap
                                                                </button>
                                                            )}
                                                            {item.proses === "ready" && (
                                                                <button
                                                                    className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                                                    onClick={() => handleFinish(item.order_id)}
                                                                >
                                                                    Pesanan Selesai
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                    <DetailRow show={openRow === item.order_id} colSpan={9}>
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
                                                    <div className="p-4">
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
        </>
    )
}