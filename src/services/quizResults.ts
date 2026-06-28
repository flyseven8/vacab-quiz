import type { QuizResultHistory } from '../types/quizResult';
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

const getSupabase = () => {
    if (!hasSupabaseConfig || !supabase) {
        throw new Error('Supabase configuration is missing.');
    }

    return supabase;
};

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
    const timestamp = Date.now();
    const { error } = await getSupabase()
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
        throw error;
    }
}

export async function getQuizResults(): Promise<QuizResultHistory[]> {
    const { data, error } = await getSupabase()
        .from('quiz_results')
        .select('id, date_label, lesson, correct_count, total, wrong_list, retry, timestamp_ms')
        .order('timestamp_ms', { ascending: false });

    if (error) {
        throw error;
    }

    return (data as QuizResultRow[]).map(toHistory);
}

export async function deleteQuizResult(id: number): Promise<void> {
    const { error } = await getSupabase()
        .from('quiz_results')
        .delete()
        .eq('id', id);

    if (error) {
        throw error;
    }
}
