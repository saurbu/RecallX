function StatCard({ title, value, description, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-stone-400">{title}</p>
                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                    <Icon size={20} />
                </div>
            </div>

            <h3 className="mt-5 text-3xl font-bold text-white">{value}</h3>
            <p className="mt-2 text-xs text-stone-500">{description}</p>
        </div>
    );
}

export default StatCard;