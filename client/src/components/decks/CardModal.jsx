import { useEffect, useState } from "react";
import { X } from "lucide-react";

function CardModal({ isOpen, onClose, onSubmit, card, isSaving }) {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setFront(card?.front || "");
            setBack(card?.back || "");
            setError("");
        }
    }, [isOpen, card]);

    if (!isOpen) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!front.trim() || !back.trim()) {
            setError("Both question and answer are required.");
            return;
        }

        if (front.trim().length > 2000 || back.trim().length > 5000) {
            setError("Question or answer exceeds the allowed length.");
            return;
        }

        try {
            setError("");
            await onSubmit({
                front: front.trim(),
                back: back.trim(),
            });
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.message ||
                "Unable to save flashcard."
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-xl rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {card ? "Edit flashcard" : "Add flashcard"}
                        </h2>
                        <p className="mt-1 text-sm text-stone-400">
                            Markdown formatting is supported.
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
                            Question / Front
                        </label>
                        <textarea
                            value={front}
                            onChange={(event) => setFront(event.target.value)}
                            rows={4}
                            maxLength={2000}
                            required
                            placeholder="What is JavaScript?"
                            className="w-full resize-y rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-600 focus:border-emerald-500"
                        />
                        <p className="mt-1 text-right text-xs text-stone-500">
                            {front.length}/2000
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-stone-300">
                            Answer / Back
                        </label>
                        <textarea
                            value={back}
                            onChange={(event) => setBack(event.target.value)}
                            rows={5}
                            maxLength={5000}
                            required
                            placeholder="JavaScript is a programming language..."
                            className="w-full resize-y rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-600 focus:border-emerald-500"
                        />
                        <p className="mt-1 text-right text-xs text-stone-500">
                            {back.length}/5000
                        </p>
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-stone-700 px-5 py-3 text-sm text-stone-300 hover:bg-stone-900"
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
                                : card
                                    ? "Save changes"
                                    : "Add flashcard"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CardModal;