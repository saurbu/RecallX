
const RATING_QUALITY = {
    Again: 0,
    Hard: 3,
    Good: 4,
    Easy: 5
};

export const calculateNextReview = (card, rating, now = new Date()) => {
    const quality = RATING_QUALITY[rating];

    if (quality === undefined) {
        throw new Error("Invalid review rating");
    }

    let repetitions = card.repetitions;
    let interval = card.interval;
    let easeFactor = card.easeFactor;

    // Update ease factor using the SM-2 formula.
    const difference = 5 - quality;

    easeFactor = Math.max(
        1.3,
        easeFactor + (
            0.1 -
            difference * (0.08 + difference * 0.02)
        )
    );

    if (rating === "Again") {
        repetitions = 0;
        interval = 1;
    } else {
        repetitions += 1;

        if (repetitions === 1) {
            interval = 1;
        } else if (repetitions === 2) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);

            if (rating === "Hard") {
                interval = Math.max(1, Math.round(interval * 0.8));
            }

            if (rating === "Easy") {
                interval = Math.max(1, Math.round(interval * 1.3));
            }
        }
    }

    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + interval);

    return {
        repetitions,
        interval,
        easeFactor: Number(easeFactor.toFixed(2)),
        dueDate
    };
};
