'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { generateDailySlots, isSlotAvailable } from '@/utils/bookingLogic';

type Props = {
    selectedDate: Date | null;
    selectedTime: string | null;
    onSelectDate: (date: Date) => void;
    onSelectTime: (time: string) => void;
    onNext: () => void;
    onBack: () => void;
};

export function DateTimeSelection({
    selectedDate,
    selectedTime,
    onSelectDate,
    onSelectTime,
    onNext,
    onBack,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState<string[]>([]);
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);

    // Calculate generic slots when date changes
    useEffect(() => {
        if (selectedDate) {
            const generated = generateDailySlots(selectedDate);
            setSlots(generated);
        } else {
            setSlots([]);
        }
    }, [selectedDate]);

    // Fetch bookings when date changes
    useEffect(() => {
        async function fetchBookings() {
            if (!selectedDate) return;

            setLoading(true);
            const dateStr = format(selectedDate, 'yyyy-MM-dd');

            const { data, error } = await supabase
                .from('bookings')
                .select('start_time')
                .eq('booking_date', dateStr)
                .eq('status', 'confirmed'); // Only check confirmed bookings

            if (error) {
                console.error('Error fetching bookings:', error);
            } else {
                const times = data.map((b: any) => b.start_time);
                setBookedTimes(times);
            }
            setLoading(false);
        }

        fetchBookings();
    }, [selectedDate]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Select Date & Time</h2>
                <p className="text-slate-500 mt-2">When would you like us to come?</p>
            </div>

            <div className="space-y-6">
                {/* Date Picker (Native for now) */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Pick a Date</label>
                    <div className="relative">
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-800 pointer-events-none sm:hidden" size={20} />
                        {!selectedDate && (
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none sm:hidden">
                                yyyy/mm/dd
                            </span>
                        )}
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                            onChange={(e) => {
                                if (e.target.value) {
                                    onSelectDate(new Date(e.target.value));
                                }
                            }}
                            className="w-full max-w-full box-border px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all appearance-none sm:[appearance:auto] bg-transparent relative z-10"
                        />
                    </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                    <div className="animate-in fade-in duration-300">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Available Slots</label>

                        {loading ? (
                            <div className="text-center py-8 text-slate-400">Loading availability...</div>
                        ) : slots.length === 0 ? (
                            <div className="text-center py-8 text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                                Sorry, no slots available on this day (We might be closed).
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {slots.map((time) => {
                                    const available = isSlotAvailable(bookedTimes, time);
                                    return (
                                        <button
                                            key={time}
                                            disabled={!available}
                                            onClick={() => onSelectTime(time)}
                                            className={`
                        py-2 text-sm font-medium rounded-md transition-all
                        ${!available
                                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed decoration-slate-400'
                                                    : selectedTime === time
                                                        ? 'bg-teal-500 text-white shadow-md scale-105'
                                                        : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-400 hover:text-teal-600'
                                                }
                      `}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-4 mt-auto">
                <button
                    onClick={onBack}
                    className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!selectedDate || !selectedTime}
                    className="btn-primary w-full sm:w-auto"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
