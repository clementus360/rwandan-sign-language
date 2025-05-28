
import practiceData from '@/data/practiceData.json'; // ✅ static import
import { PracticeQuestion } from '@/data/types';
import { create } from 'zustand';

interface PracticeStore {
    questions: PracticeQuestion[];
    currentQuestionIndex: number;
    selectedAnswer: string | null;
    feedback: 'correct' | 'wrong' | null;
    loading: boolean;
    init: () => void;
    currentQuestion: () => PracticeQuestion | null;
    selectAnswer: (value: string) => void;
    goToNextQuestion: () => void;
    resetPractice: () => void;
}

export const usePracticeStore = create<PracticeStore>((set, get) => ({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    feedback: null,
    loading: true,

    init: () => {
        set({
            questions: practiceData,
            loading: false,
        });
    },

    // ✅ make it a function
    currentQuestion: () => {
        const { questions, currentQuestionIndex } = get();
        return questions[currentQuestionIndex] || null;
    },

    selectAnswer: (value) => {
        const question = get().currentQuestion();
        if (!question) return;

        const isCorrect = value === question.correctAnswer;
        set({
            selectedAnswer: value,
            feedback: isCorrect ? 'correct' : 'wrong',
        });
    },

    goToNextQuestion: () => {
        const nextIndex = get().currentQuestionIndex + 1;
        const questions = get().questions;
        if (nextIndex < questions.length) {
            set({
                currentQuestionIndex: nextIndex,
                selectedAnswer: null,
                feedback: null,
            });
        }
    },

    resetPractice: () => {
        set({
            currentQuestionIndex: 0,
            selectedAnswer: null,
            feedback: null,
        });
    },
}));