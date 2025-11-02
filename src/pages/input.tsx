import { useEffect, useState, type FC } from "react";
import { LuClipboardList, LuClipboardX, LuNotebookPen, LuUserPlus } from "react-icons/lu";
import { RiEdit2Line } from "react-icons/ri";
import { TbSquarePercentage } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingPage from "../components/loadingPage";
import { usePostMeQuery } from "../services/apiAuth";
import Discontinue from "../subPages/input/discontinue";
import ItemEdit from "../subPages/input/itemEdit";
import ItemInput from "../subPages/input/itemInput";
import { ItemList } from "../subPages/input/itemList";
import UserInput from "../subPages/input/userInput";
import { UserList } from "../subPages/input/userList";
import VoucherEdit from "../subPages/input/voucherEdit";
import VoucherInput from "../subPages/input/voucherInput";
import { VoucherList } from "../subPages/input/voucherList";

const Input: FC = () => {
    const location = useLocation();
    const path = location.pathname;
    const state = location.state?.from;
    const isEditInput = path.startsWith("/edit-input")
    const isEditVoucher = path.startsWith("/edit-voucher")
    const [activeTab, setActiveTab] = useState<string>("input-item");
    const navigate = useNavigate();
    const { data: MeData, isLoading: isLoadingMe } = usePostMeQuery();
    const user = MeData?.user;

    useEffect(() => {
        if(state === "item-edit") {
            setActiveTab("list-item");
        } else if(state === "user-edit") {
            setActiveTab("list-user");
        } else if(state === "voucher-edit") {
            setActiveTab("list-voucher");
        }
    }, [state]);

    return (
        <>
            {isLoadingMe && <LoadingPage />}
            <div className="tabs tabs-lift">
                <label 
                    className="tab"
                    onClick={() => {
                        setActiveTab("input-item");
                        navigate('/input');
                    }}
                >
                    <input type="radio" name="my_tabs_4" checked={activeTab === "input-item"} readOnly />
                    <LuNotebookPen size={18} className="mr-2"/>
                    Item Input
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-5">
                    <ItemInput />
                </div>

                <label 
                    className="tab"
                    onClick={() => {
                        setActiveTab("list-item");
                        navigate('/input');
                    }}
                >
                    <input type="radio" name="my_tabs_4" checked={activeTab === "list-item"} readOnly />
                    <LuClipboardList size={18} className="mr-2"/>
                    Item List
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-5">
                    <ItemList />
                </div>

                {isEditInput && (
                    <>
                        <label className="tab">
                            <input type="radio" name="my_tabs_4" defaultChecked />
                            <RiEdit2Line size={18} className="mr-2"/>
                            Item Edit
                        </label>
                        <div className="tab-content bg-base-100 border-base-300 p-5">
                            <ItemEdit />
                        </div>
                    </>
                )}

                <label 
                    className="tab"
                    onClick={() => {
                        setActiveTab("discontinue");
                        navigate('/input');
                    }}
                >
                    <input type="radio" name="my_tabs_4" checked={activeTab === "discontinue"} readOnly />
                    <LuClipboardX size={18} className="mr-2"/>
                    Discontinue
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-5">
                    <Discontinue />
                </div>

                {user?.hak_akses === 1 && (
                    <>
                        <label 
                            className="tab"
                            onClick={() => {
                                setActiveTab("input-user");
                                navigate('/input');
                            }}
                        >
                            <input type="radio" name="my_tabs_4" checked={activeTab === "input-user"} readOnly />
                            <LuUserPlus size={18} className="mr-2"/>
                            User Input
                        </label>
                        <div className="tab-content bg-base-100 border-base-300 p-5">
                            <UserInput />
                        </div>

                        <label 
                            className="tab"
                            onClick={() => {
                                setActiveTab("list-user");
                                navigate('/input');
                            }}
                        >
                            <input type="radio" name="my_tabs_4" checked={activeTab === "list-user"} readOnly />
                            <LuClipboardList size={18} className="mr-2"/>
                            User List
                        </label>
                        <div className="tab-content bg-base-100 border-base-300 p-5">
                            <UserList />
                        </div>

                        <label 
                            className="tab"
                            onClick={() => {
                                setActiveTab("input-voucher");
                                navigate('/input');
                            }}
                        >
                            <input type="radio" name="my_tabs_4" checked={activeTab === "input-voucher"} readOnly />
                            <TbSquarePercentage size={18} className="mr-2"/>
                            Voc Input
                        </label>
                        <div className="tab-content bg-base-100 border-base-300 p-5">
                            <VoucherInput />
                        </div>

                        <label 
                            className="tab"
                            onClick={() => {
                                setActiveTab("list-voucher");
                                navigate('/input');
                            }}
                        >
                            <input type="radio" name="my_tabs_4" checked={activeTab === "list-voucher"} readOnly />
                            <LuClipboardList size={18} className="mr-2"/>
                            Voc List
                        </label>
                        <div className="tab-content bg-base-100 border-base-300 p-5">
                            <VoucherList />
                        </div>
                    </>
                )}

                {isEditVoucher && (
                    <>
                        <label className="tab">
                            <input type="radio" name="my_tabs_4" defaultChecked />
                            <RiEdit2Line size={18} className="mr-2"/>
                            Voc Edit
                        </label>
                        <div className="tab-content bg-base-100 border-base-300 p-5">
                            <VoucherEdit />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Input;