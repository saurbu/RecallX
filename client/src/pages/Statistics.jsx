
import { useGetDashboardStatsQuery } from "../features/stats/statsApi";
import StatCard from "../components/dashboard/StatCard";
import ReviewChart from "../components/dashboard/ReviewChart";
import {
    Activity,
    Flame,
    CalendarCheck,
    BookOpen,
    TrendingUp
} from "lucide-react";

function Statistics() {
    const { data, isLoading, isError, refetch } =
        useGetDashboardStatsQuery();

    if (isLoading) {
        return (
            <div className="py-20 text-center text-stone-500">
                Loading your statistics...
            </div>
        );
    }

    if (isError || !data?.success) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-red-700">
                    Unable to load statistics.
                </p>
                <button
                    onClick={refetch}
                    className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                >
                    Try again
                </button>
            </div>
        );
    }

    const stats = data.stats;
    const reviews = data.reviewsPerDay || [];

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-medium text-emerald-600">
                    YOUR PERFORMANCE
                </p>
                <h1 className="mt-1 text-3xl font-bold text-stone-900">
                    Statistics
                </h1>
                <p className="mt-2 text-stone-500">
                    Track your learning progress and review consistency.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Due Today"
                    value={stats.dueToday}
                    icon={CalendarCheck}
                    color="emerald"
                />
                <StatCard
                    title="Overdue"
                    value={stats.overdue}
                    icon={Activity}
                    color="orange"
                />
                <StatCard
                    title="Current Streak"
                    value={`${stats.currentStreak} days`}
                    icon={Flame}
                    color="amber"
                />
                <StatCard
                    title="Reviews (30 Days)"
                    value={stats.totalReviewsLast30Days}
                    icon={BookOpen}
                    color="blue"
                />
            </div>
                <ReviewChart data={reviews} />

            <section className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 shadow-sm sm:p-7">
                <h2 className="font-semibold text-white">
                    Learning Summary
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-stone-500">
                            Total reviews completed
                        </p>
                        <p className="mt-1 text-2xl font-bold text-white">
                            {stats.totalReviewsLast30Days}
                        </p>
                        <p className="mt-1 text-xs text-stone-400">
                            In the last 30 days
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-stone-500">
                            Total cards due
                        </p>
                        <p className="mt-1 text-2xl font-bold text-white">
                            {stats.totalDue}
                        </p>
                        <p className="mt-1 text-xs text-stone-400">
                            Including overdue cards
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Statistics;
