import React, { useState, useEffect } from 'react';

type QuizResultHistory = {
    date: string;
    range: string;
    correctCount: number;
    total: number;
    wrongList: { korean: string; correct: string; user: string }[];
    retry: boolean;
};

const ResultHistory: React.FC<{ onGoMain: () => void }> = ({ onGoMain }) => {
    const [history, setHistory] = useState<QuizResultHistory[]>([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('quizResultsHistory') || '[]');
        setHistory(data);
    }, []);

    const handleDelete = (idx: number) => {
        const newHistory = history.filter((_, i) => i !== idx);
        setHistory(newHistory);
        localStorage.setItem('quizResultsHistory', JSON.stringify(newHistory));
    };

    return (
        <div className="flex flex-col items-center min-h-screen pt-20 dark:bg-gray-900 dark:text-white">
            <h2 className="text-2xl font-bold mb-6">저장된 시험 결과</h2>
            {history.length === 0 ? (
                <div className="mb-8">저장된 결과가 없습니다.</div>
            ) : (
                <div className="w-full max-w-xl space-y-6 mb-8">
                    {history.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
                            <div className="font-semibold mb-1">{item.date}</div>
                            {item.retry && (
                                <div className="text-xs text-red-500 mb-1">틀린 문제 다시 풀기</div>
                            )}
                            <div className="mb-1">범위: {item.range}</div>
                            <div className="mb-1">정답: {item.correctCount} / {item.total}</div>
                            {item.wrongList.length > 0 && (
                                <div className="mt-2">
                                    <div className="font-medium">오답 목록:</div>
                                    <ul className="list-disc ml-6">
                                        {item.wrongList.map((w, i) => (
                                            <li key={i}>{w.korean} (정답: {w.correct}, 입력: {w.user})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <button
                                onClick={() => handleDelete(idx)}
                                className="mt-4 px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button
                onClick={onGoMain}
                className="px-6 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            >
                처음으로
            </button>
        </div>
    );
};

export default ResultHistory; 