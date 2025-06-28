import { useState, useEffect } from "react";
import './index.css'
import QuizResult from "./components/QuizResult";
import { quiz22_1, quiz22_2, quiz22_3, quiz22_4 } from "./data/quizData";
import type { QuizItem } from "./data/quizData";
import ResultHistory from "./components/ResultHistory";
// import selectGif from './assets/cat.gif';

export default function App() {
    const [selected, setSelected] = useState<1 | 2 | 3 | 4 | 'result' | null>(null);
    const [shuffledItems, setShuffledItems] = useState<QuizItem[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode === 'true' ? true : false;
    });

    function shuffleArray(array: QuizItem[]): QuizItem[] {
        return array
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }

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
            {selected === null && (
                <div className="fixed top-32 left-1/2 -translate-x-1/2 z-50 text-4xl font-extrabold text-gray-800 dark:text-white">
                    단어 급수제
                </div>
            )}
            <button
                className="fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white z-50"
                onClick={() => setIsDarkMode(!isDarkMode)}
            >
                {isDarkMode ? '🌞' : '🌙'}
            </button>

            {selected === null ? (
                // 선택 화면
                <div className="flex flex-col items-center justify-center min-h-screen pt-20">
                    <div className="text-2xl font-bold mb-8 dark:text-white">시험 범위를 선택하세요.</div>
                    <div className="flex gap-8 flex-wrap justify-center mb-6">
                        <button
                            className="px-8 py-6 text-lg rounded-lg bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
                            onClick={() => { setSelected(1); setShuffledItems(shuffleArray(quiz22_1)); }}
                        >
                            1~20
                        </button>
                        <button
                            className="px-8 py-6 text-lg rounded-lg bg-green-500 text-white shadow-lg hover:bg-green-600 transition"
                            onClick={() => { setSelected(2); setShuffledItems(shuffleArray(quiz22_2)); }}
                        >
                            21~40
                        </button>
                        <button
                            className="px-8 py-6 text-lg rounded-lg bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 transition"
                            onClick={() => { setSelected(3); setShuffledItems(shuffleArray(quiz22_3)); }}
                        >
                            41~60
                        </button>
                        <button
                            className="px-8 py-6 text-lg rounded-lg bg-purple-500 text-white shadow-lg hover:bg-purple-600 transition"
                            onClick={() => { setSelected(4); setShuffledItems(shuffleArray(quiz22_4)); }}
                        >
                            61~80
                        </button>
                    </div>
                    <div>
                        <span
                            className="underline text-blue-600 dark:text-blue-300 cursor-pointer text-lg"
                            onClick={() => setSelected('result')}
                        >
                            결과확인
                        </span>
                    </div>
                </div>
            ) : selected === 'result' ? (
                <ResultHistory onGoMain={() => setSelected(null)} />
            ) : (
                // QuizResult로 이동
                <div className="pt-20">
                    <QuizResult items={shuffledItems} onGoMain={() => setSelected(null)} />
                </div>
            )}
        </div>
    );
}