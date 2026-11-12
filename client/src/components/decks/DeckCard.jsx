import { Link } from "react-router-dom";
import { Layers3, Pencil, Trash2, BookOpen } from "lucide-react";

function DeckCard({ deck, onEdit, onDelete, isDeleting }) {
    return (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 transition hover:border-emerald-500/40">
            <div className="flex items-start justify-between">
                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                    <Layers3 size={22} />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(deck)}
                        title="Edit deck"
                        className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-white"
                    >
                        <Pencil size={17} />
                    </button>

                    <button
                        onClick={() => onDelete(deck._id)}
                        disabled={isDeleting}
                        title="Delete deck"
                        className="rounded-lg p-2 text-stone-400 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    >
                        <Trash2 size={17} />
                    </button>
                </div>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
                {deck.title}
            </h3>

            <p className="mt-2 min-h-10 text-sm leading-6 text-stone-400">
                {deck.description || "No description added."}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-stone-800 pt-4">
                <div className="flex items-center gap-2 text-xs text-stone-400">
                    <BookOpen size={15} />
                    {deck.totalCards ?? 0} cards
                </div>

                <Link
                    to={`/decks/${deck._id}`}
                    className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
                >
                    Open deck →
                </Link>
            </div>

            <div className="mt-3 text-xs text-stone-500">
                {deck.newCards ?? 0} new cards
            </div>
        </div>
    );
}

export default DeckCard;