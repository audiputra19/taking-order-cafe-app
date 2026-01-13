import clsx from "clsx";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import loginImageDark from '../assets/images/loginImageDark.png';
import LoadingPage from "../components/loadingPage";
import { ThemeSwitcher } from "../components/themeSwitcher";
import { useAlert } from "../contexts/alertContext";
import { usePostRegisterMutation } from "../services/apiAuth";
import { useAppDispatch } from "../store";
import { Account } from "../subPages/register/account";
import { Business } from "../subPages/register/business";
import { Profile } from "../subPages/register/profile";

const Register: FC = () => {
    const [form, setForm] = useState({
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
    const [step, setStep] = useState(1);
    const [register, {isLoading: isLoadingLogin}] = usePostRegisterMutation();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const updateForm = (key: string, value: any) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleRegister = async () => {
        try {
            // console.log("register");
            const res = await register(form).unwrap();
            showAlert(res.message);
            navigate('/login');
        } catch (err: any) {
            showAlert(err?.data?.message ?? 'Terjadi kesalahan');
        }
    };

    return (
        <>
            {isLoadingLogin && <LoadingPage /> }
            <div className="min-h-screen md:flex md:justify-center items-center bg-base-200 md:p-5">
                <div className="hidden">
                    <ThemeSwitcher />
                </div>
                <div className="lg:w-[800px]">
                    <div className="flex md:border md:border-base-300 bg-base-100 md:rounded-3xl min-h-screen md:min-h-[550px]">
                        <div className="flex-1 flex flex-col">
                            <div className="p-10 flex gap-5">
                                <div
                                    className={clsx(
                                        "w-full flex flex-col gap-2",
                                        (step === 1 || step === 2 || step === 3) && "text-blue-500"
                                    )}
                                >
                                    <div className={clsx("p-[2px] rounded", 
                                        (step === 1 || step === 2 || step === 3) && "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500")}
                                    >
                                        <div className="w-full rounded"></div>
                                    </div>

                                    <div className="flex justify-center text-xs font-semibold">
                                        <p>Profile</p>
                                    </div>
                                </div>
                                <div
                                    className={clsx(
                                        "w-full flex flex-col gap-2",
                                        (step === 2 || step === 3) ? "text-blue-500" : "text-gray-300"
                                    )}
                                >
                                    <div className={clsx("p-[2px] rounded", 
                                        (step === 2 || step === 3) 
                                        ? "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
                                        : "bg-gray-300")}
                                    >
                                        <div className="w-full rounded"></div>
                                    </div>

                                    <div className="flex justify-center text-xs font-semibold">
                                        <p>Business</p>
                                    </div>
                                </div>
                                <div
                                    className={clsx(
                                        "w-full flex flex-col gap-2",
                                        (step === 3) ? "text-blue-500" : "text-gray-300"
                                    )}
                                >
                                    <div className={clsx("p-[2px] rounded", 
                                        (step === 3) 
                                        ? "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
                                        : "bg-gray-300")}
                                    >
                                        <div className="w-full rounded"></div>
                                    </div>

                                    <div className="flex justify-center text-xs font-semibold">
                                        <p>Account</p>
                                    </div>
                                </div>
                            </div>
                            {step === 1 ? (
                                <Profile 
                                    updateForm={updateForm}
                                    setStep={setStep}
                                />
                            ) : step === 2 ? (
                                <Business 
                                    updateForm={updateForm}
                                    setStep={setStep}
                                />
                            ) : (
                                <Account 
                                    updateForm={updateForm}
                                    setStep={setStep}
                                    handleRegister={handleRegister}
                                />
                            )}
                        </div>
                        <div className="hidden md:block relative w-[350px] mt-3 mb-3 mr-3 bg-gradient-to-t from-green-500 to-green-400 shadow-green-500 rounded-2xl md:flex flex-col justify-center items-center overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_40%,rgba(0,0,0,0.2)_100%)] pointer-events-none" />
                            <img
                                src={loginImageDark}
                                className="w-72"
                            />
                            <div className="mx-10">
                                <p className="text-center text-xl font-semibold text-white">Manage your cafe</p>
                                <p className="text-center text-xs text-green-100 mt-2">All-in-one dashboard to track orders, manage stock, and keep your café running smoothly every day</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register