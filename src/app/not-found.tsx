import './globals.css';
import type { Metadata } from 'next';
import { bombaram, myungjo, santokki } from '../fonts';
import LocalizedNotFound from '../components/next/LocalizedNotFound';

export const metadata: Metadata = {
    title: 'Page Not Found | Hwang Gyeongha',
    description: 'The page you requested does not exist or may have moved.',
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/logo192.png', sizes: '192x192', type: 'image/png' },
            { url: '/logo512.png', sizes: '512x512', type: 'image/png' }
        ],
        apple: [{ url: '/logo192.png', sizes: '192x192', type: 'image/png' }]
    }
};

export default function NotFound() {
    return (
        <html lang="en" className={`${bombaram.variable} ${myungjo.variable} ${santokki.variable}`}>
            <body>
                <LocalizedNotFound
                    title="Page Not Found"
                    description="The page you requested does not exist or may have moved."
                    homeLabel="Back to Home"
                    homeHref="/"
                />
            </body>
        </html>
    );
}
