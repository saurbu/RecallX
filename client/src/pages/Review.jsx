import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Coffee, RotateCcw } from "lucide-react";

import ReviewCard from "../components/reviews/ReviewCard";
import {
    useGetTodayQueueQuery,
    useSubmitReviewMutation,
} from "../features/reviews/reviewApi";

function Review() {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetTodayQueueQuery();

    const [submitReview, { isLoading: isSaving }] = useSubmitReviewMutation();

    const [cards, setCards] = useState([]);
    const [pageError, setPageError] = useState("");
    const [completed, setCompleted] = useState(0);

    useEffect(() => {
        if (data?.success) {
            setCards([
                ...(data.dueCards || []),
                ...(data.newCards || []),
            ]);
        }
    }, [data]);

    const summary = data?.summary || {};
    const currentCard = cards[0];

    const handleRate = async (rating) => {
        if (!currentCard || isSaving) return;

        setPageError("");

        try {
            await submitReview({
                cardId: currentCard._id,
                rating,
            }).unwrap();

            setCards((previous) =>
                previous.filter((card) => card._id !== currentCard._id)
            );

            setCompleted((previous) => previous + 1);
        } catch (err) {
            setPageError(
                err?.data?.message || "Unable to save your review. Please try again."
            );
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 text-center text-stone-400">
                Preparing your review session...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-xl py-20 text-center">
                <p className="text-red-400">
                    {error?.data?.message || "Unable to load your review queue."}
                </p>

                <button
                    onClick={refetch}
                    className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-stone-950"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section>
                <p className="text-sm font-medium text-emerald-400">
                    DAILY LEARNING SESSION
                </p>

                <h1 className="mt-2 text-3xl font-bold text-white">
                    Review cards
                </h1>

                <p className="mt-2 text-sm text-stone-400">
                    Strengthen your memory one card at a time.
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
                    <p className="text-sm text-stone-400">Due cards</p>
                    <p className="mt-3 text-3xl font-bold text-white">
                        {summary.dueCount ?? 0}
                    </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
                    <p className="text-sm text-stone-400">New cards studied</p>
                    <p className="mt-3 text-3xl font-bold text-white">
                        {summary.newCardsStudied ?? 0}
                    </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
                    <p className="text-sm text-stone-400">Remaining new cards</p>
                    <p className="mt-3 text-3xl font-bold text-white">
                        {summary.remainingNewCards ?? 0}
                    </p>
                </div>
            </section>

            {pageError && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    {pageError}
                </p>
            )}

            {currentCard ? (
                <>
                    <div className="flex items-center justify-between text-sm text-stone-400">
                        <span>Session progress</span>
                        <span>{completed} completed this session</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-stone-800">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{
                                width: `${completed / (completed + cards.length) * 100}%`,
                            }}
                        />
                    </div>

                    <ReviewCard
                        key={currentCard._id}
                        card={currentCard}
                        onRate={handleRate}
                        isSaving={isSaving}
                    />
                </>
            ) : (
                <div className="rounded-3xl border border-stone-800 bg-stone-900/50 px-6 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                        {completed > 0 ? (
                            <CheckCircle2 size={32} />
                        ) : (
                            <Coffee size={32} />
                        )}
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-white">
                        {completed > 0
                            ? "Review session complete!"
                            : "You're all caught up!"}
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-400">
                        {completed > 0
                            ? `You reviewed ${completed} cards. Great work staying consistent.`
                            : "There are no cards waiting for review right now. Come back when new cards are due."}
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => {
                                setCompleted(0);
                                refetch();
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-stone-700 px-5 py-3 text-sm font-medium text-stone-300 hover:bg-stone-800"
                        >
                            <RotateCcw size={16} />
                            Refresh queue
                        </button>

                        <Link
                            to="/decks"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-emerald-400"
                        >
                            <BookOpen size={17} />
                            My decks
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Review;