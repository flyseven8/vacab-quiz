export type QuizResultHistory = {
    date: string;
    lesson: string;
    correctCount: number;
    total: number;
    wrongList: { korean: string; correct: string; user: string }[];
    retry: boolean;
    timestamp: number; // 저장된 시간 (밀리초)
};

const QUIZ_RESULTS_KEY = 'quizResultsHistory';
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // 3일을 밀리초로 변환

/**
 * 3일이 지난 퀴즈 결과들을 자동으로 삭제합니다.
 */
export const cleanExpiredQuizResults = (): void => {
    try {
        const storedData = localStorage.getItem(QUIZ_RESULTS_KEY);
        if (!storedData) return;

        const results: QuizResultHistory[] = JSON.parse(storedData);
        const now = Date.now();
        
        // 3일이 지나지 않은 결과만 필터링
        const validResults = results.filter(result => {
            // timestamp가 없는 기존 데이터는 현재 시간으로 설정
            if (!result.timestamp) {
                result.timestamp = now;
                return true;
            }
            return (now - result.timestamp) < THREE_DAYS_MS;
        });

        // 변경사항이 있을 때만 저장
        if (validResults.length !== results.length) {
            if (validResults.length === 0) {
                localStorage.removeItem(QUIZ_RESULTS_KEY);
            } else {
                localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(validResults));
            }
            console.log(`만료된 퀴즈 결과 ${results.length - validResults.length}개를 삭제했습니다.`);
        }
    } catch (error) {
        console.error('퀴즈 결과 정리 중 오류 발생:', error);
    }
};

/**
 * 퀴즈 결과를 로컬 스토리지에 저장합니다.
 */
export const saveQuizResult = (result: Omit<QuizResultHistory, 'timestamp'>): void => {
    try {
        const resultWithTimestamp: QuizResultHistory = {
            ...result,
            timestamp: Date.now()
        };

        const prev = JSON.parse(localStorage.getItem(QUIZ_RESULTS_KEY) || '[]');
        const updated = [resultWithTimestamp, ...prev];
        localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('퀴즈 결과 저장 중 오류 발생:', error);
    }
};

/**
 * 저장된 퀴즈 결과들을 가져옵니다. (만료된 데이터는 자동으로 정리됩니다)
 */
export const getQuizResults = (): QuizResultHistory[] => {
    cleanExpiredQuizResults(); // 데이터를 가져올 때마다 만료된 데이터 정리
    
    try {
        const storedData = localStorage.getItem(QUIZ_RESULTS_KEY);
        return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error('퀴즈 결과 로드 중 오류 발생:', error);
        return [];
    }
};

/**
 * 특정 인덱스의 퀴즈 결과를 삭제합니다.
 */
export const deleteQuizResult = (index: number): void => {
    try {
        const results = getQuizResults();
        const updated = results.filter((_, i) => i !== index);
        
        if (updated.length === 0) {
            localStorage.removeItem(QUIZ_RESULTS_KEY);
        } else {
            localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(updated));
        }
    } catch (error) {
        console.error('퀴즈 결과 삭제 중 오류 발생:', error);
    }
};

/**
 * 모든 퀴즈 결과를 삭제합니다.
 */
export const deleteAllQuizResults = (): void => {
    try {
        localStorage.removeItem(QUIZ_RESULTS_KEY);
    } catch (error) {
        console.error('모든 퀴즈 결과 삭제 중 오류 발생:', error);
    }
}; 