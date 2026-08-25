import { useEffect, useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, RotateCcw, Send, Speaker, X } from 'lucide-react';
import Confetti from 'react-confetti';
import type { QuizItem } from '../types/quizItem';
import { saveQuizResult } from '../services/quizResults';
import catGif from '../assets/cat.gif';

type Lesson = 1 | 2 | 3 | 'all';
type Grade = 18 | 19 | 20;

const lessonRanges: Record<Exclude<Lesson, 'all'>, string> = {
    1: '1-25',
    2: '26-50',
    3: '51-80',
};

const QuizResult: React.FC<{ items: QuizItem[]; grade: Grade; lesson: Lesson; onGoMain: () => void }> = ({ items, grade, lesson, onGoMain }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [submittedRetry, setSubmittedRetry] = useState(false);
    const [quizResults, setQuizResults] = useState<QuizItem[]>(items);
    const [saveError, setSaveError] = useState('');
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        setQuizResults(items);
        setAnswers({});
        setSubmitted(false);
        setSubmittedRetry(false);
        setSaveError('');
    }, [items]);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const normalizeAnswer = (answer: string) => answer.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');

    const handleSubmit = async () => {
        const updatedResults = quizResults.map((item) => {
            const userAnswer = answers[item.correctAnswer] || '';
            return { ...item, userAnswer, isCorrect: normalizeAnswer(userAnswer) === normalizeAnswer(item.correctAnswer) };
        });
        setQuizResults(updatedResults);
        setSubmitted(true);

        const correctCount = updatedResults.filter((item) => item.isCorrect).length;
        const wrongItems = updatedResults.filter((item) => !item.isCorrect);
        const result = {
            date: new Date().toLocaleString(),
            lesson: lesson === 'all' ? `${grade}급 · 전체` : `${grade}급 · ${lesson}단계`,
            correctCount,
            total: updatedResults.length,
            wrongList: wrongItems.map((item) => ({ korean: item.korean, correct: item.correctAnswer, user: item.userAnswer })),
            retry: submittedRetry,
        };

        try {
            setSaveError('');
            await saveQuizResult(result);
        } catch (error) {
            console.error('Supabase 퀴즈 결과 저장 실패:', error);
            setSaveError('결과를 저장하지 못했습니다. 잠시 후 다시 제출해 주세요.');
        }
    };

    useEffect(() => {
        if (submitted) window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [submitted]);

    const handleReset = () => {
        const hasWrongAnswers = submitted && quizResults.some((item) => item.isCorrect === false);

        if (hasWrongAnswers && !window.confirm('오답이 남아 있습니다. 처음부터 다시 풀까요?')) {
            return;
        }

        setAnswers({});
        setSubmitted(false);
        setQuizResults(items);
        setSubmittedRetry(false);
        setSaveError('');
    };

    const handleRetryWrong = () => {
        setQuizResults((current) => current.map((item) => item.isCorrect ? item : { ...item, userAnswer: '', isCorrect: undefined }));
        setAnswers(() => Object.fromEntries(quizResults.filter((item) => item.isCorrect).map((item) => [item.correctAnswer, item.userAnswer])));
        setSubmitted(false);
        setSubmittedRetry(true);
    };

    const speakUS = (word: string) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        const usVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang === 'en-US');
        if (usVoice) utterance.voice = usVoice;
        window.speechSynthesis.speak(utterance);
    };

    const correctCount = quizResults.filter((item) => item.isCorrect).length;
    const wrongCount = quizResults.length - correctCount;
    const passed = wrongCount < 9;
    const allCorrect = submitted && wrongCount === 0;
    const firstTryOneWrong = submitted && !submittedRetry && wrongCount === 1;
    const score = Math.round((correctCount / quizResults.length) * 100);
    const catEvent = submitted && (
        score === 100
            ? { title: '단어 마스터!', message: '왕관 쓴 고양이가 축하해요.', alt: '왕관 쓴 고양이', icon: '👑' }
            : score === 80
                ? { title: '아주 잘했어요!', message: '선글라스 고양이가 멋지다고 하네요.', alt: '선글라스 고양이', icon: '😎' }
                : score === 50
                    ? { title: '절반 성공!', message: '응원하는 고양이가 다음 도전을 응원해요.', alt: '응원하는 고양이', icon: '👏' }
                    : null
    );
    const lessonTitle = lesson === 'all' ? '전체 80개' : `${lesson}단계 · ${lessonRanges[lesson]}번`;

    return (
        <main className="min-h-screen bg-[#f6f7f2] text-[#171717] dark:bg-[#171917] dark:text-[#f4f5ef]">
            {allCorrect && (
                <Confetti
                    key={`perfect-${quizResults.length}-${submittedRetry}`}
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    run
                    numberOfPieces={900}
                    gravity={0.18}
                    initialVelocityY={18}
                    tweenDuration={7000}
                    style={{ zIndex: 100, pointerEvents: 'none' }}
                />
            )}

            <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f6f7f2]/95 backdrop-blur dark:border-white/10 dark:bg-[#171917]/95">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <button type="button" onClick={onGoMain} aria-label="처음으로" className="flex h-10 items-center gap-2 rounded-lg px-2 text-sm font-bold transition hover:bg-black/5 dark:hover:bg-white/10">
                        <ArrowLeft size={19} /> <span className="hidden sm:inline">처음으로</span>
                    </button>
                    <div className="text-center">
                        <p className="text-xs font-bold text-black/40 dark:text-white/40">{grade}급 단어 시험</p>
                        <p className="font-black">{lessonTitle}</p>
                    </div>
                    <div className="min-w-14 text-right text-sm font-bold">{quizResults.length}문제</div>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
                {submitted && (
                    <section className={`mb-7 grid gap-5 rounded-lg p-5 text-[#171717] sm:grid-cols-[1fr_auto] sm:items-center ${passed ? 'bg-[#b8ead6]' : 'bg-[#ffb7a8]'}`}>
                        <div>
                            <p className="text-xs font-black opacity-55">TEST RESULT</p>
                            <div className="mt-1 flex items-baseline gap-3">
                                <h1 className="text-4xl font-black">{passed ? '통과' : '재도전'}</h1>
                                <span className="font-bold">{correctCount} / {quizResults.length} 정답</span>
                            </div>
                            {saveError && <p className="mt-3 text-sm font-bold text-[#8b1f17]">{saveError}</p>}
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={handleReset} className="flex h-11 items-center gap-2 rounded-lg border border-black/20 bg-white/60 px-4 text-sm font-bold transition hover:bg-white">
                                <RotateCcw size={17} /> 다시 풀기
                            </button>
                            {wrongCount > 0 && (
                                <button type="button" onClick={handleRetryWrong} className="flex h-11 items-center gap-2 rounded-lg bg-[#171717] px-4 text-sm font-bold text-white transition hover:-translate-y-0.5">
                                    <CheckCircle2 size={17} /> 오답만
                                </button>
                            )}
                        </div>
                    </section>
                )}

                {firstTryOneWrong && (
                    <section className="mb-7 rounded-lg border-2 border-[#f0bd32] bg-[#fff4c7] p-6 text-center text-[#5f4300] shadow-[0_4px_0_#f0bd32] dark:bg-[#3b321b] dark:text-[#ffe89a]">
                        <p className="text-xs font-black tracking-[0.18em]">SPECIAL REWARD</p>
                        <p className="mt-2 text-2xl font-black">용돈 3,000원</p>
                        <p className="mt-2 text-sm font-bold">아빠에게 보여주세요!</p>
                    </section>
                )}

                {catEvent && (
                    <section className="mb-7 flex items-center justify-center gap-4 rounded-lg border border-black/10 bg-white p-4 shadow-[0_4px_0_#171717] dark:border-white/10 dark:bg-[#242724] dark:shadow-[0_4px_0_#f4f5ef]">
                        <div className="relative">
                            <img src={catGif} alt={catEvent.alt} className="h-20 w-20 rounded-full object-cover" />
                            <span className="absolute -right-2 -top-2 text-2xl" aria-hidden="true">{catEvent.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs font-black tracking-[0.18em] text-black/45 dark:text-white/45">CAT EVENT · {score}점</p>
                            <p className="mt-1 text-xl font-black">{catEvent.title}</p>
                            <p className="mt-1 text-sm font-bold text-black/55 dark:text-white/55">{catEvent.message}</p>
                        </div>
                    </section>
                )}

                <section className="overflow-hidden rounded-lg border border-black/15 bg-white dark:border-white/15 dark:bg-[#242724]">
                    {quizResults.map((item, index) => {
                        const isWrong = submitted && !item.isCorrect;
                        return (
                            <article key={`${item.correctAnswer}-${index}`} className={`grid gap-4 border-b border-black/10 p-5 last:border-0 dark:border-white/10 sm:grid-cols-[52px_1fr_280px] sm:items-center ${item.isCorrect ? 'bg-[#ecfaf4] dark:bg-[#1e352c]' : isWrong ? 'bg-[#fff1ed] dark:bg-[#40231f]' : ''}`}>
                                <div className={`grid h-10 w-10 place-items-center rounded-lg text-sm font-black ${item.isCorrect ? 'bg-[#b8ead6] text-[#173d31]' : isWrong ? 'bg-[#ffb7a8] text-[#5d2018]' : 'bg-[#eef0e9] text-black/45 dark:bg-white/10 dark:text-white/45'}`}>
                                    {item.isCorrect ? <Check size={18} /> : isWrong ? <X size={18} /> : index + 1}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-black">{item.korean}</h2>
                                        {submitted && (
                                            <button type="button" onClick={() => speakUS(item.correctAnswer)} className="grid h-8 w-8 place-items-center rounded-lg text-black/45 transition hover:bg-black/5 hover:text-black dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white" title="발음 듣기">
                                                <Speaker size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm leading-6 text-black/50 dark:text-white/50"><span className="font-bold">{item.partOfSpeech}</span> {item.meaning}</p>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={answers[item.correctAnswer] || ''}
                                        onChange={(event) => setAnswers((current) => ({ ...current, [item.correctAnswer]: event.target.value }))}
                                        disabled={item.isCorrect}
                                        placeholder="영어 단어 입력"
                                        className={`h-12 w-full rounded-lg border bg-[#f8f9f5] px-4 font-bold text-[#171717] outline-none transition placeholder:font-medium placeholder:text-black/30 disabled:cursor-not-allowed dark:bg-[#171917] dark:text-white dark:placeholder:text-white/25 ${isWrong ? 'border-[#dc6d5d]' : 'border-black/15 focus:border-black dark:border-white/15 dark:focus:border-white'}`}
                                    />
                                    {isWrong && <p className="mt-2 text-sm font-bold text-[#b74637] dark:text-[#ff9f91]">정답: {item.correctAnswer}</p>}
                                </div>
                            </article>
                        );
                    })}
                </section>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitted}
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#171717] px-6 font-black text-white shadow-[0_4px_0_#b8ead6] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#f4f5ef] dark:text-[#171717] sm:w-auto sm:min-w-40"
                    >
                        <Send size={19} /> {submitted ? '제출 완료' : '답안 제출'}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default QuizResult;
