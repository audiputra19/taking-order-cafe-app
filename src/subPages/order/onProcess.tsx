import moment from 'moment';
import { useEffect, type FC } from "react";
import { LuFileClock, LuPackageCheck } from 'react-icons/lu';
import { MdOutlinePaid } from 'react-icons/md';
import { TbCurrencyDollarOff, TbRotateClockwise2 } from 'react-icons/tb';
import LoadingPage from '../../components/loadingPage';
import { usePostMeQuery } from '../../services/apiAuth';
import { useAcceptOrderByDapurMutation, useAcceptOrderByKasirMutation, useCancelOrderByKasirMutation, useFinishOrderMutation, useGetOrderQuery, usePaidOrderByKasirMutation, useReadyOrderMutation } from "../../services/apiOrder";
import { socket, socket2 } from "../../socket";

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

    return (
        <>
            {isLoadingGetOrder || isLoadingPaidByKasir || isLoadingCancelByKasir || isLoadingAccByKasir || 
            isLoadingAccByDapur || isLoadingReady || isLoadingFinish && (
                <LoadingPage />
            )}
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="text-center">Oder ID</th>
                            <th className="text-center">Tanggal</th>
                            <th className="text-center">No. Meja</th>
                            <th className="text-center">Total</th>
                            <th className="text-center">Status Pembayaran</th>
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
                                <tr 
                                    key={item.order_id}
                                >
                                    <th>{i + 1}</th>
                                    <td className="text-center">{item.order_id}</td>
                                    <td className="text-center">{moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                                    <td className="text-center">{item.meja}</td>
                                    <td className="text-right">{item.total.toLocaleString("id-ID")}</td>
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
                                    <td className="text-center  w-38">
                                        <span className="flex justify-center items-center gap-2">
                                            <div 
                                                className={`py-1 px-4 rounded text-xs flex justify-center items-center gap-2 border ${colorProses} font-bold`}
                                            >
                                                {iconProses}
                                                <span>{item.proses}</span>
                                            </div>
                                        </span>
                                    </td>
                                    <td className="text-center w-42">
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
                                                        className="btn btn-sm bg-gradient-to-r from-yellow-500 to-yellow-500 text-white rounded border-none"
                                                        onClick={() => handleReady(item.order_id)}
                                                    >
                                                        Pesanan Siap
                                                    </button>
                                                )}
                                                {item.proses === "ready" && (
                                                    <button
                                                        className="btn btn-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded border-none"
                                                        onClick={() => handleFinish(item.order_id)}
                                                    >
                                                        Selesai
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
                                                                className="btn btn-sm bg-gradient-to-r from-yellow-500 to-yellow-500 text-white rounded border-none"
                                                                onClick={() => handleReady(item.order_id)}
                                                            >
                                                                Pesanan Siap
                                                            </button>
                                                        )}
                                                        {item.proses === "ready" && (
                                                            <button
                                                                className="btn btn-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded border-none"
                                                                onClick={() => handleFinish(item.order_id)}
                                                            >
                                                                Selesai
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
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