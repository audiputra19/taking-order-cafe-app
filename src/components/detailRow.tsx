import { useEffect, useState } from "react";

export const DetailRow = ({ show, children }: { show: boolean; children: React.ReactNode }) => {
    const [render, setRender] = useState(show);

    useEffect(() => {
        if (show) setRender(true);
    }, [show]);

    const handleTransitionEnd = () => {
        if (!show) setRender(false);
    };

    return (
        render && (
            <tr className="!bg-base-100">
                <td colSpan={8} className="p-0">
                    <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            show ? "max-h-[500px] opacity-100 p-2" : "max-h-0 opacity-0 p-0"
                        }`}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {children}
                    </div>
                </td>
            </tr>
        )
    );
};
