import { useState, useEffect, useRef, useCallback } from 'react';
import type { QuizItem } from '../data/quizData';

interface SpellingTypingGameProps {
    items: QuizItem[];
    onGoMain: () => void;
}

interface FallingBlock {
    id: number;
    word: string;
    hint: string;
    x: number;
    y: number;
    speed: number;
    isActive: boolean;
    timeLimit: number;
    startTime: number;
}

export default function SpellingTypingGame({ items, onGoMain }: SpellingTypingGameProps) {
    const [currentInput, setCurrentInput] = useState('');
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [blocks, setBlocks] = useState<FallingBlock[]>([]);
    const [activeBlockId, setActiveBlockId] = useState<number | null>(null);
    const [wordProgress, setWordProgress] = useState<{ [key: string]: string }>({});
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const blockIdRef = useRef(0);
    const lastBlockTimeRef = useRef(0);

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const BLOCK_WIDTH = 120;
    const BLOCK_HEIGHT = 40;
    const BLOCK_SPEED_BASE = 0.5; // 속도를 절반으로 줄임
    const TIME_LIMIT_BASE = 20000; // 20초로 늘림

    // 게임 시작
    const startGame = () => {
        setGameStarted(true);
        setScore(0);
        setCombo(0);
        setLevel(1);
        setLives(3);
        setGameOver(false);
        setBlocks([]);
        setActiveBlockId(null);
        setWordProgress({});
        setFeedback(null);
        setUsedWords(new Set());
        blockIdRef.current = 0;
        lastBlockTimeRef.current = Date.now();
        gameLoop();
    };

    // 새로운 블록 생성
    const createBlock = useCallback(() => {
        // 사용되지 않은 단어들만 필터링
        const availableItems = items.filter(item => !usedWords.has(item.correctAnswer));
        
        // 모든 단어를 사용했으면 usedWords 초기화
        if (availableItems.length === 0) {
            setUsedWords(new Set());
            return;
        }
        
        const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        const newBlock: FallingBlock = {
            id: blockIdRef.current++,
            word: randomItem.correctAnswer,
            hint: randomItem.korean,
            x: Math.random() * (GAME_WIDTH - BLOCK_WIDTH),
            y: -BLOCK_HEIGHT,
            speed: BLOCK_SPEED_BASE + (level - 1) * 0.1, // 레벨당 속도 증가를 줄임
            isActive: true,
            timeLimit: TIME_LIMIT_BASE - (level - 1) * 1000,
            startTime: Date.now()
        };
        
        setBlocks(prev => [...prev, newBlock]);
        setActiveBlockId(newBlock.id);
        setUsedWords(prev => new Set([...prev, randomItem.correctAnswer]));
    }, [items, level, usedWords]);

    // 게임 루프
    const gameLoop = useCallback(() => {
        const now = Date.now();
        
        // 새로운 블록 생성 (레벨에 따라 빈도 조절)
        if (now - lastBlockTimeRef.current > (8000 - level * 300)) { // 생성 간격을 늘림
            createBlock();
            lastBlockTimeRef.current = now;
        }

        // 블록 업데이트
        setBlocks(prev => prev.map(block => {
            if (!block.isActive) return block;
            
            const newY = block.y + block.speed;
            const timeElapsed = now - block.startTime;
            
            // 시간 초과 또는 바닥 도달
            if (timeElapsed > block.timeLimit || newY > GAME_HEIGHT) {
                if (block.isActive) {
                    setLives(prev => {
                        const newLives = prev - 1;
                        if (newLives <= 0) {
                            setGameOver(true);
                        }
                        return newLives;
                    });
                    setCombo(0);
                    setFeedback({ message: `시간 초과! 정답: ${block.word}`, type: 'error' });
                }
                return { ...block, isActive: false };
            }
            
            return { ...block, y: newY };
        }));

        animationRef.current = requestAnimationFrame(gameLoop);
    }, [level, createBlock]);

    // 입력 처리
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setCurrentInput(input);
        
        // 현재 활성 블록 찾기
        const activeBlock = blocks.find(block => block.isActive);
        if (!activeBlock) return;

        // 입력 진행도 업데이트
        setWordProgress(prev => ({
            ...prev,
            [activeBlock.id]: input
        }));

        // 완전히 맞춘 경우
        if (input.toLowerCase() === activeBlock.word.toLowerCase()) {
            const timeBonus = Math.max(0, activeBlock.timeLimit - (Date.now() - activeBlock.startTime));
            const baseScore = activeBlock.word.length * 10;
            const bonusScore = Math.floor(timeBonus / 1000) * 5;
            const comboMultiplier = 1.0 + combo * 0.1;
            const totalScore = Math.floor((baseScore + bonusScore) * comboMultiplier);
            
            setScore(prev => prev + totalScore);
            setCombo(prev => prev + 1);
            setBlocks(prev => prev.map(block => 
                block.id === activeBlock.id ? { ...block, isActive: false } : block
            ));
            setCurrentInput('');
            setWordProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[activeBlock.id];
                return newProgress;
            });
            setActiveBlockId(null);
            setFeedback({ 
                message: `정답! +${totalScore}점 (콤보: ${combo + 1})`, 
                type: 'success' 
            });

            // 레벨업 체크
            if (score + totalScore >= level * 1000) {
                setLevel(prev => prev + 1);
                setFeedback({ 
                    message: `레벨 업! 레벨 ${level + 1}`, 
                    type: 'info' 
                });
            }
        }
    };

    // 키보드 이벤트
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentInput.trim()) {
            const activeBlock = blocks.find(block => block.isActive);
            if (activeBlock && currentInput.toLowerCase() === activeBlock.word.toLowerCase()) {
                handleInput({ target: { value: currentInput } } as React.ChangeEvent<HTMLInputElement>);
            }
        }
    };

    // 캔버스 렌더링
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 캔버스 클리어
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // 블록 렌더링
        blocks.forEach(block => {
            if (!block.isActive) return;

            const timeElapsed = Date.now() - block.startTime;
            const timeProgress = timeElapsed / block.timeLimit;
            
            // 블록 그리기
            ctx.fillStyle = `hsl(${200 - timeProgress * 100}, 70%, 50%)`;
            ctx.fillRect(block.x, block.y, BLOCK_WIDTH, BLOCK_HEIGHT);
            
            // 테두리
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(block.x, block.y, BLOCK_WIDTH, BLOCK_HEIGHT);
            
            // 힌트 텍스트
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(block.hint, block.x + BLOCK_WIDTH / 2, block.y + BLOCK_HEIGHT / 2 + 4);
            
            // 시간바
            const barWidth = BLOCK_WIDTH * (1 - timeProgress);
            ctx.fillStyle = timeProgress > 0.8 ? '#ff4444' : '#44ff44';
            ctx.fillRect(block.x, block.y - 5, barWidth, 3);
        });

        // 입력 진행도 표시
        if (activeBlockId !== null) {
            const activeBlock = blocks.find(block => block.id === activeBlockId);
            if (activeBlock && activeBlock.isActive && activeBlock.word) {
                const progress = wordProgress[activeBlock.id] || '';
                const correctLength = activeBlock.word.toLowerCase().startsWith((progress || '').toLowerCase()) 
                    ? progress.length 
                    : 0;
                
                ctx.fillStyle = '#333';
                ctx.font = '16px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(progress || '', 10, GAME_HEIGHT - 60);
                
                // 정답 미리보기 (맞춘 부분만)
                ctx.fillStyle = '#666';
                ctx.fillText(activeBlock.word.substring(0, correctLength), 10, GAME_HEIGHT - 40);
            }
        }
    }, [blocks, activeBlockId, wordProgress]);

    // 게임 시작/종료 처리
    useEffect(() => {
        if (gameStarted && !gameOver) {
            const startGameLoop = () => {
                if (!gameOver) {
                    gameLoop();
                }
            };
            startGameLoop();
        }
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [gameStarted, gameOver]);

    // 피드백 자동 제거
    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    if (!gameStarted) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4 dark:text-white">스펠링 타자 게임</h2>
                    <p className="text-lg mb-6 dark:text-white">
                        떨어지는 블록의 단어를 빠르고 정확하게 입력하세요!
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4 dark:text-white">게임 규칙</h3>
                        <ul className="text-left space-y-2 dark:text-white">
                            <li>• 블록이 바닥에 닿기 전에 단어를 입력하세요</li>
                            <li>• 정확한 철자를 입력하면 점수를 얻습니다</li>
                            <li>• 연속 정답 시 콤보 점수가 올라갑니다</li>
                            <li>• 시간이 부족하거나 틀리면 생명이 줄어듭니다</li>
                            <li>• 레벨이 올라갈수록 난이도가 증가합니다</li>
                        </ul>
                    </div>
                    <button
                        onClick={startGame}
                        className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xl font-semibold"
                    >
                        게임 시작
                    </button>
                </div>
            </div>
        );
    }

    if (gameOver) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4 dark:text-white">게임 오버</h2>
                    <div className="text-2xl mb-4 dark:text-white">
                        최종 점수: <span className="text-blue-600 dark:text-blue-400">{score}</span>
                    </div>
                    <div className="text-lg mb-6 dark:text-white">
                        최고 콤보: <span className="text-green-600 dark:text-green-400">{combo}</span>
                    </div>
                    <div className="text-lg mb-8 dark:text-white">
                        달성 레벨: <span className="text-purple-600 dark:text-purple-400">{level}</span>
                    </div>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={startGame}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        다시하기
                    </button>
                    <button
                        onClick={onGoMain}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        메인으로
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 게임 정보 */}
            <div className="flex justify-between items-center mb-4 dark:text-white">
                <div className="flex gap-6">
                    <div>점수: <span className="text-blue-600 dark:text-blue-400">{score}</span></div>
                    <div>콤보: <span className="text-green-600 dark:text-green-400">{combo}</span></div>
                    <div>레벨: <span className="text-purple-600 dark:text-purple-400">{level}</span></div>
                </div>
                <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-6 h-6 rounded-full ${
                                i < lives ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* 피드백 메시지 */}
            {feedback && (
                <div className={`text-center p-3 rounded-lg mb-4 ${
                    feedback.type === 'success' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : feedback.type === 'error'
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                }`}>
                    {feedback.message}
                </div>
            )}

            {/* 게임 캔버스 */}
            <div className="flex justify-center mb-6">
                <canvas
                    ref={canvasRef}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    className="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800"
                />
            </div>

            {/* 입력창 */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    value={currentInput}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="단어를 입력하세요..."
                    className="w-96 p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />
            </div>

            {/* 게임 컨트롤 */}
            <div className="text-center">
                <button
                    onClick={onGoMain}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                    메인으로 돌아가기
                </button>
            </div>
        </div>
    );
}
