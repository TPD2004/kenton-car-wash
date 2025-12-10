'use client';

type Props = {
    customer: {
        name: string;
        email: string;
        phone: string;
        vehicleReg: string;
    };
    onChange: (field: string, value: string) => void;
    onNext: () => void;
    onBack: () => void;
};

export function CustomerDetails({ customer, onChange, onNext, onBack }: Props) {
    const isValid = customer.name && customer.email && customer.phone;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Your Details</h2>
                <p className="text-slate-500 mt-2">Where should we send the confirmation?</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        value={customer.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                        placeholder="082 123 4567"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Registration (Optional)</label>
                    <input
                        type="text"
                        value={customer.vehicleReg}
                        onChange={(e) => onChange('vehicleReg', e.target.value)}
                        placeholder="CA 123-456"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
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
                    disabled={!isValid}
                    className="btn-primary w-full sm:w-auto"
                >
                    Review Booking
                </button>
            </div>
        </div>
    );
}
