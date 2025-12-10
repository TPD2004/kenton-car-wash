import { BookingFlow } from '@/components/BookingFlow';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-2">
          Kenton Car Wash
        </h1>
        <p className="text-lg text-slate-600">
          Premium Vehicle Cleaning Services
        </p>
      </div>

      <BookingFlow />

      <footer className="mt-16 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Kenton Car Wash. All rights reserved.
      </footer>
    </main>
  );
}
