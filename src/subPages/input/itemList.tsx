import type { FC } from "react";
import { MdOutlineDoDisturbOn, MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/alertContext";
import { useDiscontinueProductMutation, useGetProductQuery } from "../../services/apiProduct";
import LoadingPage from "../../components/loadingPage";

export const ItemList: FC = () => {
    const {data: getProduct, isLoading: isLoadingProduct} = useGetProductQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    const [discontinueProduct, { isLoading: isLoadingDis }] = useDiscontinueProductMutation();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const handleDiscontinue = async (id: string) => {
        const confirm = window.confirm("Apakah kamu yakin ingin discontinue produk ini?");
        if (!confirm) return;

        try {
            const res = await discontinueProduct(id).unwrap();
            showAlert(res.message);
        } catch (error: any) {
            showAlert(error?.data?.message ?? 'Terjadi kesalahan')
        }
    }

    return (
        <>
            {isLoadingProduct || isLoadingDis && <LoadingPage />}
            <div className="overflow-x-auto max-h-[435px]">
                <table className="table table-zebra">
                    <thead className="sticky top-0 bg-base-100 z-10">
                    <tr>
                        <th></th>
                        <th className="text-center">Produk</th>
                        <th className="text-center">Kategori</th>
                        <th className="text-center">Harga</th>
                        <th className="text-center">Deskripsi</th>
                        <th className="text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {getProduct && getProduct?.length > 0 ? (
                            getProduct?.map((item, i) => {
                                let cat = ''
                                switch(item.kategori) {
                                    case 1:
                                        cat = 'Food';
                                        break;
                                    case 2:
                                        cat = 'Beverage';
                                        break;
                                    case 3:
                                        cat = 'Snack';
                                        break;
                                    case 4:
                                        cat = 'Coffee';
                                        break;                 
                                }

                                return (
                                    <tr key={item.id}>
                                        <th className="text-center">{i + 1}</th>
                                        <td>{item.nama}</td>
                                        <td>{cat}</td>
                                        <td className="text-end">{item.harga.toLocaleString("id-ID")}</td>
                                        <td>{item.deskripsi}</td>
                                        <td className="flex justify-center gap-3">
                                            <div className="tooltip tooltip-left" data-tip="Edit">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => navigate(`/edit-input/${item.id}`)}
                                                >
                                                    <MdOutlineEdit size={20}/>
                                                </div>
                                            </div>
                                            <div className="tooltip tooltip-left" data-tip="Discontinue">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => handleDiscontinue(item.id)}
                                                >
                                                    <MdOutlineDoDisturbOn size={20}/>
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