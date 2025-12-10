'use client';

import { CheckCircle } from 'lucide-react';

export function SuccessMessage({ bookingId }: { bookingId: string }) {
    return (
        <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-500 w-10 h-10" />
                </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Booking Confirmed!</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
                Your booking has been successfully secured. We look forward to seeing you!
                <br />
                <span className="text-xs text-slate-400 mt-2 block">Reference ID: {bookingId}</span>
            </p>

            <button
                onClick={() => window.location.reload()}
                className="text-teal-600 font-medium hover:underline"
            >
                Make another booking
            </button>
        </div>
    );
}
