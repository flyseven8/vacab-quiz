export type QuizResultHistory = {
    id?: number;
    date: string;
    lesson: string;
    correctCount: number;
    total: number;
    wrongList: { korean: string; correct: string; user: string }[];
    retry: boolean;
    timestamp: number;
};
