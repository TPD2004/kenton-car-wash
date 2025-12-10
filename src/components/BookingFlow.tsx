'use client';

import { useState } from 'react';
import { ServiceSelection } from './steps/ServiceSelection';
import { DateTimeSelection } from './steps/DateTimeSelection';
import { CustomerDetails } from './steps/CustomerDetails';
import { Confirmation } from './steps/Confirmation';
import { SuccessMessage } from './steps/SuccessMessage';

export type BookingState = {
    step: number;
    serviceCategory: string | null;
    serviceName: string | null;
    price: number | null;
    date: Date | null;
    timeSlot: string | null;
    customer: {
        name: string;
        email: string;
        phone: string;
        vehicleReg: string;
    };
};

const INITIAL_STATE: BookingState = {
    step: 1,
    serviceCategory: null,
    serviceName: null,
    price: null,
    date: null,
    timeSlot: null,
    customer: {
        name: '',
        email: '',
        phone: '',
        vehicleReg: '',
    },
};

export function BookingFlow() {
    const [state, setState] = useState<BookingState>(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);

    const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
    const prevStep = () => setState(prev => ({ ...prev, step: prev.step - 1 }));

    const updateState = (updates: Partial<BookingState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const updateCustomer = (field: string, value: string) => {
        setState(prev => ({
            ...prev,
            customer: { ...prev.customer, [field]: value },
        }));
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-8 bg-white shadow-xl rounded-2xl overflow-hidden my-8 min-h-[600px] flex flex-col">
            {/* Progress Bar */}
            <div className="w-full grid grid-cols-4 mb-8 text-sm font-medium text-slate-400 border-b border-slate-100 pb-4">
                {[1, 2, 3, 4].map(step => (
                    <div
                        key={step}
                        className={`flex items-center justify-center gap-2 ${state.step >= step ? 'text-teal-600' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${state.step >= step ? 'border-teal-500 bg-teal-50' : 'border-slate-200'}`}>
                            {step}
                        </div>
                        <span className="hidden sm:inline">
                            {step === 1 && 'Service'}
                            {step === 2 && 'Time'}
                            {step === 3 && 'Details'}
                            {step === 4 && 'Confirm'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex-1 flex flex-col">

                {state.step === 1 && (
                    <ServiceSelection
                        selectedCategory={state.serviceCategory}
                        selectedService={state.serviceName}
                        onSelect={(category, service, price) => {
                            updateState({ serviceCategory: category, serviceName: service, price });
                        }}
                        onNext={nextStep}
                    />
                )}

                {state.step === 2 && (
                    <DateTimeSelection
                        selectedDate={state.date}
                        selectedTime={state.timeSlot}
                        onSelectDate={(date) => updateState({ date, timeSlot: null })} // Reset time if date changes
                        onSelectTime={(time) => updateState({ timeSlot: time })}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}

                {state.step === 3 && (
                    <CustomerDetails
                        customer={state.customer}
                        onChange={updateCustomer}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}

                {state.step === 4 && (
                    <Confirmation
                        bookingData={state}
                        isSubmitting={isSubmitting}
                        setIsSubmitting={setIsSubmitting}
                        onConfirm={(id) => {
                            setBookingId(id);
                            updateState({ step: 5 });
                        }}
                        onBack={prevStep}
                    />
                )}

                {state.step === 5 && bookingId && (
                    <SuccessMessage bookingId={bookingId} />
                )}
            </div>
        </div>
    );
}
