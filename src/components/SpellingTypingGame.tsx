import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Gamepad2, Heart, Keyboard, Play, RotateCcw, Trophy, Zap } from 'lucide-react';
import type { QuizItem } from '../types/quizItem';

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
            ctx.fillStyle = timeProgress > 0.75 ? '#ff8f7d' : '#7bd3b2';
            ctx.beginPath();
            ctx.roundRect(block.x, block.y, BLOCK_WIDTH, BLOCK_HEIGHT, 8);
            ctx.fill();
            
            // 테두리
            ctx.strokeStyle = '#171717';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 힌트 텍스트
            ctx.fillStyle = '#171717';
            ctx.font = 'bold 13px Inter, Arial';
            ctx.textAlign = 'center';
            ctx.fillText(block.hint, block.x + BLOCK_WIDTH / 2, block.y + BLOCK_HEIGHT / 2 + 4);
            
            // 시간바
            const barWidth = BLOCK_WIDTH * (1 - timeProgress);
            ctx.fillStyle = timeProgress > 0.8 ? '#e65e4c' : '#f8df74';
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
                
                ctx.fillStyle = '#f4f5ef';
                ctx.font = 'bold 16px Inter, Arial';
                ctx.textAlign = 'left';
                ctx.fillText(progress || '', 10, GAME_HEIGHT - 60);
                
                // 정답 미리보기 (맞춘 부분만)
                ctx.fillStyle = '#8f978c';
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
    }, [gameStarted, gameOver, gameLoop]);

    // 피드백 자동 제거
    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    if (!gameStarted) {
        return (
            <main className="min-h-screen bg-[#f6f7f2] text-[#171717] dark:bg-[#171917] dark:text-[#f4f5ef]">
                <header className="border-b border-black/10 dark:border-white/10">
                    <div className="mx-auto max-w-5xl px-5 py-4 sm:px-8">
                        <button type="button" onClick={onGoMain} className="flex h-10 items-center gap-2 rounded-lg px-2 text-sm font-bold transition hover:bg-black/5 dark:hover:bg-white/10"><ArrowLeft size={19} /> 처음으로</button>
                    </div>
                </header>
                <div className="mx-auto grid max-w-5xl gap-8 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[1fr_360px] lg:items-center">
                    <section>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#b8ead6] px-3 py-1.5 text-xs font-black text-[#173d31]"><Gamepad2 size={14} /> SPEED MODE</div>
                        <h1 className="text-5xl font-black leading-[1.05] sm:text-6xl">보고, 입력하고,<br />점수를 쌓으세요</h1>
                        <p className="mt-5 max-w-xl leading-7 text-black/50 dark:text-white/50">한국어 힌트를 보고 영어 단어를 완성하세요. 연속 정답일수록 더 높은 점수를 얻습니다.</p>
                        <button type="button" onClick={startGame} className="mt-8 flex h-14 items-center gap-3 rounded-lg bg-[#171717] px-6 font-black text-white shadow-[0_4px_0_#b8ead6] transition hover:-translate-y-1 dark:bg-[#f4f5ef] dark:text-[#171717]"><Play size={20} fill="currentColor" /> 게임 시작</button>
                    </section>
                    <section className="rounded-lg border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-[#242724]">
                        <p className="text-xs font-black text-black/40 dark:text-white/40">HOW TO PLAY</p>
                        <div className="mt-4 space-y-3">
                            {[
                                [Keyboard, '블록의 한국어 힌트를 보고 영단어 입력'],
                                [Zap, '연속 정답으로 콤보 배수 획득'],
                                [Heart, '세 번 놓치면 게임 종료'],
                                [Trophy, '1,000점마다 난이도 상승'],
                            ].map(([Icon, text], index) => {
                                const RuleIcon = Icon as typeof Keyboard;
                                return <div key={index} className="flex items-center gap-3 rounded-lg bg-[#f6f7f2] p-3 dark:bg-[#171917]"><RuleIcon size={19} /><span className="text-sm font-bold">{text as string}</span></div>;
                            })}
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    if (gameOver) {
        return (
            <main className="grid min-h-screen place-items-center bg-[#f6f7f2] px-5 text-[#171717] dark:bg-[#171917] dark:text-[#f4f5ef]">
                <div className="w-full max-w-xl rounded-lg border border-black/15 bg-white p-6 text-center dark:border-white/15 dark:bg-[#242724] sm:p-9">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-[#f8df74] text-[#5f4b00]"><Trophy size={30} /></div>
                    <p className="mt-5 text-xs font-black text-black/40 dark:text-white/40">GAME COMPLETE</p>
                    <h1 className="mt-2 text-4xl font-black">{score.toLocaleString()}점</h1>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-[#b8ead6] p-4 text-[#173d31]"><p className="text-xs font-black opacity-60">COMBO</p><p className="mt-1 text-2xl font-black">{combo}</p></div>
                        <div className="rounded-lg bg-[#b9d9ff] p-4 text-[#17324f]"><p className="text-xs font-black opacity-60">LEVEL</p><p className="mt-1 text-2xl font-black">{level}</p></div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <button type="button" onClick={startGame} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#171717] font-black text-white dark:bg-[#f4f5ef] dark:text-[#171717]"><RotateCcw size={18} /> 다시하기</button>
                        <button type="button" onClick={onGoMain} className="h-12 flex-1 rounded-lg border border-black/15 font-black dark:border-white/15">처음으로</button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#171917] px-3 py-4 text-[#f4f5ef] sm:px-6 sm:py-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <button type="button" onClick={onGoMain} className="flex h-10 items-center gap-2 rounded-lg px-2 text-sm font-bold transition hover:bg-white/10"><ArrowLeft size={19} /> 종료</button>
                    <div className="flex gap-2">
                        {[['점수', score], ['콤보', combo], ['레벨', level]].map(([label, value]) => <div key={label} className="min-w-20 rounded-lg bg-white/10 px-3 py-2 text-center"><p className="text-[10px] font-black text-white/45">{label}</p><p className="font-black">{value}</p></div>)}
                    </div>
                    <div className="flex gap-1.5" aria-label={`남은 생명 ${lives}`}>
                        {[...Array(3)].map((_, i) => <Heart key={i} size={20} fill={i < lives ? '#ff8f7d' : 'transparent'} className={i < lives ? 'text-[#ff8f7d]' : 'text-white/20'} />)}
                    </div>
                </div>
                {feedback && <div className={`mb-3 rounded-lg px-4 py-3 text-center text-sm font-black ${feedback.type === 'success' ? 'bg-[#b8ead6] text-[#173d31]' : feedback.type === 'error' ? 'bg-[#ffb7a8] text-[#65271f]' : 'bg-[#b9d9ff] text-[#17324f]'}`}>{feedback.message}</div>}
                <div className="overflow-hidden rounded-lg border border-white/15 bg-[#202320]">
                <canvas
                    ref={canvasRef}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    className="block aspect-[4/3] h-auto w-full bg-[#202320]"
                />
                </div>
                <div className="mx-auto mt-4 max-w-xl">
                <input
                    type="text"
                    value={currentInput}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="영어 단어를 입력하세요"
                    className="h-14 w-full rounded-lg border border-white/15 bg-white/10 px-5 text-center text-lg font-black text-white outline-none transition placeholder:text-white/30 focus:border-[#b8ead6]"
                    autoFocus
                />
                <p className="mt-2 text-center text-xs font-bold text-white/35">정확한 단어가 완성되면 자동으로 제출됩니다</p>
                </div>
            </div>
        </main>
    );
}
