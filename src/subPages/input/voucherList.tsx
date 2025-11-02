import type { FC } from "react";
import { MdOutlineDoDisturbOn, MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../components/loadingPage";
import { useAlert } from "../../contexts/alertContext";
import { useDeleteVoucherMutation, useGetVoucherQuery } from "../../services/apiVoucher";
import moment from "moment";
import { RiDeleteBin5Line } from "react-icons/ri";

export const VoucherList: FC = () => {
    const {data: getVoucher, isLoading: isLoadingVoucher} = useGetVoucherQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    const [deleteVoucher, {isLoading: isLoadingDelVoucher}] = useDeleteVoucherMutation();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    // const handleDiscontinue = async (id: string) => {
    //     const confirm = window.confirm("Apakah kamu yakin ingin discontinue produk ini?");
    //     if (!confirm) return;

    //     try {
    //         const res = await discontinueProduct(id).unwrap();
    //         showAlert(res.message);
    //     } catch (error: any) {
    //         showAlert(error?.data?.message ?? 'Terjadi kesalahan')
    //     }
    // }

    const handleDeleteVoucher = async (id: string) => {
        const confirm = window.confirm("Apakah kamu yakin ingin menghapus produk ini?");
        if (!confirm) return;

        try {
            const res = await deleteVoucher(id).unwrap();
            showAlert(res.message);
        } catch (error: any) {
            showAlert(error?.data?.message ?? 'Terjadi kesalahan');
        }
    }

    return (
        <>
            {isLoadingVoucher || isLoadingDelVoucher && <LoadingPage />}
            <div className="overflow-x-auto max-h-[435px]">
                <table className="table table-zebra">
                    <thead className="sticky top-0 bg-base-100 z-10">
                    <tr>
                        <th></th>
                        <th className="text-center">ID Voucher</th>
                        <th className="text-center">Nama Voucher</th>
                        <th className="text-center">Minimal Belanja</th>
                        <th className="text-center">Diskon</th>
                        <th className="text-center">Masa Berlaku</th>
                    </tr>
                    </thead>
                    <tbody>
                        {getVoucher && getVoucher?.length > 0 ? (
                            getVoucher?.map((item, i) => {

                                return (
                                    <tr key={item.id_voucher}>
                                        <th className="text-center">{i + 1}</th>
                                        <td className="text-center">{item.id_voucher}</td>
                                        <td className="text-start">{item.nama}</td>
                                        <td className="text-end">{item.min_belanja.toLocaleString("id-ID")}</td>
                                        <td className="text-center">{item.persen}%</td>
                                        <td className="text-center">{moment(item.due_date).format("YYYY-MM-DD")}</td>
                                        <td className="flex justify-center gap-3">
                                            <div className="tooltip tooltip-left" data-tip="Edit">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => navigate(`/edit-voucher/${item.id_voucher}`)}
                                                >
                                                    <MdOutlineEdit size={20}/>
                                                </div>
                                            </div>
                                            <div className="tooltip tooltip-left" data-tip="Discontinue">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => handleDeleteVoucher(item.id_voucher)}
                                                >
                                                    <RiDeleteBin5Line size={20}/>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })  
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-3 text-gray-500 bg-base-100">
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