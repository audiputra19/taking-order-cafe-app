import { useState, type Dispatch, type FC, type SetStateAction } from "react";
import { MdOutlinePhoneEnabled, MdOutlinePinDrop, MdOutlineStorefront } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetCitiesQuery, useGetDistrictsQuery, useGetProvincesQuery, useGetVillagesQuery } from "../../services/apiWilayah";

interface BusinessType {
    updateForm: (key: string, value: any) => void;
    setStep: Dispatch<SetStateAction<number>>;
}

export const Business: FC<BusinessType> = ({ updateForm, setStep }) => {
    const [provinceId, setProvinceId] = useState("");
    const [cityId, setCityId] = useState("");
    const [districtId, setDistrictId] = useState("");

    const { data: provinces = [] } = useGetProvincesQuery();
    const { data: cities = [] } = useGetCitiesQuery(provinceId, { skip: !provinceId });
    const { data: districts = [] } = useGetDistrictsQuery(cityId, { skip: !cityId });
    const { data: villages = [] } = useGetVillagesQuery(districtId, { skip: !districtId });

    return (
        <div className="mx-5 mb-5 flex-1 flex flex-col gap-3 justify-center items-center p-5">
            <div className="text-center">
                <p className="font-semibold text-xl">Information of Your Cafe</p>
                <p className="text-gray-400 text-xs mt-2 max-w-[300px]">Complete your cafe information to make managing your outlet easier.</p>
            </div>
            <div className="mt-5">
                <label className="input rounded-lg w-[300px]" id="username">
                    <MdOutlineStorefront size={18}/>   
                    <input
                        type="text"
                        required
                        placeholder="Name of Cafe"
                        onChange={(e) => updateForm("cafeName", e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label className="input rounded-lg w-[300px]" id="username">
                    <MdOutlinePinDrop size={18}/>   
                    <input
                        type="text"
                        required
                        placeholder="Address"
                        onChange={(e) => updateForm("address", e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label className="input rounded-lg w-[300px]" id="username">
                    <MdOutlinePhoneEnabled size={18}/>   
                    <input
                        type="text"
                        required
                        placeholder="Phone"
                        onChange={(e) => updateForm("phoneCafe", e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label className="input rounded-lg w-[300px]" id="username">  
                    <select  
                        className="w-full h-full outline-0" 
                        onChange={(e) => {
                            const selected = JSON.parse(e.target.value);
                            setProvinceId(selected.id);
                            setCityId(""); setDistrictId("");

                            updateForm("province", {
                                id: selected.id,
                                name: selected.name
                            });
                        }}
                    >
                        <option value="">- Province -</option>
                        {provinces.map(p => (
                            <option 
                                key={p.id} 
                                value={JSON.stringify({ id: p.id, name: p.name })}
                            >
                                {p.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label className="input rounded-lg w-[300px]" id="username">  
                    <select  
                        className="w-full h-full outline-0" 
                        disabled={!provinceId}
                        onChange={(e) => {
                            const selected = JSON.parse(e.target.value);
                            setCityId(selected.id);
                            setDistrictId("");

                            updateForm("city", {
                                id: selected.id,
                                name: selected.name
                            });
                        }}
                    >
                        <option value="">- City -</option>
                        {cities.map(c => (
                            <option 
                                key={c.id} 
                                value={JSON.stringify({ id: c.id, name: c.name })}
                            >
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label className="input rounded-lg w-[300px]" id="username">  
                    <select  
                        className="w-full h-full outline-0" 
                        disabled={!cityId}
                        onChange={(e) => {
                            const selected = JSON.parse(e.target.value);

                            setDistrictId(selected.id);
                            updateForm("district", {
                                id: selected.id,
                                name: selected.name
                            });
                        }}
                    >
                        <option value="">- District -</option>
                        {districts.map(d => (
                            <option 
                                key={d.id} 
                                value={JSON.stringify({ id: d.id, name: d.name })}
                            >
                                {d.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label className="input rounded-lg w-[300px]" id="username">  
                    <select  
                        className="w-full h-full outline-0" 
                        disabled={!districtId}
                        onChange={(e) => {
                            const selected = JSON.parse(e.target.value);

                            updateForm("village", {
                                id: selected.id,
                                name: selected.name
                            });
                        }}
                    >
                        <option value="">- Village -</option>
                        {villages.map(v => (
                            <option 
                                key={v.id} 
                                value={JSON.stringify({ id: v.id, name: v.name })}
                            >
                                {v.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label className="input rounded-lg w-[300px]" id="username">  
                    <input
                        type="text"
                        required
                        placeholder="Postal Code"
                        onChange={(e) => updateForm("postalCode", e.target.value)}
                    />
                </label>
            </div>
            <div className="mt-2">
                <button
                    className="btn bg-gradient-to-r from-green-600 to-green-500 p-5 rounded-lg text-white w-[300px] cursor-pointer"
                    onClick={() => setStep(3)}
                >
                    Next Step
                </button>
            </div>
            <div className="mt-2">
                <span 
                    className="text-sm text-blue-500 underline cursor-pointer hover:text-blue-800"
                    onClick={() => setStep(1)}
                >
                    Back
                </span>
            </div>
        </div>
    )
}