import moment from "moment";
import type { FC } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../components/loadingPage";
import { useAlert } from "../../contexts/alertContext";
import { useDeleteVoucherMutation, useGetVoucherQuery } from "../../services/apiVoucher";
import { usePostMeQuery } from "../../services/apiAuth";

export const VoucherList: FC = () => {
    const { data: MeData } = usePostMeQuery();
    const user = MeData?.user;
    const {data: getVoucher, isLoading: isLoadingVoucher} = useGetVoucherQuery({
        outlet_id: user?.outlet_id
    }, {
        refetchOnMountOrArgChange: true
    });
    const [deleteVoucher, {isLoading: isLoadingDelVoucher}] = useDeleteVoucherMutation();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const isMobile = window.innerWidth < 768;

    const handleDeleteVoucher = async (id: string) => {
        const confirm = window.confirm("Apakah kamu yakin ingin menghapus voucher ini?");
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
            <div className="overflow-x-auto max-h-[720px] lg:max-h-[435px] mt-5 px-5 md:m-0 md:p-0">
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
                                                    onClick={() => {
                                                        const path = isMobile
                                                            ? `/voc-edit/${item.id_voucher}`
                                                            : `/edit-voucher/${item.id_voucher}`;

                                                        navigate(path);
                                                    }}
                                                >
                                                    <MdOutlineEdit size={20}/>
                                                </div>
                                            </div>
                                            <div className="tooltip tooltip-left" data-tip="Hapus">
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