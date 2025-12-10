import { addDays, format, getDay, setHours, startOfHour } from 'date-fns';

export type TimeSlot = {
    time: string; // "HH:00"
    available: boolean;
};

// Opening Hours Configuration
// 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const OPENING_HOURS: Record<number, { start: number; end: number } | null> = {
    0: null, // Closed
    1: { start: 8, end: 17 },
    2: { start: 8, end: 17 },
    3: { start: 8, end: 17 },
    4: { start: 8, end: 17 },
    5: { start: 8, end: 17 },
    6: { start: 8, end: 12 },
};

/**
 * Generates all possible time slots for a given date based on opening hours.
 * Does NOT check database availability (pure business logic).
 */
export function generateDailySlots(date: Date): string[] {
    const dayOfWeek = getDay(date);
    const hours = OPENING_HOURS[dayOfWeek];

    if (!hours) {
        return [];
    }

    const slots: string[] = [];
    // Generate slots from start hour up to (but not including) end hour if we consider "17:00" as closing time (last slot 16:00).
    // Requirement says: "Monday - Friday: Open 08:00 to 17:00 (Slots: 08:00, 09:00 ... last slot 16:00)."
    // So loop until < hours.end
    for (let h = hours.start; h < hours.end; h++) {
        // Format to "HH:00"
        const timeString = `${h.toString().padStart(2, '0')}:00`;
        slots.push(timeString);
    }

    return slots;
}

/**
 * Checks if a slot is booked.
 * @param bookedTimes Array of start_time strings from DB (e.g. ["09:00", "14:00"])
 * @param slotTime The time slot to check (e.g. "09:00")
 * @returns true if available, false if booked
 */
export function isSlotAvailable(bookedTimes: string[], slotTime: string): boolean {
    return !bookedTimes.includes(slotTime);
}
