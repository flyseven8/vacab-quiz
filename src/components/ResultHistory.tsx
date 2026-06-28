import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock3, History, LoaderCircle, Trash2, XCircle } from 'lucide-react';
import type { QuizResultHistory } from '../types/quizResult';
import { deleteQuizResult, getQuizResults } from '../services/quizResults';

const EXPIRED_RESULT_MS = 7 * 24 * 60 * 60 * 1000;

const formatGroupDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
    }).format(date);
};

const getGroupKey = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const ResultHistory: React.FC<{ onGoMain: () => void }> = ({ onGoMain }) => {
    const [history, setHistory] = useState<QuizResultHistory[]>([]);
    const [loadError, setLoadError] = useState('');
    const [actionError, setActionError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        getQuizResults()
            .then(setHistory)
            .catch((error) => {
                console.error('Supabase 퀴즈 결과 조회 실패:', error);
                setLoadError('저장된 결과를 불러오지 못했습니다.');
            })
            .finally(() => setIsLoading(false));
    }, []);

    const groupedHistory = useMemo(() => {
        const groups = new Map<string, { label: string; items: QuizResultHistory[] }>();

        history.forEach((item) => {
            const key = getGroupKey(item.timestamp);
            const group = groups.get(key);

            if (group) {
                group.items.push(item);
                return;
            }

            groups.set(key, {
                label: formatGroupDate(item.timestamp),
                items: [item],
            });
        });

        return Array.from(groups.values());
    }, [history]);

    const handleDelete = async (id: number) => {
        try {
            setActionError('');
            setDeletingId(id);
            await deleteQuizResult(id);
            setHistory((current) => current.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Supabase 퀴즈 결과 삭제 실패:', error);
            setActionError('결과를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f7f2] text-[#171717] dark:bg-[#171917] dark:text-[#f4f5ef]">
            <header className="border-b border-black/10 dark:border-white/10">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
                    <button type="button" onClick={onGoMain} className="flex h-10 items-center gap-2 rounded-lg px-2 text-sm font-bold transition hover:bg-black/5 dark:hover:bg-white/10">
                        <ArrowLeft size={19} /> 처음으로
                    </button>
                    <div className="flex items-center gap-2 font-black"><History size={19} /> 학습 결과</div>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
                <section className="mb-9">
                    <p className="text-xs font-black text-black/40 dark:text-white/40">MY PROGRESS</p>
                    <h1 className="mt-2 text-4xl font-black sm:text-5xl">쌓인 만큼 보이는<br />나의 학습 기록</h1>
                </section>

                {isLoading ? (
                    <div className="flex min-h-64 items-center justify-center rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-[#242724]">
                        <LoaderCircle className="animate-spin" size={28} />
                    </div>
                ) : loadError ? (
                    <div className="rounded-lg bg-[#ffb7a8] p-6 font-bold text-[#65271f]">{loadError}</div>
                ) : history.length === 0 ? (
                    <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-black/25 bg-white text-center dark:border-white/25 dark:bg-[#242724]">
                        <div>
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#b8ead6] text-[#173d31]"><History size={25} /></div>
                            <p className="mt-4 text-lg font-black">아직 저장된 결과가 없습니다</p>
                            <p className="mt-1 text-sm text-black/45 dark:text-white/45">퀴즈를 제출하면 이곳에 기록됩니다.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {actionError && <div className="rounded-lg bg-[#ffb7a8] p-4 text-sm font-bold text-[#65271f]">{actionError}</div>}
                        {groupedHistory.map((group) => (
                            <section key={group.label} className="space-y-3">
                                <h2 className="px-1 text-sm font-black text-black/45 dark:text-white/45">{group.label}</h2>
                                <div className="space-y-4">
                                    {group.items.map((item) => {
                                        const wrongCount = item.total - item.correctCount;
                                        const passed = wrongCount < 9;
                                        const percentage = Math.round((item.correctCount / item.total) * 100);
                                        const isExpired = Date.now() - item.timestamp > EXPIRED_RESULT_MS;
                                        return (
                                            <article key={item.id ?? item.timestamp} className="overflow-hidden rounded-lg border border-black/15 bg-white dark:border-white/15 dark:bg-[#242724]">
                                                <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ${passed ? 'bg-[#b8ead6] text-[#173d31]' : 'bg-[#ffb7a8] text-[#65271f]'}`}>
                                                                {passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {passed ? '통과' : '재도전'}
                                                            </span>
                                                            {item.retry && <span className="rounded-full bg-[#f8df74] px-2.5 py-1 text-xs font-black text-[#5f4b00]">오답 재시험</span>}
                                                        </div>
                                                        <h3 className="mt-3 text-xl font-black">19과 · {item.lesson}</h3>
                                                        <p className="mt-1 flex items-center gap-1.5 text-sm text-black/45 dark:text-white/45"><Clock3 size={14} /> {item.date}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3 sm:justify-end sm:text-right">
                                                        {isExpired && item.id && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(item.id as number)}
                                                                disabled={deletingId === item.id}
                                                                className="grid h-10 w-10 place-items-center rounded-lg border border-[#e2998f] text-[#b74637] transition hover:bg-[#fff1ed] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#794239] dark:text-[#ff9f91] dark:hover:bg-[#40231f]"
                                                                aria-label={`${item.date} 결과 삭제`}
                                                                title="7일 지난 결과 삭제"
                                                            >
                                                                {deletingId === item.id ? <LoaderCircle className="animate-spin" size={17} /> : <Trash2 size={17} />}
                                                            </button>
                                                        )}
                                                        <div>
                                                            <strong className="text-4xl font-black">{percentage}</strong><span className="pb-1 font-bold text-black/40 dark:text-white/40">점</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="border-t border-black/10 bg-[#fafbf7] px-5 py-4 dark:border-white/10 dark:bg-[#1e201e]">
                                                    <div className="mb-3 flex items-center justify-between text-sm font-bold">
                                                        <span>정답 {item.correctCount}개</span><span className="text-black/40 dark:text-white/40">오답 {wrongCount}개</span>
                                                    </div>
                                                    <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                                                        <div className="h-full rounded-full bg-[#50b993]" style={{ width: `${percentage}%` }} />
                                                    </div>
                                                    {item.wrongList.length > 0 && (
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            {item.wrongList.map((wrong, index) => (
                                                                <span key={`${wrong.correct}-${index}`} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-[#242724]">
                                                                    <b>{wrong.korean}</b> · {wrong.user || '미입력'} → <b>{wrong.correct}</b>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ResultHistory;
