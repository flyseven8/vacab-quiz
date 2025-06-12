import { useState } from "react";
import './index.css'
import QuizResult from "./components/QuizResult";
import { quizResults23, quizResults24 } from "./data/quizData";
import selectGif from './assets/cat.gif';

export default function App() {
    const [selected, setSelected] = useState<23 | 24 | null>(null);

    if (selected === null) {
        // 선택 화면
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <img src={selectGif} alt="과 선택" className="w-64 h-64 mb-8" />
                <div className="text-2xl font-bold mb-8">과를 선택하세요</div>
                <div className="flex gap-8">
                    <button
                        className="px-10 py-6 text-xl rounded-lg bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
                        onClick={() => setSelected(23)}
                    >
                        23과
                    </button>
                    <button
                        className="px-10 py-6 text-xl rounded-lg bg-green-500 text-white shadow-lg hover:bg-green-600 transition"
                        onClick={() => setSelected(24)}
                    >
                        24과
                    </button>
                </div>
            </div>
        );
    }

    // QuizResult로 이동
    return (
        <QuizResult items={selected === 23 ? quizResults23 : quizResults24} onGoMain={() => setSelected(null)} />
    );
}