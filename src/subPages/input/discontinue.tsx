import type { FC } from "react";
import { MdAutorenew } from "react-icons/md";
import LoadingPage from "../../components/loadingPage";
import { useAlert } from "../../contexts/alertContext";
import { useActivateProductMutation, useGetProductDiscontinueQuery } from "../../services/apiProduct";
import { usePostMeQuery } from "../../services/apiAuth";

const Discontinue: FC = () => {
    const { data: MeData } = usePostMeQuery();
    const user = MeData?.user;
    const {data: getProductDis, isLoading: isLoadingProductDis} = useGetProductDiscontinueQuery({
        outlet_id: user?.outlet_id
    }, {
        refetchOnMountOrArgChange: true
    });
    const [activateProduct, { isLoading: isLoadingActivate }] = useActivateProductMutation();
    const { showAlert } = useAlert();

    const handleActivate = async (id: string) => {
        const confirm = window.confirm("Apakah kamu yakin ingin mengaktifkan kembali produk ini?");
        if (!confirm) return;

        try {
            const res = await activateProduct(id).unwrap();
            showAlert(res.message);
        } catch (error: any) {
            showAlert(error?.data?.message ?? 'Terjadi kesalahan')
        }
    }

    return (
        <>
            {isLoadingProductDis || isLoadingActivate && <LoadingPage />}
            <div className="overflow-x-auto max-h-[720px] lg:max-h-[435px] mt-5 px-5 md:m-0 md:p-0">
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
                        {getProductDis && getProductDis?.length > 0 ? (
                            getProductDis?.map((item, i) => {
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
                                            <div className="tooltip tooltip-left" data-tip="Activate">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => handleActivate(item.id)}
                                                >
                                                    <MdAutorenew size={20}/>
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

export default Discontinue