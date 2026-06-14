import { useState, useEffect, useMemo } from "react";
import './index.css'
import QuizResult from "./components/QuizResult";
import SpellingTypingGame from "./components/SpellingTypingGame";
import type { QuizItem } from "./data/quizData";
import ResultHistory from "./components/ResultHistory";
import { FALLBACK_QUIZ_ITEMS, fetchQuizItems, splitQuizItems } from "./services/quizWords";
// import selectGif from './assets/cat.gif';

export default function App() {
    const [selected, setSelected] = useState<1 | 2 | 3 | 4 | 'all' | 'result' | null>(null);
    const [gameMode, setGameMode] = useState<'quiz' | 'spelling-typing' | null>(null);
    const [quizItems, setQuizItems] = useState<QuizItem[]>(FALLBACK_QUIZ_ITEMS);
    const [isLoadingWords, setIsLoadingWords] = useState(true);
    const [wordLoadNotice, setWordLoadNotice] = useState('');
    const [shuffledItems, setShuffledItems] = useState<QuizItem[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode === 'true' ? true : false;
    });

    const quizSets = useMemo(() => splitQuizItems(quizItems), [quizItems]);

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

    useEffect(() => {
        let isMounted = true;

        fetchQuizItems()
            .then((items) => {
                if (!isMounted) return;
                setQuizItems(items);
                setWordLoadNotice('');
            })
            .catch((error) => {
                if (!isMounted) return;
                console.error('Supabase 단어 로드 실패:', error);
                setQuizItems(FALLBACK_QUIZ_ITEMS);
                setWordLoadNotice('단어를 불러오지 못해 내장 단어로 실행 중입니다.');
            })
            .finally(() => {
                if (!isMounted) return;
                setIsLoadingWords(false);
            });

        return () => {
            isMounted = false;
        };
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
                    {wordLoadNotice && (
                        <div className="mb-4 mx-auto max-w-4xl w-full rounded-lg bg-yellow-100 px-4 py-3 text-sm text-yellow-900 shadow">
                            {wordLoadNotice}
                        </div>
                    )}
                    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2">
                                                                 <button
                                     className="w-full h-24 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                                     disabled={isLoadingWords}
                                     onClick={() => { setSelected(1); setGameMode(null); setShuffledItems(shuffleArray(quizSets.first)); }}
                                 >
                                     <span className="text-lg">1과</span>
                                     <span className="text-xs opacity-80">(1~20)</span>
                                 </button>
                                                                 <button
                                     className="w-full h-12 text-sm rounded-xl bg-white/15 backdrop-blur-sm text-white shadow-md hover:bg-white/25 transition-all duration-200 transform hover:scale-102 flex items-center justify-center font-medium border border-white/15"
                                     disabled={isLoadingWords}
                                     onClick={() => { setSelected(1); setGameMode('spelling-typing'); setShuffledItems(shuffleArray(quizSets.first)); }}
                                 >
                                     타자 게임
                                 </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                                                 <button
                                     className="w-full h-24 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                                     disabled={isLoadingWords}
                                     onClick={() => { setSelected(2); setGameMode(null); setShuffledItems(shuffleArray(quizSets.second)); }}
                                 >
                                     <span className="text-lg">2과</span>
                                     <span className="text-xs opacity-80">(21~40)</span>
                                 </button>
                                                                 <button
                                     className="w-full h-12 text-sm rounded-xl bg-white/15 backdrop-blur-sm text-white shadow-md hover:bg-white/25 transition-all duration-200 transform hover:scale-102 flex items-center justify-center font-medium border border-white/15"
                                     disabled={isLoadingWords}
                                     onClick={() => { setSelected(2); setGameMode('spelling-typing'); setShuffledItems(shuffleArray(quizSets.second)); }}
                                 >
                                     타자 게임
                                 </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                                                 <button
                                     className="w-full h-24 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                                     disabled={isLoadingWords}
                                     onClick={() => { setSelected(3); setGameMode(null); setShuffledItems(shuffleArray(quizSets.third)); }}
                                 >
                                     <span className="text-lg">3과</span>
                                     <span className="text-xs opacity-80">(41~60)</span>
                                 </button>
                                                                 <button
                                     className="w-full h-12 text-sm rounded-xl bg-white/15 backdrop-blur-sm text-white shadow-md hover:bg-white/25 transition-all duration-200 transform hover:scale-102 flex items-center justify-center font-medium border border-white/15"
                                     disabled={isLoadingWords}
                                     onClick={() => { setSelected(3); setGameMode('spelling-typing'); setShuffledItems(shuffleArray(quizSets.third)); }}
                                 >
                                     타자 게임
                                 </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                                                 <button
                                     className="w-full h-24 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                                     disabled={isLoadingWords}
                                     onClick={() => { setSelected(4); setGameMode(null); setShuffledItems(shuffleArray(quizSets.fourth)); }}
                                 >
                                     <span className="text-lg">4과</span>
                                     <span className="text-xs opacity-80">(61~80)</span>
                                 </button>
                                                                 <button
                                     className="w-full h-12 text-sm rounded-xl bg-white/15 backdrop-blur-sm text-white shadow-md hover:bg-white/25 transition-all duration-200 transform hover:scale-102 flex items-center justify-center font-medium border border-white/15"
                                     disabled={isLoadingWords}
                                     onClick={() => { setSelected(4); setGameMode('spelling-typing'); setShuffledItems(shuffleArray(quizSets.fourth)); }}
                                 >
                                     타자 게임
                                 </button>
                            </div>
                        </div>
                        <button
                            className="px-6 py-5 text-lg rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 w-full flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                            disabled={isLoadingWords}
                            onClick={() => { setSelected('all'); setGameMode(null); setShuffledItems(shuffleArray(quizItems)); }}
                        >
                            <span>전체</span>
                            <span className="text-sm opacity-80">{isLoadingWords ? '불러오는 중' : '(1~80)'}</span>
                        </button>
                        <button
                            className="px-6 py-5 text-lg rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 w-full flex flex-col items-center justify-center leading-tight font-semibold border border-white/20"
                            disabled={isLoadingWords}
                            onClick={() => { setSelected('all'); setGameMode('spelling-typing'); setShuffledItems(shuffleArray(quizItems)); }}
                        >
                            <span>타자 게임</span>
                            <span className="text-sm opacity-80">{isLoadingWords ? '불러오는 중' : '(1~80)'}</span>
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
