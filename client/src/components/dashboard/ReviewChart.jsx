function ReviewChart({ data = [] }) {
    const maxCount = Math.max(...data.map((item) => item.count), 1);

    return (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
            <div className="mb-7 ">
                <h3 className="font-semibold text-white">Review activity</h3>
                <p className="mt-1 text-sm text-stone-500">
                    Your reviews over the last 30 days
                </p>
            </div>

            <div className="flex h-48 items-end gap-1.5 sm:gap-2">
                {data.map((item) => (
                    <div
                        key={item.date}
                        className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                        title={`${item.date}: ${item.count} reviews`}
                    >
                        <div className="mb-2 text-[10px] text-stone-400 opacity-0 group-hover:opacity-100">
                            {item.count}
                        </div>

                        <div
                            className="w-full rounded-t-md bg-emerald-500/80 transition hover:bg-emerald-400"
                            style={{
                                height: `${Math.max((item.count / maxCount) * 100, item.count > 0 ? 5 : 1)}%`,
                                minHeight: "3px",
                            }}
                        />

                        {new Date(`${item.date}T12:00:00`).getDate() % 5 === 0 && (
                            <span className="mt-2 text-[9px] text-stone-500">
                                {new Date(`${item.date}T12:00:00`).getDate()}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-stone-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Reviews completed
            </div>
        </div>
    );
}

export default ReviewChart;