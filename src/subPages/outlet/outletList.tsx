import type { FC } from "react";
import LoadingPage from "../../components/loadingPage";
import { usePostMeQuery } from "../../services/apiAuth";
import { useGetOutletQuery } from "../../services/apiOutlet";

export const OutletList: FC = () => {
    const { data: MeData } = usePostMeQuery();
    const user = MeData?.user;
    const {data: getOutlet, isLoading: isLoadingVoucher} = useGetOutletQuery({
        company_id: user?.company_id
    }, {
        refetchOnMountOrArgChange: true
    });

    return (
        <>
            {isLoadingVoucher && <LoadingPage />}
            <div className="overflow-x-auto max-h-[720px] lg:max-h-[435px] mt-5 px-5 md:m-0 md:p-0">
                <table className="table table-zebra">
                    <thead className="sticky top-0 bg-base-100 z-10">
                    <tr>
                        <th></th>
                        <th className="text-center">Nama Outlet</th>
                        <th className="text-center">Alamat</th>
                        <th className="text-center">Telefon</th>
                    </tr>
                    </thead>
                    <tbody>
                        {getOutlet && getOutlet?.length > 0 ? (
                            getOutlet?.map((item, i) => {

                                return (
                                    <tr key={item.outlet_id}>
                                        <th className="text-center">{i + 1}</th>
                                        <td className="text-start">{item.name}</td>
                                        <td className="text-start">{item.address}</td>
                                        <td className="text-center">{item.phone}</td>
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