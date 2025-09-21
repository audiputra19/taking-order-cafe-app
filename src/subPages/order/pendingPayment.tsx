import moment from 'moment';
import { useEffect, type FC } from "react";
import { useAcceptOrderByDapurMutation, useAcceptOrderByKasirMutation, useFinishOrderMutation, useGetOrderQuery, useReadyOrderMutation } from "../../services/apiOrder";
import { socket, socket2 } from "../../socket";
import { usePostMeQuery } from '../../services/apiAuth';
import LoadingPage from '../../components/loadingPage';

export const PendingPayment: FC = () => {
    const { data: getOrder, isLoading: isLoadingGetOrder, refetch } = useGetOrderQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    const { data: MeData } = usePostMeQuery();
    const user = MeData?.user;
    const [acceptByKasir, {isLoading: isLoadingAccByKasir}] = useAcceptOrderByKasirMutation();
    const [acceptByDapur, {isLoading: isLoadingAccByDapur}] = useAcceptOrderByDapurMutation();
    const [ready, {isLoading: isLoadingReady}] = useReadyOrderMutation();
    const [finish, {isLoading: isLoadingFinish}] = useFinishOrderMutation();

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
            {isLoadingGetOrder || isLoadingAccByKasir || isLoadingAccByDapur ||
            isLoadingReady || isLoadingFinish && (
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {getOrder && getOrder.length > 0 ? (
                        getOrder?.map((item, i) => {
                            return (
                                <tr 
                                    key={item.order_id}
                                >
                                    <th>{i + 1}</th>
                                    <td className="text-center">{item.order_id}</td>
                                    <td className="text-center">{moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                                    <td className="text-center">{item.meja}</td>
                                    <td className="text-right">{item.total.toLocaleString("id-ID")}</td>
                                    <td className="text-center">{item.status}</td>
                                    <td className="text-center">{item.proses}</td>
                                    <td>
                                        {/* Hak Kasir */}
                                        {user?.hak_akses === 2 ? (
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
                                                        className="btn btn-sm bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded border-none"
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
                                                        className="btn btn-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded border-none"
                                                        onClick={() => handleFinish(item.order_id)}
                                                    >
                                                        Selesai
                                                    </button>
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