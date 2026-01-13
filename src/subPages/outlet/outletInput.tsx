import { useEffect, useState, type FC } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../components/loadingPage";
import { useAlert } from "../../contexts/alertContext";
import type { AddOutletRequest } from "../../interfaces/outlet";
import { usePostMeQuery } from "../../services/apiAuth";
import { useAddOutletMutation } from "../../services/apiOutlet";
import { useGetCitiesQuery, useGetDistrictsQuery, useGetProvincesQuery, useGetVillagesQuery } from "../../services/apiWilayah";

const OutletInput: FC = () => {
    const [form, setForm] = useState<AddOutletRequest>({
        company_id: '',
        fullname: '',
        phone: 0,
        email: '',
        cafeName: '',
        address: '',
        phoneCafe: 0,
        province: null,
        city: null,
        district: null,
        village: null,
        postalCode: 0,
        username: '',
        password: '',
        confirmPassword: ''
    });
    // console.log(form);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [provinceId, setProvinceId] = useState("");
    const [cityId, setCityId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { data: MeData } = usePostMeQuery();
    const user = MeData?.user;
    const [addOutlet, { isLoading: isLoadingRegister }] = useAddOutletMutation();

    const { data: provinces = [] } = useGetProvincesQuery();
    const { data: cities = [] } = useGetCitiesQuery(provinceId, { skip: !provinceId });
    const { data: districts = [] } = useGetDistrictsQuery(cityId, { skip: !cityId });
    const { data: villages = [] } = useGetVillagesQuery(districtId, { skip: !districtId });

    useEffect(() => {
        if (user?.company_id) {
            updateForm("company_id", user.company_id);
        }
    }, [user?.company_id]);

    const updateForm = (key: string, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            const res = await addOutlet(form).unwrap();
            showAlert(res.message);
            navigate('/outlet', { state: { from: 'outlet-edit' } });
        } catch (err: any) {
            showAlert(err?.data?.message ?? "Terjadi kesalahan");
        }
    };

    return (
        <>
            {isLoadingRegister && <LoadingPage />}
            <div className="lg:flex lg:justify-center p-5">
                <div className="flex flex-col gap-5">

                    <p className="text-sm font-semibold">Profile</p>
                    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:auto-rows-auto gap-5">
                        <input 
                            type="text"
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            placeholder="Full Name" 
                            value={form.fullname} 
                            onChange={e => updateForm("fullname", e.target.value)} 
                        />
                        <input 
                            type="number"
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            placeholder="Phone" 
                            value={form.phone === 0 ? '' : form.phone} 
                            onChange={e => updateForm("phone", e.target.value === '' ? 0 : Number(e.target.value))} 
                        />
                        <input 
                            type="text"
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            placeholder="Email" 
                            value={form.email} 
                            onChange={e => updateForm("email", e.target.value)} 
                        />
                    </div>

                    <p className="text-sm font-semibold">Business</p>
                    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:auto-rows-auto gap-5">
                        <input 
                            type="text"
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            placeholder="Cafe Name" 
                            value={form.cafeName} 
                            onChange={e => updateForm("cafeName", e.target.value)} 
                        />
                        <input
                            type="text" 
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            placeholder="Address" 
                            value={form.address} 
                            onChange={e => updateForm("address", e.target.value)} 
                        />
                        <input
                            type="number" 
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            placeholder="Phone Cafe" 
                            value={form.phoneCafe === 0 ? '' : form.phoneCafe} 
                            onChange={e => updateForm("phoneCafe", e.target.value === '' ? 0 : Number(e.target.value))} 
                        />

                        <select
                            className="select w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            onChange={(e) => {
                                const s = JSON.parse(e.target.value);
                                setProvinceId(s.id); setCityId(""); setDistrictId("");
                                updateForm("province", s);
                            }}
                        >
                            <option value="">- Province -</option>
                            {provinces.map(p => <option key={p.id} value={JSON.stringify(p)}>{p.name}</option>)}
                        </select>

                        <select 
                            className="select w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            disabled={!provinceId} 
                            onChange={(e) => {
                                const s = JSON.parse(e.target.value);
                                setCityId(s.id); setDistrictId("");
                                updateForm("city", s);
                            }}
                        >
                            <option value="">- City -</option>
                            {cities.map(c => <option key={c.id} value={JSON.stringify(c)}>{c.name}</option>)}
                        </select>

                        <select 
                            className="select w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            disabled={!cityId} 
                            onChange={(e) => {
                                const s = JSON.parse(e.target.value);
                                setDistrictId(s.id);
                                updateForm("district", s);
                            }}
                        >
                            <option value="">- District -</option>
                            {districts.map(d => <option key={d.id} value={JSON.stringify(d)}>{d.name}</option>)}
                        </select>

                        <select 
                            className="select w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            disabled={!districtId} 
                            onChange={(e) => {
                                const s = JSON.parse(e.target.value);
                                updateForm("village", s);
                            }}
                        >
                            <option value="">- Village -</option>
                            {villages.map(v => <option key={v.id} value={JSON.stringify(v)}>{v.name}</option>)}
                        </select>

                        <input 
                            type="text"
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            placeholder="Postal Code" 
                            value={form.postalCode === 0 ? '' : form.postalCode} 
                            onChange={e => updateForm("postalCode", e.target.value === '' ? 0 : Number(e.target.value))} 
                        />
                    </div>

                    <p className="text-sm font-semibold">Account</p>
                    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:auto-rows-auto gap-5">
                        <input
                            type="text" 
                            className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded" 
                            placeholder="Username" 
                            value={form.username} 
                            onChange={e => updateForm("username", e.target.value)} 
                        />

                        <label className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded">
                            <input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={e => updateForm("password", e.target.value)} />
                            {showPassword 
                            ? <LuEyeOff className="cursor-pointer" size={20} onClick={() => setShowPassword(false)} /> 
                            : <LuEye className="cursor-pointer" size={20} onClick={() => setShowPassword(true)} />}
                        </label>

                        <label className="input w-full lg:w-[400px] bg-base-200 border-base-300 rounded">
                            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={form.confirmPassword} onChange={e => updateForm("confirmPassword", e.target.value)} />
                            {showConfirmPassword 
                            ? <LuEyeOff className="cursor-pointer" size={20} onClick={() => setShowConfirmPassword(false)} /> 
                            : <LuEye className="cursor-pointer" size={20} onClick={() => setShowConfirmPassword(true)} />}
                        </label>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            onClick={handleSave} 
                            className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                        >
                            Save Change
                        </button>
                    </div>        
                </div>
            </div>
        </>
    );
};

export default OutletInput;