import { redirect } from 'next/navigation';

export default function Home() {
    // Ini akan otomatis melempar user ke halaman login
    redirect('/login');
    
    return null;
}