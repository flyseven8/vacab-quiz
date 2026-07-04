import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, History, Keyboard, Moon, Sparkles, Sun } from 'lucide-react';
import './index.css';
import QuizResult from './components/QuizResult';
import SpellingTypingGame from './components/SpellingTypingGame';
import type { QuizItem } from './types/quizItem';
import ResultHistory from './components/ResultHistory';
import { fetchQuizItems, splitQuizItems } from './services/quizWords';

type Grade = 18 | 19 | 20;
type Lesson = 1 | 2 | 3;
type Selection = Lesson | 'all' | 'result' | null;

const gradeMeta: Record<Grade, { title: string; description: string; lessonLabels: Record<Lesson, string> }> = {
    18: {
        title: '18급 단어 퀴즈',
        description: '자연, 채소, 운동, 생활 단어를 25개, 25개, 30개로 나눠 집중하거나 전체 80개를 한 번에 도전하세요.',
        lessonLabels: {
            1: '자연·채소·운동',
            2: '경기·감정·상상',
            3: '여행·생활·학습',
        },
    },
    19: {
        title: '19급 단어 퀴즈',
        description: '교통, 동물, 생활 단어를 25개, 25개, 30개로 나눠 집중하거나 전체 80개를 한 번에 도전하세요.',
        lessonLabels: {
            1: '교통·동물·생활',
            2: '장소·움직임·사물',
            3: '모험·활동·상태',
        },
    },
    20: {
        title: '20급 단어 퀴즈',
        description: '음식, 날씨, 가족, 생활 단어를 25개, 25개, 30개로 나눠 집중하거나 전체 80개를 한 번에 도전하세요.',
        lessonLabels: {
            1: '음식·날씨·가족',
            2: '생활·장소·행동',
            3: '상태·인물·사물',
        },
    },
};

const lessonMeta = [
    { id: 1 as Lesson, range: '1-25', count: 25, accent: 'bg-[#b8ead6]' },
    { id: 2 as Lesson, range: '26-50', count: 25, accent: 'bg-[#f8df74]' },
    { id: 3 as Lesson, range: '51-80', count: 30, accent: 'bg-[#ffb7a8]' },
];

