
const getDateParts = (date, timeZone) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date);

    return Object.fromEntries(
        parts
            .filter(part => part.type !== "literal")
            .map(part => [part.type, Number(part.value)])
    );
};

const getTimeZoneOffset = (date, timeZone) => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    }).formatToParts(date);

    const values = Object.fromEntries(
        parts
            .filter(part => part.type !== "literal")
            .map(part => [part.type, Number(part.value)])
    );

    const asUTC = Date.UTC(
        values.year,
        values.month - 1,
        values.day,
        values.hour,
        values.minute,
        values.second
    );

    return asUTC - date.getTime();
};

const localMidnightToUTC = (year, month, day, timeZone) => {
    const target = Date.UTC(year, month - 1, day);

    let result = target;

    for (let i = 0; i < 3; i++) {
        const offset = getTimeZoneOffset(
            new Date(result),
            timeZone
        );

        result = target - offset;
    }

    return new Date(result);
};

export const getZonedDayRange = (timeZone, now = new Date()) => {
    if (!timeZone || typeof timeZone !== "string") {
        throw new Error("A valid timezone is required");
    }

    // Validate the timezone.
    new Intl.DateTimeFormat("en-US", { timeZone });

    const { year, month, day } = getDateParts(now, timeZone);

    const start = localMidnightToUTC(
        year,
        month,
        day,
        timeZone
    );

    const nextDay = new Date(Date.UTC(year, month - 1, day + 1));

    const end = localMidnightToUTC(
        nextDay.getUTCFullYear(),
        nextDay.getUTCMonth() + 1,
        nextDay.getUTCDate(),
        timeZone
    );

    return {
        start,
        end: new Date(end.getTime() - 1)
    };
};
