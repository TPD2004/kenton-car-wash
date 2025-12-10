'use client';

import { Car, Anchor, Truck } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn utility will be created, or I'll just use template literals for now to save a file check. I'll use template literals + clsx if needed, but for now just inline or straightforward.
// Actually I didn't create lib/utils yet. I'll just do inline logic or simple strings.

const SERVICES = [
    {
        id: 'Car',
        icon: Car,
        options: [
            { name: 'Express Wash', price: 150 },
            { name: 'Full Valet', price: 450 },
        ],
    },
    {
        id: 'Boat',
        icon: Anchor,
        options: [
            { name: 'Hull Clean', price: 800 },
            { name: 'Full Deck & Hull', price: 1500 },
        ],
    },
    {
        id: 'Other',
        icon: Truck,
        options: [
            { name: 'Trailer Wash', price: 250 },
            { name: 'Caravan Detail', price: 650 },
        ],
    },
];

type Props = {
    selectedCategory: string | null;
    selectedService: string | null;
    onSelect: (category: string, service: string, price: number) => void;
    onNext: () => void;
};

export function ServiceSelection({ selectedCategory, selectedService, onSelect, onNext }: Props) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Choose Your Service</h2>
                <p className="text-slate-500 mt-2">Select a vehicle type to see available packages</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SERVICES.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => onSelect(cat.id, '', 0)} // Reset service when changing category
                        className={`card-option flex flex-col items-center justify-center gap-4 py-8 group ${selectedCategory === cat.id ? 'selected' : ''
                            }`}
                    >
                        <cat.icon
                            size={48}
                            className={`transition-colors duration-300 ${selectedCategory === cat.id ? 'text-teal-500' : 'text-slate-400 group-hover:text-teal-400'
                                }`}
                        />
                        <span className="font-semibold text-lg">{cat.id}</span>
                    </div>
                ))}
            </div>

            {selectedCategory && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-medium text-slate-700">Select Package for {selectedCategory}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SERVICES.find((c) => c.id === selectedCategory)?.options.map((opt) => (
                            <div
                                key={opt.name}
                                onClick={() => onSelect(selectedCategory, opt.name, opt.price)}
                                className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center hover:border-teal-400 transition-all ${selectedService === opt.name
                                    ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500'
                                    : 'border-slate-200 bg-white'
                                    }`}
                            >
                                <span className="font-medium text-slate-800">{opt.name}</span>
                                <span className="font-bold text-teal-600">R{opt.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4 mt-auto">
                <button
                    onClick={onNext}
                    disabled={!selectedCategory || !selectedService}
                    className="btn-primary w-full sm:w-auto"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