export default function App() {
    const [selected, setSelected] = useState<Selection>(null);
    const [selectedGrade, setSelectedGrade] = useState<Grade>(19);
    const [gameMode, setGameMode] = useState<'quiz' | 'spelling-typing' | null>(null);
    const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
    const [isLoadingWords, setIsLoadingWords] = useState(true);
    const [wordLoadNotice, setWordLoadNotice] = useState('');
    const [shuffledItems, setShuffledItems] = useState<QuizItem[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const quizSets = useMemo(() => splitQuizItems(quizItems), [quizItems]);
    const currentGradeMeta = gradeMeta[selectedGrade];
    const areWordsReady = !isLoadingWords && quizItems.length === 80;
    const setsByLesson: Record<Lesson, QuizItem[]> = {
        1: quizSets.first,
        2: quizSets.second,
        3: quizSets.third,
    };

    const shuffleArray = (array: QuizItem[]) => [...array].sort(() => Math.random() - 0.5);

    const startQuiz = (lesson: Lesson | 'all', mode: 'quiz' | 'spelling-typing') => {
        const items = lesson === 'all' ? quizItems : setsByLesson[lesson];
        window.scrollTo({ top: 0 });
        setSelected(lesson);
        setGameMode(mode === 'quiz' ? null : mode);
        setShuffledItems(shuffleArray(items));
    };

    const goMain = () => {
        window.scrollTo({ top: 0 });
        setSelected(null);
        setGameMode(null);
    };

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        let isMounted = true;
        setIsLoadingWords(true);
        setQuizItems([]);
        setWordLoadNotice('');

        fetchQuizItems(selectedGrade)
            .then((items) => {
                if (!isMounted) return;
                setQuizItems(items);
                setWordLoadNotice('');
            })
            .catch((error) => {
                if (!isMounted) return;
                console.error('Supabase 단어 로드 실패:', error);
                setQuizItems([]);
                setWordLoadNotice('단어를 불러오지 못했습니다. 네트워크 연결을 확인한 뒤 새로고침해 주세요.');
            })
            .finally(() => {
                if (isMounted) setIsLoadingWords(false);
            });
        return () => { isMounted = false; };
    }, [selectedGrade]);

    if (selected === 'result') {
        return <ResultHistory onGoMain={goMain} />;
    }

    if (selected !== null) {
        return gameMode === 'spelling-typing'
            ? <SpellingTypingGame items={shuffledItems} onGoMain={goMain} />
            : <QuizResult items={shuffledItems} grade={selectedGrade} lesson={selected} onGoMain={goMain} />;
    }

    return (
        <main className="min-h-screen bg-[#f6f7f2] text-[#171717] dark:bg-[#171917] dark:text-[#f4f5ef]">
            <header className="border-b border-black/10 dark:border-white/10">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#171717] text-white dark:bg-[#f4f5ef] dark:text-[#171717]">
                            <BookOpen size={21} strokeWidth={2.2} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-black/45 dark:text-white/45">Vocabulary Lab</p>
                            <p className="font-bold">{currentGradeMeta.title}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsDarkMode((value) => !value)}
                        className="grid h-10 w-10 place-items-center rounded-lg border border-black/15 bg-white transition hover:-translate-y-0.5 hover:border-black dark:border-white/15 dark:bg-[#242724]"
                        title={isDarkMode ? '라이트 모드' : '다크 모드'}
                        aria-label={isDarkMode ? '라이트 모드' : '다크 모드'}
                    >
                        {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
                <section className="mb-10 grid gap-7 lg:grid-cols-[1fr_320px] lg:items-end">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#b8ead6] px-3 py-1.5 text-xs font-bold text-[#173d31]">
                            <Sparkles size={14} /> {selectedGrade}급 80 WORDS
                        </div>
                        <h1 className="max-w-3xl text-4xl font-black leading-[1.08] sm:text-6xl">
                            오늘의 단어를<br />내 것으로 만드는 시간
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-7 text-black/55 dark:text-white/55">
                            {currentGradeMeta.description}
                        </p>
                        <div className="mt-6 inline-flex rounded-lg border border-black/15 bg-white p-1 dark:border-white/15 dark:bg-[#242724]">
                            {([18, 19, 20] as Grade[]).map((grade) => (
                                <button
                                    key={grade}
                                    type="button"
                                    onClick={() => setSelectedGrade(grade)}
                                    className={`h-10 rounded-md px-5 text-sm font-black transition ${selectedGrade === grade ? 'bg-[#171717] text-white dark:bg-[#f4f5ef] dark:text-[#171717]' : 'text-black/45 hover:text-black dark:text-white/45 dark:hover:text-white'}`}
                                >
                                    {grade}급
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelected('result')}
                        className="flex min-h-24 items-center justify-between rounded-lg border border-black/15 bg-white p-5 text-left shadow-[0_4px_0_#171717] transition hover:-translate-y-1 dark:border-white/15 dark:bg-[#242724] dark:shadow-[0_4px_0_#f4f5ef]"
                    >
                        <span>
                            <span className="mb-1 block text-xs font-bold text-black/40 dark:text-white/40">MY RECORD</span>
                            <span className="text-lg font-bold">학습 결과 보기</span>
                        </span>
                        <History size={24} />
                    </button>
                </section>

                {wordLoadNotice && (
                    <div className="mb-6 rounded-lg border border-[#d6aa16] bg-[#fff2bd] px-4 py-3 text-sm font-medium text-[#5f4b00]">
                        {wordLoadNotice}
                    </div>
                )}

                <section className="overflow-hidden rounded-lg border border-black/15 bg-white dark:border-white/15 dark:bg-[#242724]">
                    <div className="grid grid-cols-[64px_1fr_auto] items-center border-b border-black/10 px-4 py-3 text-xs font-bold text-black/40 dark:border-white/10 dark:text-white/40 sm:grid-cols-[90px_1fr_270px] sm:px-6">
                        <span>SET</span><span>RANGE</span><span className="hidden sm:block">MODE</span>
                    </div>
                    {lessonMeta.map((lesson) => (
                        <div key={lesson.id} className="grid grid-cols-[64px_1fr] gap-3 border-b border-black/10 px-4 py-5 last:border-0 dark:border-white/10 sm:grid-cols-[90px_1fr_270px] sm:items-center sm:px-6">
                            <div className={`grid h-11 w-11 place-items-center rounded-lg text-lg font-black ${lesson.accent} text-[#171717]`}>
                                {lesson.id}
                            </div>
                            <button
                                type="button"
                                disabled={!areWordsReady}
                                onClick={() => startQuiz(lesson.id, 'quiz')}
                                className="min-w-0 rounded-lg py-1 text-left transition hover:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-white"
                                aria-label={`${currentGradeMeta.lessonLabels[lesson.id]} ${lesson.range}번 퀴즈 시작`}
                            >
                                <p className="font-bold">{currentGradeMeta.lessonLabels[lesson.id]}</p>
                                <p className="mt-1 text-sm text-black/45 dark:text-white/45">{lesson.range}번 · {lesson.count}개 단어</p>
                            </button>
                            <div className="col-span-2 flex gap-2 sm:col-span-1">
                                <button
                                    type="button"
                                    disabled={!areWordsReady}
                                    onClick={() => startQuiz(lesson.id, 'quiz')}
                                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-40 dark:bg-[#f4f5ef] dark:text-[#171717]"
                                >
                                    퀴즈 <ArrowRight size={16} />
                                </button>
                                <button
                                    type="button"
                                    disabled={!areWordsReady}
                                    onClick={() => startQuiz(lesson.id, 'spelling-typing')}
                                    className="grid h-11 w-11 place-items-center rounded-lg border border-black/15 bg-[#f6f7f2] transition hover:-translate-y-0.5 hover:border-black disabled:opacity-40 dark:border-white/15 dark:bg-[#171917] dark:hover:border-white"
                                    title="타자 게임"
                                    aria-label={`${selectedGrade}급 ${lesson.id}단계 타자 게임`}
                                >
                                    <Keyboard size={19} />
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        disabled={!areWordsReady}
                        onClick={() => startQuiz('all', 'quiz')}
                        className="flex min-h-24 items-center justify-between rounded-lg bg-[#ffb7a8] p-5 text-left text-[#171717] transition hover:-translate-y-1 disabled:opacity-40"
                    >
                        <span><span className="block text-xs font-bold opacity-55">FULL TEST</span><span className="mt-1 block text-xl font-black">전체 80개 퀴즈</span></span>
                        <ArrowRight size={25} />
                    </button>
                    <button
                        type="button"
                        disabled={!areWordsReady}
                        onClick={() => startQuiz('all', 'spelling-typing')}
                        className="flex min-h-24 items-center justify-between rounded-lg bg-[#b8ead6] p-5 text-left text-[#171717] transition hover:-translate-y-1 disabled:opacity-40"
                    >
                        <span><span className="block text-xs font-bold opacity-55">SPEED MODE</span><span className="mt-1 block text-xl font-black">전체 타자 게임</span></span>
                        <Keyboard size={25} />
                    </button>
                </section>
            </div>
        </main>
    );
}
