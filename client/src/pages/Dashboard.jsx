import { Link } from "react-router-dom";
import {
    BookOpen,
    Flame,
    Layers3,
    Clock,
    Plus,
    ArrowRight,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import ReviewChart from "../components/dashboard/ReviewChart";

import { useGetDashboardStatsQuery } from "../features/stats/statsApi";
import { useGetDecksQuery } from "../features/decks/deckApi";

function Dashboard() {
    const {
        data: statsData,
        isLoading: statsLoading,
        isError: statsError,
    } = useGetDashboardStatsQuery();

    const {
        data: decksData,
        isLoading: decksLoading,
        isError: decksError,
    } = useGetDecksQuery();

    const stats = statsData?.stats || {};
    const decks = decksData?.decks || [];

    const isLoading = statsLoading || decksLoading;

    if (isLoading) {
        return (
            <div className="py-20 text-center text-stone-400">
                Loading your dashboard...
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-emerald-400">
                        YOUR LEARNING SPACE
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-white">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-stone-400">
                        Track your progress and keep your learning consistent.
                    </p>
                </div>

                <Link
                    to="/decks"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-emerald-400"
                >
                    <Plus size={18} />
                    Create deck
                </Link>
            </section>

            {statsError && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    Unable to load statistics. Please refresh the page.
                </p>
            )}

            {decksError && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    Unable to load your decks.
                </p>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Due Today"
                    value={stats.dueToday ?? 0}
                    description="Cards scheduled for today"
                    icon={BookOpen}
                />

                <StatCard
                    title="Overdue"
                    value={stats.overdue ?? 0}
                    description="Cards waiting for review"
                    icon={Clock}
                />

                <StatCard
                    title="Current Streak"
                    value={`${stats.currentStreak ?? 0} days`}
                    description="Keep your streak alive"
                    icon={Flame}
                />

                <StatCard
                    title="Total Reviews"
                    value={stats.totalReviewsLast30Days ?? 0}
                    description="Reviews in the last 30 days"
                    icon={Layers3}
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <ReviewChart data={statsData?.reviewsPerDay || []} />
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
                    <h3 className="font-semibold text-white">Daily progress</h3>
                    <p className="mt-1 text-sm text-stone-500">
                        Your current review workload
                    </p>

                    <div className="mt-8">
                        <p className="text-4xl font-bold text-white">
                            {stats.totalDue ?? 0}
                        </p>
                        <p className="mt-2 text-sm text-stone-400">
                            Cards due or overdue
                        </p>
                    </div>

                    <Link
                        to="/review"
                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
                    >
                        Start reviewing
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

            <section>
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Your decks</h2>
                        <p className="mt-1 text-sm text-stone-500">
                            Continue learning from your collections
                        </p>
                    </div>

                    <Link
                        to="/decks"
                        className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
                    >
                        View all
                    </Link>
                </div>

                {decks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-stone-700 bg-stone-900/30 px-6 py-12 text-center">
                        <Layers3 className="mx-auto text-stone-500" size={35} />

                        <h3 className="mt-4 font-semibold text-white">
                            No decks yet
                        </h3>

                        <p className="mt-2 text-sm text-stone-500">
                            Create your first deck to start learning.
                        </p>

                        <Link
                            to="/decks"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-stone-950 hover:bg-emerald-400"
                        >
                            <Plus size={17} />
                            Create your first deck
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {decks.slice(0, 3).map((deck) => (
                            <div
                                key={deck._id}
                                className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 transition hover:border-emerald-500/40"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                                        <Layers3 size={21} />
                                    </div>

                                    <span className="text-xs text-stone-500">
                                        {deck.totalCards ?? 0} cards
                                    </span>
                                </div>

                                <h3 className="mt-5 font-semibold text-white">
                                    {deck.title}
                                </h3>

                                <p className="mt-2 line-clamp-2 min-h-10 text-sm text-stone-400">
                                    {deck.description || "No description added."}
                                </p>

                                <p className="mt-4 text-xs text-stone-500">
                                    {deck.newCards ?? 0} new cards
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Dashboard;