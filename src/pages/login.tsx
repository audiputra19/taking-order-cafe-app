import clsx from "clsx";
import { useState, type FC } from "react";
import { LuEye, LuEyeOff, LuKeyRound, LuUserRound } from "react-icons/lu";
import { PiCoffeeBeanFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import loginImageDark from '../assets/images/loginImageDark.png';
import { useAlert } from "../contexts/alertContext";
import { usePostLoginMutation } from "../services/apiAuth";
import { useAppDispatch } from "../store";
import { setToken } from "../store/authSlice";
import LoadingPage from "../components/loadingPage";
import { ThemeSwitcher } from "../components/themeSwitcher";

const Login: FC = () => {
    const [showPassword, setShowPassword] = useState('password');
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [login, {isLoading: isLoadingLogin}] = usePostLoginMutation();
    const { showAlert } = useAlert();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await login(form).unwrap();
            dispatch(setToken(res.data));
            showAlert(res.message);
            navigate('/');
        } catch (err: any) {
            showAlert(err?.data?.message ?? 'Terjadi kesalahan');
        }
    };

    return (
        <>
            {isLoadingLogin && <LoadingPage /> }
            <div className="min-h-screen md:flex md:justify-center items-center bg-base-200">
                <div className="lg:w-[800px] md:h-[550px]">
                    <div className="flex border border-base-300 bg-base-100 md:rounded-3xl h-screen md:h-full">
                        <div className="flex-1 flex flex-col">
                            <div className="p-5">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2 items-center">
                                        <div className={clsx(
                                            "flex justify-center items-center rounded bg-gradient-to-r from-green-600 to-green-500 w-7 h-7 text-base-200"
                                        )}>
                                            <PiCoffeeBeanFill size={18}/>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Kopiku</p>
                                        </div>
                                    </div>
                                    <div>
                                        <ThemeSwitcher />
                                    </div>
                                </div>
                            </div>
                            <div className="mx-5 mb-5 flex-1 flex flex-col gap-3 justify-center items-center">
                                <div className="text-center">
                                    <div className="md:hidden">
                                        <img
                                            src={loginImageDark}
                                            className="w-64"
                                        />
                                    </div>
                                    <p className="font-semibold text-xl">Sign in to Kopiku</p>
                                    <p className="text-gray-400 text-xs mt-2">Smart Management for Your Cafe</p>
                                </div>
                                <div className="mt-5">
                                    <label className="input rounded-lg w-[300px]" id="username">
                                        <LuUserRound size={18}/>   
                                        <input
                                            type="text"
                                            required
                                            placeholder="Username"
                                            onChange={(e) => 
                                                setForm(prev => ({
                                                    ...prev,
                                                    username: e.target.value
                                                }))
                                            }
                                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="input rounded-lg w-[300px]">
                                        <LuKeyRound size={18}/>   
                                        <input
                                            type={showPassword}
                                            required
                                            placeholder="Password"
                                            onChange={(e) => 
                                                setForm(prev => ({
                                                    ...prev,
                                                    password: e.target.value
                                                }))
                                            }
                                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
                                </div>
                                <div className="mt-2">
                                    <button
                                        className="btn bg-gradient-to-r from-green-600 to-green-500 p-5 rounded-lg text-white w-[300px] cursor-pointer"
                                        onClick={handleLogin}
                                    >
                                        Sign In
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <p className="flex gap-1 text-sm">
                                        Don't have an account?
                                        <span 
                                            className="text-blue-500 underline cursor-pointer hover:text-blue-800"
                                            onClick={() => navigate('/register')}
                                        >
                                            Register
                                        </span>
                                    </p>
                                </div>
                            </div>
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

export default Login