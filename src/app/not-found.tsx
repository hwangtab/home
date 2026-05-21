import './globals.css';
import Link from 'next/link';
import { bombaram, myungjo, santokki } from '../fonts';

export default function NotFound() {
    return (
        <html lang="ko" className={`${bombaram.variable} ${myungjo.variable} ${santokki.variable}`}>
            <body>
                <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
                    <div className="max-w-md mx-auto text-center space-y-6">
                        <div className="text-7xl font-bold text-brand-primary-500 font-santokki">404</div>
                        <h1 className="text-2xl font-bold text-white font-santokki">페이지를 찾을 수 없습니다</h1>
                        <p className="text-gray-300 font-wanted-sans">
                            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors font-wanted-sans"
                        >
                            홈으로 돌아가기
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
