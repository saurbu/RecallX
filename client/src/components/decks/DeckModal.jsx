import { useEffect, useState } from "react";
import { X } from "lucide-react";

function DeckModal({ isOpen, onClose, onSubmit, deck, isSaving }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setTitle(deck?.title || "");
            setDescription(deck?.description || "");
            setError("");
        }
    }, [isOpen, deck]);

    if (!isOpen) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (title.trim().length < 2) {
            setError("Deck title must contain at least 2 characters.");
            return;
        }

        if (title.trim().length > 80) {
            setError("Deck title cannot exceed 80 characters.");
            return;
        }

        if (description.trim().length > 300) {
            setError("Description cannot exceed 300 characters.");
            return;
        }

        setError("");

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
            });
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.message ||
                "Unable to save deck. Please try again."
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {deck ? "Edit deck" : "Create a new deck"}
                        </h2>
                        <p className="mt-1 text-sm text-stone-400">
                            Organize your flashcards into a collection.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-stone-300">
                            Deck title
                        </label>

                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="e.g. JavaScript Fundamentals"
                            maxLength={80}
                            required
                            className="w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-600 focus:border-emerald-500"
                        />
                        <p className="mt-1 text-right text-xs text-stone-500">
                            {title.length}/80
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-stone-300">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="What will you learn in this deck?"
                            rows={4}
                            maxLength={300}
                            className="w-full resize-none rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-600 focus:border-emerald-500"
                        />

                        <p className="mt-1 text-right text-xs text-stone-500">
                            {description.length}/300
                        </p>
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-medium text-stone-300 hover:bg-stone-900"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-emerald-400 disabled:opacity-50"
                        >
                            {isSaving
                                ? "Saving..."
                                : deck
                                    ? "Save changes"
                                    : "Create deck"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeckModal;