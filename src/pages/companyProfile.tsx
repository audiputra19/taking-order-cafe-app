import { useEffect, useRef, useState, type ChangeEvent, type FC } from "react";
import { MdChevronRight, MdImage } from "react-icons/md";
import { BASE_URL } from "../components/BASE_URL";
import { useAlert } from "../contexts/alertContext";
import { useCreateCompanyProfileMutation, useGetCompanyProfileQuery } from "../services/apiProfile";

interface CompanyForm {
    name: string;
    address: string;
    file?: File;
}

const CompanyProfile: FC = () => {
    const [form, setForm] = useState<CompanyForm>({
        name: "",
        address: "",
        file: undefined,
    });
    const [editField, setEditField] = useState<{ name: boolean; address: boolean }>({
        name: false,
        address: false,
    });
    const [isChanged, setIsChanged] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const addressInputRef = useRef<HTMLInputElement | null>(null);
    const [createCompany] = useCreateCompanyProfileMutation();
    const { data: getCompanyProfile } = useGetCompanyProfileQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true
    });
    const { showAlert } = useAlert();

    useEffect(() => {
    if (getCompanyProfile) {
        setForm({
            name: getCompanyProfile.name ?? "",
            address: getCompanyProfile.address ?? "",
            file: undefined,
        });

        if (getCompanyProfile.image_path) {
            setPreview(`${BASE_URL}${getCompanyProfile.image_path}`);
        }
    }
    }, [getCompanyProfile]);

    useEffect(() => {
        if (editField.name && nameInputRef.current) {
            nameInputRef.current.focus();
        }
        if (editField.address && addressInputRef.current) {
            addressInputRef.current.focus();
        }
    }, [editField]);

    const handleFile = (file: File) => {
        // validasi file image
        if (!file.type.startsWith("image/")) {
            alert("Hanya file gambar yang diperbolehkan!");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file max 2MB!");
            return;
        }

        setForm((prev: any) => ({
            ...prev,
            file,
        }));
        setPreview(URL.createObjectURL(file));
        setIsChanged(true);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleEditClick = (field: "name" | "address") => {
        // toggle field supaya bisa nyala bersamaan
        setEditField((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
        setIsChanged(true);
    };

    const handleInputChange = (field: "name" | "address", value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
        setIsChanged(true);
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("address", form.address);
            if (form.file) formData.append("file", form.file);

            const res = await createCompany(formData).unwrap();

            showAlert(res.message);
            setEditField({ name: false, address: false });
            setIsChanged(false);
        } catch (err: any) {
            showAlert(err?.data?.message ?? 'Terjadi kesalahan');
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <div className="w-[700px] border border-base-300 rounded p-5">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="font-semibold">Upload Logo</p>
                            <p className="text-sm text-gray-500">Max size 2MB</p>
                        </div>
                        <div className="flex items-center gap-5 w-[200px]">
                            <div>
                                {preview ? (
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="h-18 w-18 object-cover rounded-full border-4 border-base-300"
                                    />
                                ) : (
                                    <div 
                                        className="flex flex-col justify-center items-center text-white h-18 w-18 rounded-full bg-base-300">
                                        <MdImage size={50}/>
                                    </div>
                                )}
                            </div>
                            <fieldset className="fieldset">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                                <button
                                    type="button"
                                    onClick={handleButtonClick}
                                    className="btn btn-sm bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
                                >
                                    Pilih File
                                </button>
                            </fieldset>
                        </div>
                    </div>
                    <div className="border-t border-base-300 my-5"></div>
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="font-semibold">Name</p>
                            <p className="text-sm text-gray-500">The official legal name of your cafe</p>
                        </div>
                        <div className="flex flex-col gap-1 w-[200px]">
                            {editField.name ? (
                                <input
                                    ref={nameInputRef}
                                    value={form.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className="input w-full bg-base-200 border-base-300 rounded"
                                    placeholder="Name of cafe"
                                />
                            ) : (
                                <>
                                    <p>{form.name || "Kopiku, Inc"}</p>
                                    <div
                                        className="flex items-center gap-1 text-green-500 cursor-pointer"
                                        onClick={() => handleEditClick("name")}
                                    >
                                        Edit <MdChevronRight size={20} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="border-t border-base-300 my-5"></div>
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="font-semibold">Address</p>
                            <p className="text-sm text-gray-500">The official residential address</p>
                        </div>
                        <div className="flex flex-col gap-1 w-[200px]">
                            {editField.address ? (
                                <input
                                    ref={addressInputRef}
                                    value={form.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    className="input w-full bg-base-200 border-base-300 rounded"
                                    placeholder="Address of cafe"
                                />
                            ) : (
                                <>
                                    <p>
                                        {form.address ||
                                            "Jl. R.A. Kosasih Gg. H. Juwaeni RT 02/03 Kel. Cisarua Kec. Cikole Kota Sukabumi"}
                                        </p>
                                    <div
                                        className="flex items-center gap-1 text-green-500 cursor-pointer"
                                        onClick={() => handleEditClick("address")}
                                    >
                                        Edit <MdChevronRight size={20} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-[700px] mt-5">
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={!isChanged}
                            className={`btn btn-sm rounded border-none transition-colors duration-200 ${
                                isChanged
                                ? "bg-gradient-to-r from-green-600 to-green-500 text-white"
                                : "bg-gradient-to-r from-green-400 to-green-300 text-white opacity-70 cursor-not-allowed"
                            }`}
                        >
                            Save Change
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyProfile;