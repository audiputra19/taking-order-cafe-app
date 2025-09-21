import type { FC } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/alertContext";
import { useDeleteUserMutation, useGetUserQuery } from "../../services/apiUser";
import { RiDeleteBin5Line } from "react-icons/ri";
import LoadingPage from "../../components/loadingPage";

export const UserList: FC = () => {
    const {data: getUser, isLoading: isLoadingUser} = useGetUserQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    const [deleteUser, {isLoading: isLoadingDelUser}] = useDeleteUserMutation();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const handleDelete = async (username: string) => {
        const confirm = window.confirm("Apakah kamu yakin ingin menghapus user ini?");
        if (!confirm) return;

        try {
            const res = await deleteUser(username).unwrap();
            showAlert(res.message);
        } catch (error: any) {
            showAlert(error.data.message ?? 'Terjadi kesalahan')
        }
    }

    return (
        <>
            {isLoadingUser || isLoadingDelUser && <LoadingPage />}
            <div className="overflow-x-auto max-h-[435px]">
                <table className="table table-zebra">
                    <thead className="sticky top-0 bg-base-100 z-10">
                    <tr>
                        <th></th>
                        <th className="text-center">Nama User</th>
                        <th className="text-center">Username</th>
                        <th className="text-center">Bagian</th>
                        <th className="text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {getUser && getUser?.length > 0 ? (
                            getUser?.map((item, i) => {
                                let bagian = ''
                                switch(item.hak_akses) {
                                    case 1:
                                        bagian = 'Admin';
                                        break;
                                    case 2:
                                        bagian = 'Kasir';
                                        break;
                                    case 3:
                                        bagian = 'Dapur';
                                        break;               
                                }

                                return (
                                    <tr key={item.username}>
                                        <th className="text-center">{i + 1}</th>
                                        <td>{item.nama}</td>
                                        <td className="text-center">{item.username}</td>
                                        <td className="text-center">{bagian}</td>
                                        <td className="flex justify-center gap-3">
                                            <div className="tooltip tooltip-left" data-tip="Hapus">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => handleDelete(item.username)}
                                                >
                                                    <RiDeleteBin5Line size={20} className="text-gray-600"/>
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