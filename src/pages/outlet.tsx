import { useEffect, useState, type FC } from "react";
import { LuClipboardList, LuNotebookPen, LuUserPlus } from "react-icons/lu";
import { RiEdit2Line } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingPage from "../components/loadingPage";
import { usePostMeQuery } from "../services/apiAuth";
import ItemEdit from "../subPages/input/itemEdit";
import OutletInput from "../subPages/outlet/outletInput";
import { OutletList } from "../subPages/outlet/outletList";
import UserInput from "../subPages/outlet/userInput";
import { UserList } from "../subPages/outlet/userList";

const Outlet: FC = () => {
    const location = useLocation();
    const path = location.pathname;
    const state = location.state?.from;
    const isEditInput = path.startsWith("/edit-input")
    const [activeTab, setActiveTab] = useState<string>("input-outlet");
    const navigate = useNavigate();
    const { data: MeData, isLoading: isLoadingMe } = usePostMeQuery();
    const user = MeData?.user;

    useEffect(() => {
        if(state === "outlet-edit") {
            setActiveTab("list-outlet");
        } else if(state === "user-edit") {
            setActiveTab("list-user");
        } else if(state === "voucher-edit") {
            setActiveTab("list-voucher");
        }
    }, [state]);

    return (
        <>
            {isLoadingMe && <LoadingPage />}
            <div className="tabs tabs-lift p-5">
                <label 
                    className="tab"
                    onClick={() => {
                        setActiveTab("input-outlet");
                        navigate('/outlet');
                    }}
                >
                    <input type="radio" name="my_tabs_4" checked={activeTab === "input-outlet"} readOnly />
                    <LuNotebookPen size={18} className="mr-2"/>
                    Outlet Input
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-5">
                    <OutletInput />
                </div>

                <label 
                    className="tab"
                    onClick={() => {
                        setActiveTab("list-outlet");
                        navigate('/outlet');
                    }}
                >
                    <input type="radio" name="my_tabs_4" checked={activeTab === "list-outlet"} readOnly />
                    <LuClipboardList size={18} className="mr-2"/>
                    Outlet List
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-5">
                    <OutletList />
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

                {user?.hak_akses === 1 && (
                    <>
                        <label 
                            className="tab"
                            onClick={() => {
                                setActiveTab("input-user");
                                navigate('/outlet');
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
                                navigate('/outlet');
                            }}
                        >
                            <input type="radio" name="my_tabs_4" checked={activeTab === "list-user"} readOnly />
                            <LuClipboardList size={18} className="mr-2"/>
                            User List
                        </label>
                        <div className="tab-content bg-base-100 border-base-300 p-5">
                            <UserList />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Outlet;