import ReactMarkdown from "react-markdown";
import { Pencil, Trash2 } from "lucide-react";

function FlashcardItem({ card, onEdit, onDelete }) {
    return (
        <article className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Question
                    </p>

                    <div className="prose prose-invert prose-sm max-w-none break-words text-stone-200">
                        <ReactMarkdown>{card.front}</ReactMarkdown>
                    </div>

                    <div className="my-5 border-t border-stone-800" />

                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Answer
                    </p>

                    <div className="prose prose-invert prose-sm max-w-none break-words text-stone-400">
                        <ReactMarkdown>{card.back}</ReactMarkdown>
                    </div>
                </div>

                <div className="flex shrink-0 gap-1">
                    <button
                        onClick={() => onEdit(card)}
                        title="Edit flashcard"
                        className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-white"
                    >
                        <Pencil size={17} />
                    </button>

                    <button
                        onClick={() => onDelete(card._id)}
                        title="Delete flashcard"
                        className="rounded-lg p-2 text-stone-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <Trash2 size={17} />
                    </button>
                </div>
            </div>
        </article>
    );
}

export default FlashcardItem;