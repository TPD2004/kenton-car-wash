'use client';

import { useState } from 'react';
import { verifyPin, deleteBooking, getBookings } from '../actions';
import { format } from 'date-fns';
import { Trash2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState<any[]>([]);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await verifyPin(pin);
        if (res.success) {
            setIsAuthenticated(true);
            fetchBookings(pin);
        } else {
            setError(res.error || 'Invalid PIN');
        }
        setLoading(false);
    };

    const fetchBookings = async (currentPin: string) => {
        setLoading(true);
        const res = await getBookings(currentPin);
        if (res.success) {
            setBookings(res.data || []);
        } else {
            setError(res.error || 'Failed to fetch bookings');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;

        const res = await deleteBooking(id, pin);
        if (res.success) {
            // Refresh list
            fetchBookings(pin);
        } else {
            alert(res.error || 'Failed to delete');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                    <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Enter PIN</label>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                placeholder="****"
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Unlock Panel'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Bookings Dashboard</h1>
                    <button
                        onClick={() => fetchBookings(pin)}
                        className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Date / Time</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Contact</th>
                                    <th className="px-6 py-3">Vehicle</th>
                                    <th className="px-6 py-3">Service</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                                            {loading ? 'Loading...' : 'No bookings found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                                {format(new Date(booking.booking_date), 'MMM d, yyyy')}
                                                <div className="text-xs text-slate-500">{booking.start_time}</div>
                                            </td>
                                            <td className="px-6 py-4">{booking.customer_name}</td>
                                            <td className="px-6 py-4">
                                                <div>{booking.customer_email}</div>
                                                <div className="text-xs text-slate-400">{booking.customer_phone}</div>
                                            </td>
                                            <td className="px-6 py-4">{booking.vehicle_reg || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium">{booking.service_category}</span>
                                                <div className="text-xs text-slate-500">{booking.service_name}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-teal-600">R{booking.price}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(booking.id)}
                                                    className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                                                    title="Delete Booking"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
