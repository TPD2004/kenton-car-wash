'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const ADMIN_PIN = process.env.ADMIN_PIN || '1234';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// We use a service role client to bypass RLS for admin actions (like delete)
// If you don't have the service role key set up yet, this will fail on delete.
// For MVP without service role, we might need a dangerous "allow delete to public" policy, 
// but let's try to do it right with service role if possible.
const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function verifyPin(pin: string) {
    // Simple equality check
    if (pin === ADMIN_PIN) {
        return { success: true };
    }
    return { success: false, error: 'Incorrect PIN' };
}

export async function deleteBooking(bookingId: string, pin: string) {
    // Double check PIN on server side before action
    if (pin !== ADMIN_PIN) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const { error } = await adminSupabase
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        if (error) throw error;

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: 'Failed to delete booking' };
    }
}

export async function getBookings(pin: string) {
    if (pin !== ADMIN_PIN) {
        return { success: false, error: 'Unauthorized' };
    }

    // Admin can see everything
    const { data, error } = await adminSupabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true });

    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, data };
}
