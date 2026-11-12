
import { Link } from "react-router-dom";

function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <Link to="/" className="block text-center mb-10">
                    <span className="text-3xl font-bold tracking-tight">
                        Recall<span className="text-emerald-500">X.</span>
                    </span>
                    <p className="text-xs tracking-[0.25em] text-stone-500 mt-2 uppercase">
                        Remember more. Learn smarter.
                    </p>
                </Link>

                <div className="border border-stone-800 bg-stone-900/80 rounded-2xl p-7 sm:p-9 shadow-2xl shadow-black/30">
                    <h1 className="text-2xl font-semibold">{title}</h1>

                    <p className="text-stone-400 text-sm mt-2 mb-8">
                        {subtitle}
                    </p>

                    {children}
                </div>

                <p className="text-center text-xs text-stone-600 mt-8">
                    © {new Date().getFullYear()} RecallX. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default AuthLayout;
