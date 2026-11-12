
import Card from "../models/Card.js";
import Review from "../models/Review.js";
import { getZonedDayRange } from "../utils/dateUtils.js";

const getDateKey = (date, timeZone) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date);

    const values = Object.fromEntries(
        parts
            .filter(part => part.type !== "literal")
            .map(part => [part.type, part.value])
    );

    return `${values.year}-${values.month}-${values.day}`;
};

const getLast30Days = (todayKey) => {
    const [year, month, day] = todayKey.split("-").map(Number);

    const today = new Date(Date.UTC(year, month - 1, day));
    const dates = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setUTCDate(date.getUTCDate() - i);
        dates.push(date.toISOString().slice(0, 10));
    }

    return dates;
};

export const getDashboardStats = async (req, res) => {
    try {
        const timeZone = req.user.timezone || "Asia/Kolkata";
        const now = new Date();

        const { start, end } = getZonedDayRange(timeZone, now);

        const todayKey = getDateKey(now, timeZone);
        const dates = getLast30Days(todayKey);

        const [dueToday, overdue, reviews, reviewedDays] =
            await Promise.all([
                Card.countDocuments({
                    user: req.userId,
                    isNewCard: false,
                    dueDate: { $gte: start, $lte: end }
                }),

                Card.countDocuments({
                    user: req.userId,
                    isNewCard: false,
                    dueDate: { $lt: start }
                }),

                Review.find({
                    user: req.userId,
                    reviewedAt: {
                        $gte: new Date(
                            now.getTime() - 36 * 24 * 60 * 60 * 1000
                        ),
                        $lte: end
                    }
                })
                    .select("reviewedAt")
                    .lean(),

                Review.aggregate([
                    {
                        $match: {
                            user: req.user._id
                        }
                    },
                    {
                        $project: {
                            day: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$reviewedAt",
                                    timezone: timeZone
                                }
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$day"
                        }
                    }
                ])
            ]);

        // Prepare the last 30 days.
        const reviewCounts = {};

        for (const date of dates) {
            reviewCounts[date] = 0;
        }

        // All historical review dates for streak calculation.
        const reviewedDates = new Set(
            reviewedDays.map(item => item._id)
        );

        // Count reviews per day.
        for (const review of reviews) {
            const dateKey = getDateKey(
                review.reviewedAt,
                timeZone
            );

            if (reviewCounts[dateKey] !== undefined) {
                reviewCounts[dateKey]++;
            }
        }

        const reviewsPerDay = dates.map(date => ({
            date,
            count: reviewCounts[date]
        }));

        // Calculate current streak.
        const [year, month, day] = todayKey.split("-").map(Number);

        let streakDate = new Date(
            Date.UTC(year, month - 1, day)
        );

        if (!reviewedDates.has(todayKey)) {
            streakDate.setUTCDate(streakDate.getUTCDate() - 1);
        }

        let currentStreak = 0;

        while (true) {
            const key = streakDate.toISOString().slice(0, 10);

            if (!reviewedDates.has(key)) {
                break;
            }

            currentStreak++;

            streakDate.setUTCDate(
                streakDate.getUTCDate() - 1
            );
        }

        const totalReviewsLast30Days = reviewsPerDay.reduce(
            (total, item) => total + item.count,
            0
        );

        return res.status(200).json({
            success: true,
            timezone: timeZone,
            stats: {
                dueToday,
                overdue,
                totalDue: dueToday + overdue,
                currentStreak,
                totalReviewsLast30Days
            },
            reviewsPerDay
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard statistics"
        });
    }
};
