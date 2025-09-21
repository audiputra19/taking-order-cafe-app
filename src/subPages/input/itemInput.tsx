import clsx from "clsx";
import { useRef, useState, type ChangeEvent, type DragEvent, type FC } from "react";
import { MdImage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/alertContext";
import type { CreateProductRequest } from "../../interfaces/product";
import { useCreateProductMutation } from "../../services/apiProduct";
import LoadingPage from "../../components/loadingPage";

const ItemInput: FC = () => {
    const [form, setForm] = useState<CreateProductRequest>({
        nama: '',
        harga: '' as unknown as number,
        kategori: '' as unknown as number,
        deskripsi: '',
        file: undefined,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<Boolean>(false);
    const [createProduct, {isLoading: isLoadingCreateProd}] = useCreateProductMutation();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

        setForm((prev) => ({
            ...prev,
            file,
        }));
        setPreview(URL.createObjectURL(file));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleSave = async () => {
        try {
            const res = await createProduct(form).unwrap();
            showAlert(res.message);
            setForm({
                nama: '',
                harga: 0,
                kategori: 0,
                deskripsi: '',
                file: undefined,
            });
            setPreview(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            navigate('/input', { state: { from: 'item-edit' } });
        } catch (err: any) {
            showAlert(err?.data?.message ?? 'Terjadi kesalahan');
        }
    };

    //console.log(form)

    return (
        <>
            {isLoadingCreateProd && <LoadingPage /> }
            <div className="flex justify-center">
                <div className="flex flex-col gap-5">
                    <div className="grid grid-flow-col grid-rows-2 gap-5">
                        <input 
                            type="text" 
                            className="input w-[400px] bg-base-200 border-base-300 rounded" 
                            required 
                            placeholder="Nama Produk" 
                            value={form.nama}
                            onChange={(e) => setForm(prev => ({
                                ...prev, 
                                nama: e.target.value
                            }))}
                        />
                        <input 
                            type="number" 
                            className="input w-[400px] bg-base-200 border-base-300 rounded" 
                            required 
                            placeholder="Harga"
                            value={form.harga === 0 ? '' : form.harga}
                            onChange={(e) => setForm(prev => ({
                                ...prev, 
                                harga: e.target.value === '' ? 0 : Number(e.target.value)
                            }))} 
                        />
                        <select  
                            className="select w-[400px] bg-base-200 border-base-300 rounded" 
                            required 
                            value={form.kategori === 0 ? '' : form.kategori}
                            onChange={(e) => setForm(prev => ({
                                ...prev, 
                                kategori: Number(e.target.value)
                            }))}
                        >
                            <option value="" disabled={true}>- Pilih kategori -</option>
                            <option value={1}>Food</option>
                            <option value={2}>Beverages</option>
                            <option value={3}>Snack</option>
                            <option value={4}>Coffee</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-5">
                        <fieldset className="fieldset">
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="file-input w-[400px] border-base-300 rounded"
                                onChange={handleFileChange} 
                            />
                            <label className="label">Max size 2MB</label>
                        </fieldset>
                        <div 
                            className={clsx(
                                "border-2 border-dashed rounded-lg p-4",
                                isDragging ? 'border-green-500 bg-green-50' : 'border-base-300 bg-base-200'
                            )}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true)
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            {preview ? (
                                <div className="flex flex-col justify-center items-center">
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="max-h-40 object-contain rounded-lg"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">{form.file?.name}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-center items-center text-gray-400 min-h-40">
                                    <MdImage size={60}/>
                                    <p className="font-semibold text-sm">
                                        Drag & Drop image here or choose file
                                    </p>
                                </div>
                            )}
                        </div>
                        <div>
                            <textarea 
                                className="textarea w-full bg-base-200 border-base-300 rounded" 
                                placeholder="Deskripsi Produk"
                                value={form.deskripsi}
                                onChange={(e) => setForm(prev => ({
                                    ...prev, 
                                    deskripsi: e.target.value
                                }))} 
                            ></textarea>
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

export default ItemInput;