import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useLogoutMutation } from "../../features/auth/authApi";
import { clearCredentials } from "../../features/auth/authSlice";
import { baseApi } from "../../services/baseApi";

function Topbar() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logout, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            dispatch(clearCredentials());
            dispatch(baseApi.util.resetApiState());
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="flex h-20 items-center justify-between border-b border-stone-800 bg-stone-950/80 px-5 sm:px-8">
            <div className="flex items-center gap-3">
                <button className="text-stone-400 lg:hidden">
                    <Menu size={23} />
                </button>

                <div>
                    <p className="text-sm text-stone-400">Welcome back,</p>
                    <h2 className="font-semibold text-white">
                        {user?.name || "Learner"}
                    </h2>
                </div>
            </div>

            <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-xl border border-stone-800 px-4 py-2.5 text-sm text-stone-300 transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
            >
                <LogOut size={17} />
                <span className="hidden sm:inline">
                    {isLoading ? "Logging out..." : "Logout"}
                </span>
            </button>
        </header>
    );
}

export default Topbar;