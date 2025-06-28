import '../index.css'
import { useState, useEffect } from 'react';
import type { QuizItem } from '../data/quizData';
import Confetti from "react-confetti";

const QuizResult: React.FC<{ items: QuizItem[], onGoMain: () => void }> = ({ items, onGoMain }) => {
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [submittedRetry, setSubmittedRetry] = useState(false);
    const [quizResults, setQuizResults] = useState<QuizItem[]>(items);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        setQuizResults(items);
        setAnswers({});
        setSubmitted(false);
        setSubmittedRetry(false);
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
        const updatedResults = quizResults.map((item) => {
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

        // 시험 결과 localStorage 저장
        const correctCount = updatedResults.filter(item => item.isCorrect).length;
        const wrongItems = updatedResults.filter(item => !item.isCorrect);
        const now = new Date();
        const range = `${items[0]?.korean} ~ ${items[items.length-1]?.korean}`;
        const result = {
            date: now.toLocaleString(),
            range,
            correctCount,
            total: updatedResults.length,
            wrongList: wrongItems.map(item => ({ korean: item.korean, correct: item.correctAnswer, user: item.userAnswer })),
            retry: submittedRetry
        };
        const prev = JSON.parse(localStorage.getItem('quizResultsHistory') || '[]');
        localStorage.setItem('quizResultsHistory', JSON.stringify([result, ...prev]));
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
        setSubmittedRetry(false);
    };

    const handleRetryWrong = () => {
        const newQuizResults = quizResults.map(item => {
            if (item.isCorrect) return item;
            return { ...item, userAnswer: '', isCorrect: undefined };
        });
        setQuizResults(newQuizResults);
        setAnswers(() => {
            const newAnswers: { [key: string]: string } = {};
            quizResults.forEach(item => {
                if (item.isCorrect) {
                    newAnswers[item.correctAnswer] = item.userAnswer;
                }
            });
            return newAnswers;
        });
        setSubmitted(false);
        setSubmittedRetry(true);
    };

    const wrongCount = quizResults.length - quizResults.filter(item => item.isCorrect).length;
    const passOrFail = wrongCount >= 9 ? "탈락" : "통과";

    // 선택된 과 번호 추출
    const lessonNumber = items.length > 0 && items[0].correctAnswer === 'air' ? 23 : 24;

    const allCorrect = submitted && wrongCount === 0;

    // 미국식 발음 재생 함수
    const speakUS = (word: string) => {
        const utter = new window.SpeechSynthesisUtterance(word);
        utter.lang = 'en-US';
        // 미국식 음성 우선 선택
        const voices = window.speechSynthesis.getVoices();
        const usVoice = voices.find(v => v.lang === 'en-US');
        if (usVoice) utter.voice = usVoice;
        window.speechSynthesis.speak(utter);
    };

    return (
        <div className="p-4 w-full flex flex-col items-center dark:bg-gray-900 dark:text-white">
            {allCorrect && (
                <>
                    <Confetti width={windowSize.width} height={windowSize.height} />
                    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
                        <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-8">100점! 축하합니다!</h1>
                        <a
                            href="#"
                            onClick={e => { e.preventDefault(); onGoMain(); }}
                            className="text-blue-500 dark:text-blue-400 underline text-2xl cursor-pointer"
                        >
                            처음으로
                        </a>
                    </div>
                </>
            )}
            <div className="w-full flex flex-col items-center mb-6">
                <div className="w-4/5 min-w-[20rem] flex items-center mb-2">
                    <button
                        onClick={onGoMain}
                        className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors mr-4"
                        aria-label="뒤로 가기"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div className="text-lg font-semibold">
                        {lessonNumber}과 ({items.length > 0 ? `${1}~${items.length}번` : ''})
                    </div>
                </div>
                {submitted && (
                    <div className="text-lg">
                        <p className={`mt-3 font-bold ${passOrFail === "탈락" ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"} text-3xl text-center`}>
                            {passOrFail}
                        </p>
                        <p className="mt-2 text-blue-600 dark:text-blue-400 text-lg font-semibold text-center">
                            총 {quizResults.length}문제 중 {wrongCount}문제 틀림
                        </p>
                        <div className="flex justify-center mt-4 gap-4">
                            <button
                                onClick={handleReset}
                                className="px-6 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
                            >
                                초기화
                            </button>
                            {wrongCount > 0 && (
                                <button
                                    onClick={handleRetryWrong}
                                    className="px-6 py-2 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
                                >
                                    틀린 문제 다시 풀기
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {(quizResults).map((item, index) => (
                <div
                    key={index}
                    className={`p-4 rounded-lg shadow mb-4 w-4/5 min-w-[20rem] ${
                        item.isCorrect
                            ? "bg-green-100 dark:bg-green-900"
                            : submitted
                                ? "bg-red-100 dark:bg-red-900"
                                : "bg-white dark:bg-gray-800"
                    }`}
                >
                    <div className="text-lg font-semibold">
                        <span className="mr-2 text-gray-500 dark:text-gray-400">{index + 1}.</span>
                        {item.isCorrect ? "✔️" : (submitted ? "❌" : "")} {item.korean}
                        {submitted && (
                            <button
                                onClick={() => speakUS(item.correctAnswer)}
                                className="ml-2 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                                title="미국식 발음 듣기"
                                type="button"
                            >
                                🔊
                            </button>
                        )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        {item.partOfSpeech} {item.meaning}
                    </div>
                    <div className="mt-2">
                        <div>
                            <span className="font-medium">Your answer:</span>{" "}
                            <input
                                type="text"
                                value={answers[item.correctAnswer] || ''}
                                onChange={(e) => handleAnswerChange(item.correctAnswer, e.target.value)}
                                className="mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="답을 입력하세요"
                                disabled={item.isCorrect}
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
                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
                    }`}
                >
                    {submitted ? '제출 완료' : '제출하기'}
                </button>
            </div>
        </div>
    );
};

export default QuizResult;
