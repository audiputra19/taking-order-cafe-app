import clsx from "clsx";
import { useRef, useState, type FC } from "react";
import { LuTicketPercent } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../components/loadingPage";
import { useAlert } from "../../contexts/alertContext";
import type { CreateVoucherRequest } from "../../interfaces/voucher";
import { useCreateVoucherMutation } from "../../services/apiVoucher";

const VoucherInput: FC = () => {
    const [form, setForm] = useState<CreateVoucherRequest>({
        nama: '',
        min_belanja: 0,
        persen: 0,
        due_date: '',
    });
    const [createVoucher, {isLoading: isLoadingCreateVoucher}] = useCreateVoucherMutation();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleSave = async () => {
        try {
            const res = await createVoucher(form).unwrap();
            showAlert(res.message);
            setForm({
                nama: '',
                min_belanja: 0,
                persen: 0,
                due_date: ''
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            navigate('/input', { state: { from: 'voucher-edit' } });
        } catch (err: any) {
            showAlert(err?.data?.message ?? 'Terjadi kesalahan');
        }
    };

    //console.log(form)

    return (
        <>
            {isLoadingCreateVoucher && <LoadingPage /> }
            <div className="lg:flex lg:justify-center p-5 md:p-0">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col lg:grid lg:grid-flow-col lg:grid-rows-2 gap-5">
                        <input 
                            type="text" 
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            required 
                            placeholder="Nama Voucher" 
                            value={form.nama}
                            onChange={(e) => setForm(prev => ({
                                ...prev, 
                                nama: e.target.value
                            }))}
                        />
                        <input 
                            type="number" 
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            required 
                            placeholder="Minimal Belanja"
                            value={form.min_belanja === 0 ? '' : form.min_belanja}
                            onChange={(e) => setForm(prev => ({
                                ...prev, 
                                min_belanja: e.target.value === '' ? 0 : Number(e.target.value)
                            }))} 
                        />
                        <input 
                            type="number" 
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            required 
                            placeholder="Berapa Persen Voucher"
                            value={form.persen === 0 ? '' : form.persen}
                            onChange={(e) => setForm(prev => ({
                                ...prev, 
                                persen: e.target.value === '' ? 0 : Number(e.target.value)
                            }))} 
                        />
                        <input 
                            type="date" 
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            required 
                            value={form.due_date}
                            onChange={(e) => setForm(prev => ({
                                ...prev, 
                                due_date: e.target.value
                            }))} 
                        />
                    </div>
                    <div className="flex flex-col gap-5">
                        <div 
                            className={clsx(
                                "border-2 border-dashed rounded-lg p-4 border-base-300 bg-base-200"
                            )}
                        >
                            {form.nama !== '' || form.min_belanja !== 0 || 
                            form.persen !== 0 || form.due_date !== '' ? (
                                <div className="flex flex-col justify-center items-center">
                                    <div className="relative inline-block max-w-[360px]">
                                        <div className="flex border border-base-300 bg-white py-4 px-7 rounded-lg relative overflow-hidden">
                                            <div className="border-r border-dashed pr-5 font-bold border-gray-500">
                                                <div className="flex flex-col justify-center items-center min-w-[60px]">
                                                    <div>
                                                        <p className="text-red-500">Diskon</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-red-500 text-4xl">{form.persen}</span>
                                                        <span className="text-red-500 text-lg">%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pl-5 flex flex-col gap-1">
                                                <span className="text-lg font-semibold text-slate-800">{form.nama}</span>
                                                <span className="text-sm text-slate-800">Min. Belanja Rp. {form.min_belanja.toLocaleString("id-ID")}</span>
                                                <span className="text-xs text-gray-400">Berlaku s.d. {form.due_date}</span>
                                            </div>

                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-base-200 rounded-full -translate-x-1/2 border border-base-300"></div>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-base-200 rounded-full translate-x-1/2 border border-base-300"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-center items-center text-gray-400 min-h-40">
                                    <LuTicketPercent size={60}/>
                                    <p className="font-semibold text-sm mt-1">
                                        Preview voucher here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                            onClick={handleSave}
                        >
                            Save Change
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VoucherInput;