
import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../features/auth/authApi";

function ProtectedRoute() {
    const { data, isLoading, isError } = useGetMeQuery();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-950 flex items-center justify-center text-emerald-400">
                Checking your session...
            </div>
        );
    }

    if (isError || !data?.success) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
