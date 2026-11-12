import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Eye, RotateCcw } from "lucide-react";

const ratings = [
    {
        label: "Again",
        description: "Forgot",
        className: "border-red-500/30 text-red-400 hover:bg-red-500/10",
    },
    {
        label: "Hard",
        description: "Difficult",
        className: "border-orange-500/30 text-orange-400 hover:bg-orange-500/10",
    },
    {
        label: "Good",
        description: "Remembered",
        className: "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10",
    },
    {
        label: "Easy",
        description: "Very easy",
        className: "border-sky-500/30 text-sky-400 hover:bg-sky-500/10",
    },
];

function ReviewCard({ card, onRate, isSaving }) {
    const [isRevealed, setIsRevealed] = useState(false);

    const handleRating = (rating) => {
        onRate(rating);
    };

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="mb-4 flex items-center justify-between text-xs text-stone-500">
                <span className="rounded-full bg-stone-800 px-3 py-1.5">
                    {card.deck?.title || "Flashcard"}
                </span>

                <span>Question & Answer</span>
            </div>

            <div className="min-h-[320px] rounded-3xl border border-stone-800 bg-stone-900/70 p-7 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    {isRevealed ? "Answer" : "Question"}
                </p>

                <div className="prose prose-invert prose-lg mt-8 min-h-[180px] max-w-none break-words text-stone-100">
                    <ReactMarkdown>
                        {isRevealed ? card.back : card.front}
                    </ReactMarkdown>
                </div>

                {!isRevealed && (
                    <button
                        onClick={() => setIsRevealed(true)}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-emerald-400"
                    >
                        <Eye size={17} />
                        Reveal answer
                    </button>
                )}

                {isRevealed && (
                    <div className="mt-6 flex items-center gap-2 text-xs text-stone-500">
                        <RotateCcw size={14} />
                        How well did you remember this?
                    </div>
                )}
            </div>

            {isRevealed && (
                <div className="mt-6">
                    <p className="mb-3 text-center text-sm text-stone-400">
                        Rate your recall
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {ratings.map((rating) => (
                            <button
                                key={rating.label}
                                onClick={() => handleRating(rating.label)}
                                disabled={isSaving}
                                className={`rounded-xl border bg-stone-900 px-3 py-4 transition disabled:cursor-not-allowed disabled:opacity-50 ${rating.className}`}
                            >
                                <span className="block font-semibold">
                                    {rating.label}
                                </span>
                                <span className="mt-1 block text-xs opacity-70">
                                    {rating.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isSaving && (
                <p className="mt-4 text-center text-sm text-stone-400">
                    Saving your review...
                </p>
            )}
        </div>
    );
}

export default ReviewCard;