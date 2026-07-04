import type { QuizItem } from '../types/quizItem';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

type QuizWordRow = {
    word_no: number;
    correct_answer: string;
    part_of_speech: string;
    meaning: string;
    korean: string;
};

export const splitQuizItems = (items: QuizItem[]) => ({
    first: items.slice(0, 40),
    second: items.slice(40, 80),
});

export async function fetchQuizItems(lesson = 19): Promise<QuizItem[]> {
    if (!hasSupabaseConfig || !supabase) {
        throw new Error('Supabase configuration is missing.');
    }

    const { data, error } = await supabase
        .from('quiz_words')
        .select('word_no, correct_answer, part_of_speech, meaning, korean')
        .eq('lesson', lesson)
        .order('word_no', { ascending: true });

    if (error) {
        throw error;
    }

    if (!data || data.length === 0) {
        throw new Error(`No quiz words found for lesson ${lesson}.`);
    }

    return (data as QuizWordRow[]).map((row) => ({
        userAnswer: '',
        correctAnswer: row.correct_answer,
        partOfSpeech: row.part_of_speech,
        meaning: row.meaning,
        korean: row.korean,
    }));
}
