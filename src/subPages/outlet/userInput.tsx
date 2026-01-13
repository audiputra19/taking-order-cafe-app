import { useRef, useState, type FC } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/alertContext";
import type { CreateUserRequest } from "../../interfaces/user";
import { useCreateUserMutation } from "../../services/apiUser";
import LoadingPage from "../../components/loadingPage";
import { useGetOutletQuery } from "../../services/apiOutlet";
import { usePostMeQuery } from "../../services/apiAuth";

const UserInput: FC = () => {
    const [form, setForm] = useState<CreateUserRequest>({
        outlet_id: '',
        nama: '',
        username: '',
        password: '',
        confirmPassword: '',
        hak_akses: '' as unknown as number
    });
    const { data: MeData } = usePostMeQuery();
    const user = MeData?.user;
    const { data: getOutletData = [] } = useGetOutletQuery({
        company_id: user?.company_id
    });
    // console.log(form);
    const [createUser, { isLoading: isLoadingCreateUser }] = useCreateUserMutation();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [showPassword, setShowPassword] = useState('password');
    const [showConfirmPassword, setShowConfirmPassword] = useState('confirmPassword');

    const handleSave = async () => {
        try {
            const res = await createUser(form).unwrap();
            showAlert(res.message);
            setForm({
                outlet_id: '',
                nama: '',
                username: '',
                password: '',
                confirmPassword: '',
                hak_akses: '' as unknown as number
            });
            setShowPassword('password');
            setShowConfirmPassword('confirmPassword');

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            navigate('/outlet', { state: { from: 'user-edit' } });
        } catch (err: any) {
            showAlert(err?.data?.message ?? 'Terjadi kesalahan');
        }
    };

    //console.log(form)

    return (
        <>
            {isLoadingCreateUser && <LoadingPage />}
            <div className="lg:flex lg:justify-center p-5 lg:p-0">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-5">
                        <select
                            className="select w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            onChange={(e) => {
                                setForm(prev => ({
                                    ...prev,
                                    outlet_id: e.target.value
                                }))
                            }}
                        >
                            <option value="">- Outlet -</option>
                            {getOutletData.map(p => <option key={p.outlet_id} value={p.outlet_id}>{p.name}</option>)}
                        </select>
                        <input 
                            type="text" 
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            required 
                            placeholder="Nama User"
                            value={form.nama}
                            onChange={(e) => {
                                setForm(prev => ({
                                    ...prev,
                                    nama: e.target.value
                                }))
                            }} 
                        />
                        <input 
                            type="text" 
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            required 
                            placeholder="Username"
                            value={form.username} 
                            onChange={(e) => {
                                setForm(prev => ({
                                    ...prev,
                                    username: e.target.value
                                }))
                            }}
                        />
                        <label className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded">
                            <input 
                                type={showPassword}
                                required 
                                placeholder="Password" 
                                value={form.password}
                                onChange={(e) => {
                                    setForm(prev => ({
                                        ...prev,
                                        password: e.target.value
                                    }))
                                }}
                            />
                            {showPassword === 'password' ? (
                                <LuEye 
                                    size={20} 
                                    className="cursor-pointer"
                                    onClick={() => setShowPassword('text')}
                                /> 
                            ) : (
                                <LuEyeOff 
                                    size={20} 
                                    className="cursor-pointer"
                                    onClick={() => setShowPassword('password')}
                                />  
                            )}
                        </label>
                        <label className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded">
                            <input 
                                type={showConfirmPassword === 'confirmPassword' ? 'password' : 'text'}
                                required 
                                placeholder="Konfirmasi Password"
                                value={form.confirmPassword}
                                onChange={(e) => {
                                    setForm(prev => ({
                                        ...prev,
                                        confirmPassword: e.target.value
                                    }))
                                }} 
                            />
                            {showConfirmPassword === 'confirmPassword' ? (
                                <LuEye 
                                    size={20} 
                                    className="cursor-pointer"
                                    onClick={() => setShowConfirmPassword('text')}
                                /> 
                            ) : (
                                <LuEyeOff 
                                    size={20} 
                                    className="cursor-pointer"
                                    onClick={() => setShowConfirmPassword('confirmPassword')}
                                />  
                            )}
                        </label>
                        <select  
                            className="select w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            required 
                            value={form.hak_akses === 0 ? '' : form.hak_akses}
                            onChange={(e) => setForm(prev => ({
                                ...prev, 
                                hak_akses: Number(e.target.value)
                            }))}
                        >
                            <option value="" disabled={true}>- Pilih bagian -</option>
                            <option value={2}>Kasir</option>
                            <option value={3}>Dapur</option>
                        </select>
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

export default UserInput;