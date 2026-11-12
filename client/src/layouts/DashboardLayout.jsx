import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

function DashboardLayout() {
    return (
        <div className="min-h-screen bg-stone-950 text-white">
            <Sidebar />

            <div className="min-h-screen lg:pl-64">
                <Topbar />
                    
                <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;