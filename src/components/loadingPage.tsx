import type { FC } from "react";

const LoadingPage: FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-base-100 shadow-md border border-base-300 rounded-xl p-10 flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-t-transparent border-green-500 rounded-full animate-spin" />
        <p className="text-sm text-green-500">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
