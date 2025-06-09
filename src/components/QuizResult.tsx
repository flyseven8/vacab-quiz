import '../index.css'
import { useState, useEffect } from 'react';
import type { QuizItem } from '../data/quizData';
import Confetti from "react-confetti";

const QuizResult: React.FC<{ items: QuizItem[], onGoMain: () => void }> = ({ items, onGoMain }) => {
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [quizResults, setQuizResults] = useState<QuizItem[]>(items);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        setQuizResults(items);
        setAnswers({});
        setSubmitted(false);
    }, [items]);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleAnswerChange = (correctAnswer: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [correctAnswer]: value
        }));
    };

    const normalizeAnswer = (answer: string): string => {
        const normalized = answer.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
        console.log('정규화된 답변:', normalized);
        return normalized;
    };

    const handleSubmit = () => {
        const updatedResults = quizResults.map((item, index) => {
            const userAnswer = answers[item.correctAnswer] || '';
            const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(item.correctAnswer);
            return {
                ...item,
                userAnswer,
                isCorrect
            };
        });
        setQuizResults(updatedResults);
        setSubmitted(true);
    };

    useEffect(() => {
        if (submitted) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [submitted]);

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
        setQuizResults(items);
    };

    const handleRetryWrong = () => {
        const wrongItems = quizResults.filter(item => !item.isCorrect);
        setQuizResults(wrongItems);
        setAnswers({});
        setSubmitted(false);
    };

    const wrongCount = quizResults.length - quizResults.filter(item => item.isCorrect).length;
    const passOrFail = wrongCount >= 9 ? "탈락" : "통과";

    // 선택된 과 번호 추출
    const lessonNumber = items.length > 0 && items[0].correctAnswer === 'air' ? 23 : 24;

    const allCorrect = submitted && wrongCount === 0;

    return (
        <div className="p-4 w-full flex flex-col items-center">
            {allCorrect && (
                <>
                    <Confetti width={windowSize.width} height={windowSize.height} />
                    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
                        <h1 className="text-5xl font-bold text-blue-600 mb-8">100점! 축하합니다!</h1>
                        <a
                            href="#"
                            onClick={e => { e.preventDefault(); onGoMain(); }}
                            className="text-blue-500 underline text-2xl cursor-pointer"
                        >
                            처음으로
                        </a>
                    </div>
                </>
            )}
            <div className="w-full flex flex-col items-center mb-6">
                <div className="text-lg font-semibold mb-2">{lessonNumber}과 (총 {items.length}문제)</div>
                {submitted && (
                    <div className="text-lg">
                        <p className={`mt-3 font-bold ${passOrFail === "탈락" ? "text-red-600" : "text-blue-600"} text-3xl text-center`}>
                            {passOrFail}
                        </p>
                        <p className="mt-2 text-blue-600 text-lg font-semibold text-center">
                            총 {quizResults.length}문제 중 {wrongCount}문제 틀림
                        </p>
                        <div className="flex justify-center mt-4 gap-4">
                            <button
                                onClick={handleReset}
                                className="px-6 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                초기화
                            </button>
                            {wrongCount > 0 && (
                                <button
                                    onClick={handleRetryWrong}
                                    className="px-6 py-2 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                                >
                                    틀린 문제 다시 풀기
                                </button>
                            )}
                        </div>
                    </div>
                )}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onGoMain}
                        className="px-6 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        뒤로
                    </button>
                </div>
            </div>
            {(submitted
                ? quizResults.filter(item => !item.isCorrect)
                : quizResults
            ).map((item, index) => (
                <div
                    key={index}
                    className={`p-4 rounded-lg shadow mb-4 w-4/5 min-w-[20rem] ${
                        submitted && item.isCorrect ? "bg-green-100" : submitted ? "bg-red-100" : "bg-white"
                    }`}
                >
                    <div className="text-lg font-semibold">
                        <span className="mr-2 text-gray-500">{index + 1}.</span>
                        {submitted && (item.isCorrect ? "✔️" : "❌")} {item.korean}
                    </div>
                    <div className="text-sm text-gray-600">
                        {item.partOfSpeech} {item.meaning}
                    </div>
                    <div className="mt-2">
                        <div>
                            <span className="font-medium">Your answer:</span>{" "}
                            <input
                                type="text"
                                value={answers[item.correctAnswer] || ''}
                                onChange={(e) => handleAnswerChange(item.correctAnswer, e.target.value)}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="답을 입력하세요"
                                disabled={submitted}
                            />
                        </div>
                        {submitted && !item.isCorrect && (
                            <div className="mt-2">
                                <span className="font-medium">Correct answer:</span>{" "}
                                {item.correctAnswer}
                            </div>
                        )}
                    </div>
                </div>
            ))}
            <div className="flex justify-center gap-4 mt-6 w-4/5 min-w-[18rem]">
                <button
                    onClick={handleSubmit}
                    disabled={submitted}
                    className={`px-6 py-2 rounded-md text-white transition-colors ${
                        submitted 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                >
                    {submitted ? '제출 완료' : '제출하기'}
                </button>
            </div>
        </div>
    );
};

export default QuizResult;
