import type { Dispatch, FC, SetStateAction } from "react";
import { LuUserRound } from "react-icons/lu";
import { MdOutlineAlternateEmail, MdOutlinePhoneEnabled } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface ProfileType {
    updateForm: (key: string, value: any) => void;
    setStep: Dispatch<SetStateAction<number>>;
}

export const Profile: FC<ProfileType> = ({ updateForm, setStep }) => {
    const navigate = useNavigate();

    return (
        <div className="mx-5 mb-5 flex-1 flex flex-col gap-3 justify-center items-center">
            <div className="text-center">
                <p className="font-semibold text-xl">Your Profile</p>
                <p className="text-gray-400 text-xs mt-2 max-w-[300px]">Complete your profile information for other future needs.</p>
            </div>
            <div className="mt-5">
                <label className="input rounded-lg w-[300px]" id="username">
                    <LuUserRound size={18}/>   
                    <input
                        type="text"
                        required
                        placeholder="Full Name"
                        onChange={(e) => updateForm("fullname", e.target.value)}
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
                        onChange={(e) => updateForm("phone", e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label className="input rounded-lg w-[300px]" id="username">
                    <MdOutlineAlternateEmail size={18}/>   
                    <input
                        type="text"
                        required
                        placeholder="Email"
                        onChange={(e) => updateForm("email", e.target.value)}
                    />
                </label>
            </div>
            <div className="mt-2">
                <button
                    className="btn bg-gradient-to-r from-green-600 to-green-500 p-5 rounded-lg text-white w-[300px] cursor-pointer"
                    onClick={() => setStep(2)}
                >
                    Next Step
                </button>
            </div>
            <div className="mt-2">
                <p className="flex gap-1 text-sm">
                    Already have an account?
                    <span 
                        className="text-blue-500 underline cursor-pointer hover:text-blue-800"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    )
}