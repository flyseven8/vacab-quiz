import type { QuizResultHistory } from '../utils/localStorage';
import {
    deleteAllQuizResults as deleteAllLocalQuizResults,
    deleteQuizResult as deleteLocalQuizResult,
    getLocalQuizResults,
    saveLocalQuizResult,
} from '../utils/localStorage';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

type QuizResultRow = {
    id: number;
    date_label: string;
    lesson: string;
    correct_count: number;
    total: number;
    wrong_list: { korean: string; correct: string; user: string }[];
    retry: boolean;
    timestamp_ms: number;
};

type QuizResultInput = Omit<QuizResultHistory, 'timestamp'>;

const canUseSupabase = () => hasSupabaseConfig && supabase;

const toHistory = (row: QuizResultRow): QuizResultHistory => ({
    id: row.id,
    date: row.date_label,
    lesson: row.lesson,
    correctCount: row.correct_count,
    total: row.total,
    wrongList: row.wrong_list,
    retry: row.retry,
    timestamp: row.timestamp_ms,
});

export async function saveQuizResult(result: QuizResultInput): Promise<void> {
    if (!canUseSupabase()) {
        saveLocalQuizResult(result);
        return;
    }

    const timestamp = Date.now();
    const { error } = await supabase!
        .from('quiz_results')
        .insert({
            date_label: result.date,
            lesson: result.lesson,
            correct_count: result.correctCount,
            total: result.total,
            wrong_list: result.wrongList,
            retry: result.retry,
            timestamp_ms: timestamp,
        });

    if (error) {
        console.error('Supabase 퀴즈 결과 저장 실패:', error);
        saveLocalQuizResult(result);
    }
}

export async function getQuizResults(): Promise<QuizResultHistory[]> {
    if (!canUseSupabase()) {
        return getLocalQuizResults();
    }

    const { data, error } = await supabase!
        .from('quiz_results')
        .select('id, date_label, lesson, correct_count, total, wrong_list, retry, timestamp_ms')
        .order('timestamp_ms', { ascending: false });

    if (error) {
        console.error('Supabase 퀴즈 결과 조회 실패:', error);
        return getLocalQuizResults();
    }

    return (data as QuizResultRow[]).map(toHistory);
}

export async function deleteQuizResult(index: number, id?: number): Promise<void> {
    if (!canUseSupabase() || id === undefined) {
        deleteLocalQuizResult(index);
        return;
    }

    const { error } = await supabase!
        .from('quiz_results')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Supabase 퀴즈 결과 삭제 실패:', error);
        deleteLocalQuizResult(index);
    }
}

export async function deleteAllQuizResults(): Promise<void> {
    if (!canUseSupabase()) {
        deleteAllLocalQuizResults();
        return;
    }

    const { error } = await supabase!
        .from('quiz_results')
        .delete()
        .gte('id', 0);

    if (error) {
        console.error('Supabase 전체 퀴즈 결과 삭제 실패:', error);
        deleteAllLocalQuizResults();
    }
}
