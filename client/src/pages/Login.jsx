
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useDispatch } from "react-redux";

import AuthLayout from "../layouts/AuthLayout";
import { useLoginMutation } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim() || !formData.password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const response = await login(formData).unwrap();

            dispatch(setCredentials(response.user));
            navigate("/dashboard");
        } catch (err) {
            setError(err?.data?.message || "Unable to login. Please try again.");
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to continue your learning journey."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-sm text-stone-300 block mb-2">
                        Email address
                    </label>

                    <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-emerald-500 transition"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-stone-300 block mb-2">
                        Password
                    </label>

                    <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 pl-11 pr-12 outline-none focus:border-emerald-500 transition"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition"
                >
                    {isLoading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="text-sm text-center text-stone-400 mt-7">
                Don't have an account?{" "}
                <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
                    Create account
                </Link>
            </p>
        </AuthLayout>
    );
}

export default Login;
