import { useState, useEffect } from "react";
import './index.css'
import QuizResult from "./components/QuizResult";
import SpellingTypingGame from "./components/SpellingTypingGame";
import { quiz22_1, quiz22_2, quiz22_3, quiz22_4, quizResults22 } from "./data/quizData";
import type { QuizItem } from "./data/quizData";
import ResultHistory from "./components/ResultHistory";
import { cleanExpiredQuizResults } from "./utils/localStorage";
// import selectGif from './assets/cat.gif';

export default function App() {
    const [selected, setSelected] = useState<1 | 2 | 3 | 4 | 'all' | 'result' | null>(null);
    const [gameMode, setGameMode] = useState<'quiz' | 'spelling-typing' | null>(null);
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

    // 앱 시작시 만료된 퀴즈 결과 정리
    useEffect(() => {
        cleanExpiredQuizResults();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 transition-colors relative">
            {selected === null && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-3xl font-bold text-white">
                    19과
                </div>
            )}
            <button
                className="fixed top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white z-50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                onClick={() => setIsDarkMode(!isDarkMode)}
            >
                {isDarkMode ? '🌞' : '🌙'}
            </button>

            {selected === null ? (
                // 선택 화면
                <div className="flex flex-col min-h-screen pt-20 px-4">
                    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2">
                                                                 <button
                                     className="w-full h-24 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                                     onClick={() => { setSelected(1); setShuffledItems(shuffleArray(quiz22_1)); }}
                                 >
                                     <span className="text-lg">1과</span>
                                     <span className="text-xs opacity-80">(1~20)</span>
                                 </button>
                                                                 <button
                                     className="w-full h-12 text-sm rounded-xl bg-white/15 backdrop-blur-sm text-white shadow-md hover:bg-white/25 transition-all duration-200 transform hover:scale-102 flex items-center justify-center font-medium border border-white/15"
                                     onClick={() => { setSelected(1); setGameMode('spelling-typing'); setShuffledItems(shuffleArray(quiz22_1)); }}
                                 >
                                     타자 게임
                                 </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                                                 <button
                                     className="w-full h-24 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                                     onClick={() => { setSelected(2); setShuffledItems(shuffleArray(quiz22_2)); }}
                                 >
                                     <span className="text-lg">2과</span>
                                     <span className="text-xs opacity-80">(21~40)</span>
                                 </button>
                                                                 <button
                                     className="w-full h-12 text-sm rounded-xl bg-white/15 backdrop-blur-sm text-white shadow-md hover:bg-white/25 transition-all duration-200 transform hover:scale-102 flex items-center justify-center font-medium border border-white/15"
                                     onClick={() => { setSelected(2); setGameMode('spelling-typing'); setShuffledItems(shuffleArray(quiz22_2)); }}
                                 >
                                     타자 게임
                                 </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                                                 <button
                                     className="w-full h-24 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                                     onClick={() => { setSelected(3); setShuffledItems(shuffleArray(quiz22_3)); }}
                                 >
                                     <span className="text-lg">3과</span>
                                     <span className="text-xs opacity-80">(41~60)</span>
                                 </button>
                                                                 <button
                                     className="w-full h-12 text-sm rounded-xl bg-white/15 backdrop-blur-sm text-white shadow-md hover:bg-white/25 transition-all duration-200 transform hover:scale-102 flex items-center justify-center font-medium border border-white/15"
                                     onClick={() => { setSelected(3); setGameMode('spelling-typing'); setShuffledItems(shuffleArray(quiz22_3)); }}
                                 >
                                     타자 게임
                                 </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                                                 <button
                                     className="w-full h-24 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                                     onClick={() => { setSelected(4); setShuffledItems(shuffleArray(quiz22_4)); }}
                                 >
                                     <span className="text-lg">4과</span>
                                     <span className="text-xs opacity-80">(61~80)</span>
                                 </button>
                                                                 <button
                                     className="w-full h-12 text-sm rounded-xl bg-white/15 backdrop-blur-sm text-white shadow-md hover:bg-white/25 transition-all duration-200 transform hover:scale-102 flex items-center justify-center font-medium border border-white/15"
                                     onClick={() => { setSelected(4); setGameMode('spelling-typing'); setShuffledItems(shuffleArray(quiz22_4)); }}
                                 >
                                     타자 게임
                                 </button>
                            </div>
                        </div>
                        <button
                            className="px-6 py-5 text-lg rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 w-full flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                            onClick={() => { setSelected('all'); setShuffledItems(shuffleArray(quizResults22)); }}
                        >
                            <span>전체</span>
                            <span className="text-sm opacity-80">(1~80)</span>
                        </button>
                        <button
                            className="px-6 py-5 text-lg rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 w-full flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                            onClick={() => { setSelected('all'); setGameMode('spelling-typing'); setShuffledItems(shuffleArray(quizResults22)); }}
                        >
                            <span>타자 게임</span>
                            <span className="text-sm opacity-80">(1~80)</span>
                        </button>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <button
                            className="px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 font-medium border border-white/20"
                            onClick={() => setSelected('result')}
                        >
                            결과확인
                        </button>
                    </div>
                </div>
            ) : selected === 'result' ? (
                <ResultHistory onGoMain={() => setSelected(null)} />
            ) : gameMode === 'spelling-typing' ? (
                // SpellingTypingGame으로 이동
                <div className="pt-20">
                    <SpellingTypingGame items={shuffledItems} onGoMain={() => { setSelected(null); setGameMode(null); }} />
                </div>
            ) : (
                // QuizResult로 이동
                <div className="pt-20">
                    <QuizResult items={shuffledItems} lesson={selected as 1 | 2 | 3 | 4 | 'all'} onGoMain={() => setSelected(null)} />
                </div>
            )}
        </div>
    );
}
