import { Lesson } from '@/data/types';
import { useCourseStore } from '@/stores/useCourseStore';
import { useSearchStore } from '@/stores/useSearchStore';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import LessonComponent from '../Cards/LessonCard';
import UnitHeader from '../Cards/UnitHeader';

export default function TimelinePage() {
    const [lessonsToDisplay, setLessonsToDisplay] = useState<Lesson[]>([]);
    const search = useSearchStore((state) => state.value.toLowerCase().trim());
    const units = useCourseStore((state) => state.units);
    const loading = useCourseStore((state) => state.loading);
    const filterLikedLessons = useCourseStore((state) => state.filterLikedLessons);
    const showLikedOnly = useCourseStore((state) => state.showLikedOnly);

    let anyLessonFound = false;

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center py-16">
                <Text className="text-lg text-muted">Loading...</Text>
            </View>
        );
    }

    useEffect(() => {
        const lessons = showLikedOnly ? filterLikedLessons() : units.flatMap((unit) => unit.lessons);
        setLessonsToDisplay(lessons);
    }, [showLikedOnly, units]);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f0f2f5', position: 'relative' }}>
            {/* Timeline Line */}
            <View
                style={{
                    position: 'absolute',
                    left: 16,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: '#d3d3d3',
                    zIndex: 0,
                }}
            />

            {/* Liked Lessons or Units and Lessons */}
            {showLikedOnly ? (
                lessonsToDisplay && lessonsToDisplay.length > 0 ? (
                    lessonsToDisplay.map((lesson) => (
                        <View key={lesson.id} style={{ marginHorizontal: 8, marginBottom: 16, position: 'relative' }}>
                            <View style={{ marginLeft: 24 }}>
                                <LessonComponent
                                    id={lesson.id}
                                    title={lesson.title}
                                    description={lesson.description || ''}
                                    icon={lesson.icon || ''}
                                    type={lesson.type || 'sign'}
                                    status={lesson.status}
                                    isLiked={lesson.isLiked}
                                />
                            </View>
                        </View>
                    ))
                ) : (
                    <View className="items-center justify-center py-16">
                        <Text className="text-muted text-lg">No liked lessons found.</Text>
                    </View>
                )
            ) : (
                units.map((unit) => {
                    const filteredLessons = unit.lessons.filter((lesson) =>
                        lesson.title.toLowerCase().includes(search)
                    );

                    if (filteredLessons.length === 0) return null;

                    anyLessonFound = true;

                    return (
                        <View key={unit.id} style={{ marginHorizontal: 8, marginBottom: 40, position: 'relative' }}>
                            {/* Unit Header with Dot */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 24 }}>
                                <View
                                    style={{
                                        position: 'absolute',
                                        left: -23,
                                        top: 26,
                                        width: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        backgroundColor: '#3B82F6',
                                    }}
                                />
                                <UnitHeader
                                    title={unit.title}
                                    description={unit.description || ''}
                                    progress={`${unit.progress}/${unit.lessons.length}`}
                                    imageUrl={unit.imageUrl || ''}
                                />
                            </View>

                            {/* Filtered Lessons */}
                            {filteredLessons.map((lesson) => (
                                <View key={lesson.id} style={{ marginLeft: 24, marginTop: 16 }}>
                                    <LessonComponent
                                        id={lesson.id}
                                        title={lesson.title}
                                        description={lesson.description || ''}
                                        icon={lesson.icon || ''}
                                        type={lesson.type || 'sign'}
                                        status={lesson.status}
                                        isLiked={lesson.isLiked}
                                    />
                                </View>
                            ))}
                        </View>
                    );
                })
            )}

            {!showLikedOnly && !anyLessonFound && (
                <View className="items-center justify-center py-16">
                    <Text className="text-muted text-lg">No lessons found for your search.</Text>
                </View>
            )}
        </ScrollView>
    );
}