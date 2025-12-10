'use client';

import { format } from 'date-fns';
import { supabase } from '@/utils/supabase';
import type { BookingState } from '../BookingFlow';

type Props = {
    bookingData: BookingState;
    isSubmitting: boolean;
    setIsSubmitting: (val: boolean) => void;
    onConfirm: (bookingId: string) => void;
    onBack: () => void;
};

export function Confirmation({ bookingData, isSubmitting, setIsSubmitting, onConfirm, onBack }: Props) {
    const { date, timeSlot, serviceCategory, serviceName, price, customer } = bookingData;

    const handleConfirm = async () => {
        setIsSubmitting(true);

        try {
            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    customer_name: customer.name,
                    customer_email: customer.email,
                    customer_phone: customer.phone,
                    vehicle_reg: customer.vehicleReg || null,
                    service_category: serviceCategory,
                    service_name: serviceName,
                    price: price,
                    booking_date: date ? format(date, 'yyyy-MM-dd') : null,
                    start_time: timeSlot,
                    status: 'confirmed',
                })
                .select()
                .single();

            if (error) {
                console.error('Booking error:', error);
                alert('Something went wrong. Please try again.');
                setIsSubmitting(false);
                return;
            }

            if (data) {
                onConfirm(data.id);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Confirm Booking</h2>
                <p className="text-slate-500 mt-2">Almost done! Please review your details.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-sm">
                <h3 className="font-semibold text-slate-800 mb-4 text-base border-b border-slate-200 pb-2">Booking Summary</h3>

                <div className="grid grid-cols-2 gap-y-4">
                    <div className="text-slate-500">Service</div>
                    <div className="font-medium text-right text-slate-900">{serviceCategory} - {serviceName}</div>

                    <div className="text-slate-500">Date</div>
                    <div className="font-medium text-right text-slate-900">{date ? format(date, 'MMMM d, yyyy') : '-'}</div>

                    <div className="text-slate-500">Time</div>
                    <div className="font-medium text-right text-slate-900">{timeSlot}</div>

                    <div className="text-slate-500">Vehicle</div>
                    <div className="font-medium text-right text-slate-900">{customer.vehicleReg || 'Not Provided'}</div>

                    <div className="text-slate-500 font-bold pt-2 border-t border-slate-200">Total</div>
                    <div className="font-bold text-teal-600 text-lg text-right pt-2 border-t border-slate-200">R{price}</div>
                </div>
            </div>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex items-start gap-3">
                <div className="mt-0.5">ℹ️</div>
                <div>
                    <span className="font-bold">Payment Notice:</span> Payment will be settled on-site. A confirmation email will be sent shortly after booking.
                </div>
            </div>

            <div className="flex justify-between pt-4 mt-auto">
                <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2"
                >
                    Back
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin">⏳</span> Processing...
                        </>
                    ) : (
                        'Confirm Booking'
                    )}
                </button>
            </div>
        </div>
    );
}
