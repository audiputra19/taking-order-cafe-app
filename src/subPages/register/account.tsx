import { useState, type Dispatch, type FC, type SetStateAction } from "react";
import { LuEye, LuEyeOff, LuKeyRound, LuUserRound } from "react-icons/lu";

interface AccountType {
    updateForm: (key: string, value: any) => void;
    setStep: Dispatch<SetStateAction<number>>;
    handleRegister: () => void;
}

export const Account: FC<AccountType> = ({ updateForm, setStep, handleRegister }) => {
    const [showPassword, setShowPassword] = useState('password');
    const [showConfirmPassword, setShowConfirmPassword] = useState('password');

    return (
        <div className="mx-5 mb-5 flex-1 flex flex-col gap-3 justify-center items-center p-5">
            <div className="text-center">
                <p className="font-semibold text-xl">Create Your Account</p>
                <p className="text-gray-400 text-xs mt-2 max-w-[300px]">Finish setting up your account to log in.</p>
            </div>
            <div className="mt-5">
                <label className="input rounded-lg w-[300px]" id="username">
                    <LuUserRound size={18}/>   
                    <input
                        type="text"
                        required
                        placeholder="Username"
                        onChange={(e) => updateForm("username", e.target.value)}
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
                        onChange={(e) => updateForm("password", e.target.value)}
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
            <div>
                <label className="input rounded-lg w-[300px]">
                    <LuKeyRound size={18}/>   
                    <input
                        type={showConfirmPassword}
                        required
                        placeholder="Confirm Password"
                        onChange={(e) => updateForm("confirmPassword", e.target.value)}
                    />
                    {showConfirmPassword === 'password' ? (
                        <LuEye 
                            size={20} 
                            className="cursor-pointer"
                            onClick={() => setShowConfirmPassword('text')}
                        /> 
                    ) : (
                        <LuEyeOff 
                            size={20} 
                            className="cursor-pointer"
                            onClick={() => setShowConfirmPassword('password')}
                        />  
                    )}
                </label>
            </div>
            <div className="mt-2">
                <button
                    className="btn bg-gradient-to-r from-green-600 to-green-500 p-5 rounded-lg text-white w-[300px] cursor-pointer"
                    onClick={handleRegister}
                >
                    Register
                </button>
            </div>
            <div className="mt-2">
                <span 
                    className="text-sm text-blue-500 underline cursor-pointer hover:text-blue-800"
                    onClick={() => setStep(2)}
                >
                    Back
                </span>
            </div>
        </div>
    )
}