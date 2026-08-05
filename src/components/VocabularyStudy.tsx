import { ArrowLeft, Play, Volume2 } from 'lucide-react';
import type { QuizItem } from '../types/quizItem';

type Grade = 18 | 19 | 20;
type Lesson = 1 | 2 | 3 | 'all';

const lessonRanges: Record<Exclude<Lesson, 'all'>, string> = {
    1: '1-25',
    2: '26-50',
    3: '51-80',
};

const getLessonTitle = (lesson: Lesson) => lesson === 'all' ? '전체 80개' : `${lesson}단계 · ${lessonRanges[lesson]}번`;

const speakUS = (word: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    const usVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang === 'en-US');
    if (usVoice) utterance.voice = usVoice;
    window.speechSynthesis.speak(utterance);
};

const VocabularyStudy: React.FC<{
    items: QuizItem[];
    grade: Grade;
    lesson: Lesson;
    onGoMain: () => void;
    onStartQuiz: () => void;
}> = ({ items, grade, lesson, onGoMain, onStartQuiz }) => {
    const startNumber = lesson === 'all' ? 1 : lesson === 1 ? 1 : lesson === 2 ? 26 : 51;

    return (
        <main className="min-h-screen bg-[#f6f7f2] text-[#171717] dark:bg-[#171917] dark:text-[#f4f5ef]">
            <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f6f7f2]/95 backdrop-blur dark:border-white/10 dark:bg-[#171917]/95">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <button type="button" onClick={onGoMain} aria-label="처음으로" className="flex h-10 items-center gap-2 rounded-lg px-2 text-sm font-bold transition hover:bg-black/5 dark:hover:bg-white/10">
                        <ArrowLeft size={19} /> <span className="hidden sm:inline">처음으로</span>
                    </button>
                    <div className="text-center">
                        <p className="text-xs font-bold text-black/40 dark:text-white/40">{grade}급 단어 학습</p>
                        <p className="font-black">{getLessonTitle(lesson)}</p>
                    </div>
                    <div className="min-w-14 text-right text-sm font-bold">{items.length}개</div>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
                <section className="mb-6 grid gap-4 rounded-lg bg-[#b8ead6] p-5 text-[#171717] sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                        <p className="text-xs font-black opacity-55">STUDY MODE</p>
                        <h1 className="mt-1 text-3xl font-black">단어와 뜻을 먼저 익히기</h1>
                        <p className="mt-2 text-sm font-bold opacity-65">영어 단어, 한국어 뜻, 영어 정의를 함께 보고 발음을 들을 수 있습니다.</p>
                    </div>
                    <button type="button" onClick={onStartQuiz} className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#171717] px-5 text-sm font-black text-white transition hover:-translate-y-0.5">
                        <Play size={17} fill="currentColor" /> 퀴즈 시작
                    </button>
                </section>

                <section className="grid gap-3">
                    {items.map((item, index) => (
                        <article key={`${item.correctAnswer}-${index}`} className="grid gap-4 rounded-lg border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-[#242724] sm:grid-cols-[56px_1fr_auto] sm:items-center">
                            <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#eef0e9] text-sm font-black text-black/45 dark:bg-white/10 dark:text-white/45">
                                {startNumber + index}
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-2xl font-black">{item.correctAnswer}</h2>
                                    <span className="rounded-full bg-[#f8df74] px-2.5 py-1 text-xs font-black text-[#5f4b00]">{item.partOfSpeech}</span>
                                    <span className="text-lg font-black text-black/55 dark:text-white/55">{item.korean}</span>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/50">{item.meaning}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => speakUS(item.correctAnswer)}
                                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-black/15 px-4 text-sm font-black transition hover:-translate-y-0.5 hover:border-black dark:border-white/15 dark:hover:border-white"
                                title="발음 듣기"
                            >
                                <Volume2 size={18} /> 듣기
                            </button>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
};

export default VocabularyStudy;
