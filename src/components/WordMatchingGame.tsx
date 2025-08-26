import { useState } from 'react';
import type { QuizItem } from '../data/quizData';

interface WordMatchingGameProps {
    items: QuizItem[];
    onGoMain: () => void;
}

export default function WordMatchingGame({ items, onGoMain }: WordMatchingGameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);


    const currentItem = items[currentIndex];

    const checkAnswer = () => {
        const correct = userAnswer.trim().toLowerCase() === currentItem.correctAnswer.toLowerCase();
        setIsCorrect(correct);
        if (correct) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserAnswer('');
            setIsCorrect(null);
        } else {
            setShowResult(true);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (isCorrect === null) {
                checkAnswer();
            } else {
                nextQuestion();
            }
        }
    };

    const resetGame = () => {
        setCurrentIndex(0);
        setUserAnswer('');
        setIsCorrect(null);
        setScore(0);
        setShowResult(false);
    };

    if (showResult) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4 dark:text-white">게임 완료!</h2>
                    <div className="text-2xl mb-4 dark:text-white">
                        점수: <span className="text-blue-600 dark:text-blue-400">{score}</span> / <span className="text-gray-600 dark:text-gray-400">{items.length}</span>
                    </div>
                    <div className="text-lg mb-6 dark:text-white">
                        정답률: <span className="text-green-600 dark:text-green-400">{Math.round((score / items.length) * 100)}%</span>
                    </div>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={resetGame}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        다시하기
                    </button>
                    <button
                        onClick={onGoMain}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        메인으로
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 dark:text-white">단어 맞추기 게임</h2>
                <div className="text-lg mb-4 dark:text-white">
                    {currentIndex + 1} / {items.length}
                </div>
                <div className="text-lg mb-4 dark:text-white">
                    점수: <span className="text-blue-600 dark:text-blue-400">{score}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg mb-6">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">문제</h3>
                    <p className="text-lg dark:text-white">{currentItem.korean}</p>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="정답을 입력하세요..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isCorrect !== null}
                    />
                </div>

                {isCorrect !== null && (
                    <div className={`text-center p-4 rounded-lg mb-4 ${
                        isCorrect 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                        <div className="text-lg font-semibold mb-2">
                            {isCorrect ? '정답입니다! 🎉' : '틀렸습니다 😢'}
                        </div>
                        {!isCorrect && (
                            <div className="text-sm">
                                정답: <span className="font-semibold">{currentItem.correctAnswer}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-center gap-4">
                    {isCorrect === null ? (
                        <button
                            onClick={checkAnswer}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            정답 확인
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            {currentIndex < items.length - 1 ? '다음 문제' : '결과 보기'}
                        </button>
                    )}
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={onGoMain}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                    메인으로 돌아가기
                </button>
            </div>
        </div>
    );
}
