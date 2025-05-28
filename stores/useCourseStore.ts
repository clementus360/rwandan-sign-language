import { Lesson, Unit } from '@/data/types';
import { create } from 'zustand';

// Optionally add AsyncStorage for persistence later
// import AsyncStorage from '@react-native-async-storage/async-storage';

type CourseStore = {
    units: Unit[];
    loading: boolean;
    getLessonById: (id: string) => Lesson | undefined;
    toggleLessonStatus: (id: string) => void;
    getNextLessonId: (currentLessonId: string) => string | null;
    init: () => Promise<void>;
};

export const useCourseStore = create<CourseStore>((set, get) => ({
    units: [],
    loading: true,

    init: async () => {
        const json = await require('@/data/courseData.json'); // Assuming JSON is local
        set({ units: json.units, loading: false });
    },

    getLessonById: (id) =>
        get().units.flatMap(unit => unit.lessons).find(lesson => lesson.id === id),

    toggleLessonStatus: (id) => {
        const updated = get().units.map(unit => ({
            ...unit,
            lessons: unit.lessons.map(lesson =>
                lesson.id === id
                    ? {
                        ...lesson,
                        status: lesson.status === 'completed' ? 'pending' as 'pending' : 'completed' as 'completed'
                    }
                    : lesson
            )
        }));
        set({ units: updated });
    },

    getNextLessonId: (currentLessonId) => {
        const units = get().units;
        for (let i = 0; i < units.length; i++) {
            const index = units[i].lessons.findIndex(l => l.id === currentLessonId);
            if (index !== -1) {
                if (index + 1 < units[i].lessons.length) return units[i].lessons[index + 1].id;
                if (i + 1 < units.length && units[i + 1].lessons.length) return units[i + 1].lessons[0].id;
            }
        }
        return null;
    }
}));