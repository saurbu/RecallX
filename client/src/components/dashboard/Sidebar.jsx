import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Layers3,
    BookOpen,
    BarChart3,
    Brain,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Decks", path: "/decks", icon: Layers3 },
    { name: "Review", path: "/review", icon: BookOpen },
    { name: "Statistics", path: "/statistics", icon: BarChart3 },
];

function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-stone-800 bg-stone-950 px-5 py-7 lg:flex">
            <div className="mb-12 flex items-center gap-2 px-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-stone-950">
                    <Brain size={22} />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                    Recall<span className="text-emerald-500">X.</span>
                </span>
            </div>

            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
                Workspace
            </p>

            <nav className="flex flex-col gap-2">
                {navigation.map(({ name, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "text-stone-400 hover:bg-stone-900 hover:text-white"
                            }`
                        }
                    >
                        <Icon size={19} />
                        {name}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
                <p className="text-sm font-semibold text-white">
                    Small steps, big progress.
                </p>
                <p className="mt-2 text-xs leading-5 text-stone-400">
                    Stay consistent with your daily reviews and keep learning.
                </p>
            </div>
        </aside>
    );
}

export default Sidebar;