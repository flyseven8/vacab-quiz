import { useState, useEffect } from "react";
import './index.css'
import QuizResult from "./components/QuizResult";
import { quizResults23, quizResults24 } from "./data/quizData";
// import selectGif from './assets/cat.gif';

export default function App() {
    const [selected, setSelected] = useState<23 | 24 | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode === 'true' ? true : false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('isDarkMode', String(isDarkMode));
    }, [isDarkMode]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors relative">
            <div className="fixed top-32 left-1/2 -translate-x-1/2 z-50 text-5xl font-extrabold text-gray-800 dark:text-white">
                단원 급수제
            </div>
            <button
                className="fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white z-50"
                onClick={() => setIsDarkMode(!isDarkMode)}
            >
                {isDarkMode ? '🌞' : '🌙'}
            </button>

            {selected === null ? (
                // 선택 화면
                <div className="flex flex-col items-center justify-center min-h-screen pt-20">
                    {/* <img src={selectGif} alt="과 선택" className="w-64 h-64 mb-8" /> */}
                    <div className="text-2xl font-bold mb-8 dark:text-white">과를 선택하세요.</div>
                    <div className="flex gap-8">
                        <button
                            className="px-10 py-6 text-xl rounded-lg bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
                            onClick={() => setSelected(23)}
                        >
                            23과
                        </button>
                        <button
                            className="px-10 py-6 text-xl rounded-lg bg-green-500 text-white shadow-lg hover:bg-green-600 transition"
                            onClick={() => setSelected(24)}
                        >
                            24과
                        </button>
                    </div>
                </div>
            ) : (
                // QuizResult로 이동
                <div className="pt-20">
                    <QuizResult items={selected === 23 ? quizResults23 : quizResults24} onGoMain={() => setSelected(null)} />
                </div>
            )}
        </div>
    );
}