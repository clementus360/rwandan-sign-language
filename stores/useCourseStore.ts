import { Lesson, Unit } from '@/data/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

type CourseStore = {
    showLikedOnly: boolean;
    units: Unit[];
    lessonHistory: string[];
    loading: boolean;
    init: () => Promise<void>;
    getLessonById: (id: string) => Lesson | undefined;
    toggleLessonStatus: (id: string) => void;
    toggleLessonLike: (id: string) => void;
    addToHistory: (lessonId: string) => void;
    getNextLessonId: (currentLessonId: string) => string | null;
    filterLikedLessons: () => Lesson[];
    addLesson: (unitId: string, lesson: Omit<Lesson, 'id' | 'status' | 'isLiked'>) => void;
    updateLesson: (id: string, updates: Partial<Omit<Lesson, 'id'>>) => void;
    deleteLesson: (id: string) => void;
    addUnit: (unit: Omit<Unit, 'id' | 'lessons'>) => void;
    updateUnit: (id: string, updates: Partial<Omit<Unit, 'id' | 'lessons'>>) => void;
    deleteUnit: (id: string) => void;
    setShowLikedOnly: (value: boolean) => void;
    downloadLesson: (lessonId: string) => Promise<void>;
    removeDownloadedLesson: (lessonId: string) => Promise<void>;
};

export const useCourseStore = create<CourseStore>()(
    persist(
        (set, get) => ({
            units: [],
            lessonHistory: [],
            loading: true,
            showLikedOnly: false,

            init: async () => {
                const json = await require('@/data/courseData.json');
                set({ units: json.units, loading: false });
            },

            addToHistory: (lessonId) => {
                set((state) => ({
                    lessonHistory: [lessonId, ...state.lessonHistory.filter((id) => id !== lessonId)].slice(0, 10),
                }));
            },

            getLessonById: (id) =>
                get().units.flatMap((unit) => unit.lessons).find((lesson) => lesson.id === id),

            toggleLessonStatus: (id) => {
                set((state) => ({
                    units: state.units.map((unit) => ({
                        ...unit,
                        lessons: unit.lessons.map((lesson) =>
                            lesson.id === id
                                ? {
                                    ...lesson,
                                    status: lesson.status === 'completed' ? 'pending' : 'completed',
                                }
                                : lesson
                        ),
                        progress: unit.lessons.reduce(
                            (count, lesson) =>
                                count +
                                (lesson.id === id
                                    ? lesson.status === 'pending'
                                        ? 1
                                        : 0
                                    : lesson.status === 'completed'
                                        ? 1
                                        : 0),
                            0
                        ),
                    })),
                }));
            },

            toggleLessonLike: (id) => {
                set((state) => ({
                    units: state.units.map((unit) => ({
                        ...unit,
                        lessons: unit.lessons.map((lesson) =>
                            lesson.id === id ? { ...lesson, isLiked: !lesson.isLiked } : lesson
                        ),
                    })),
                }));
            },

            filterLikedLessons: () => {
                return get().units.flatMap((unit) => unit.lessons).filter((lesson) => lesson.isLiked);
            },

            getNextLessonId: (currentLessonId) => {
                const units = get().units;
                for (let i = 0; i < units.length; i++) {
                    const index = units[i].lessons.findIndex((l) => l.id === currentLessonId);
                    if (index !== -1) {
                        if (index + 1 < units[i].lessons.length) return units[i].lessons[index + 1].id;
                        if (i + 1 < units.length && units[i + 1].lessons.length)
                            return units[i + 1].lessons[0].id;
                    }
                }
                return null;
            },

            addLesson: (unitId, lesson) => {
                set((state) => ({
                    units: state.units.map((unit) =>
                        unit.id === unitId
                            ? {
                                ...unit,
                                lessons: [
                                    ...unit.lessons,
                                    {
                                        ...lesson,
                                        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                        status: 'pending',
                                        isLiked: false,
                                    },
                                ],
                                progress: unit.lessons.filter((l) => l.status === 'completed').length,
                            }
                            : unit
                    ),
                }));
            },

            updateLesson: (id, updates) => {
                set((state) => ({
                    units: state.units.map((unit) => ({
                        ...unit,
                        lessons: unit.lessons.map((lesson) =>
                            lesson.id === id ? { ...lesson, ...updates } : lesson
                        ),
                    })),
                }));
            },

            deleteLesson: (id) => {
                set((state) => ({
                    units: state.units.map((unit) => ({
                        ...unit,
                        lessons: unit.lessons.filter((lesson) => lesson.id !== id),
                        progress: unit.lessons.filter((l) => l.status === 'completed' && l.id !== id).length,
                    })),
                }));
            },

            addUnit: (unit) => {
                set((state) => ({
                    units: [
                        ...state.units,
                        {
                            ...unit,
                            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                            lessons: [],
                            progress: 0,
                        },
                    ],
                }));
            },

            updateUnit: (id, updates) => {
                set((state) => ({
                    units: state.units.map((unit) =>
                        unit.id === id ? { ...unit, ...updates } : unit
                    ),
                }));
            },

            deleteUnit: (id) => {
                set((state) => ({
                    units: state.units.filter((unit) => unit.id !== id),
                }));
            },

            setShowLikedOnly: (value) => set({ showLikedOnly: value }),

            downloadLesson: async (lessonId: string) => {
                const lesson = get().getLessonById(lessonId);
                if (!lesson || lesson.downloaded) return;

                try {
                    // Request media library permissions
                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    if (status !== 'granted') {
                        throw new Error('Media library permission denied');
                    }

                    const fileUri = `${FileSystem.documentDirectory}${lessonId}.mp4`;
                    const { uri } = await FileSystem.downloadAsync(lesson.video, fileUri);

                    set((state) => ({
                        units: state.units.map((unit) => ({
                            ...unit,
                            lessons: unit.lessons.map((l) =>
                                l.id === lessonId ? { ...l, downloaded: true, localUri: uri } : l
                            ),
                        })),
                    }));
                } catch (error) {
                    console.error('Download failed:', error);
                    throw error; // Re-throw to handle in UI
                }
            },

            removeDownloadedLesson: async (lessonId: string) => {
                const lesson = get().getLessonById(lessonId);
                if (!lesson || !lesson.downloaded || !lesson.localUri) return;

                try {
                    await FileSystem.deleteAsync(lesson.localUri);
                    set((state) => ({
                        units: state.units.map((unit) => ({
                            ...unit,
                            lessons: unit.lessons.map((l) =>
                                l.id === lessonId ? { ...l, downloaded: false, localUri: undefined } : l
                            ),
                        })),
                    }));
                } catch (error) {
                    console.error('Failed to remove downloaded file:', error);
                    throw error; // Re-throw to handle in UI
                }
            },
        }),
        {
            name: 'course-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);