import { useCourseStore } from '@/stores/useCourseStore';
import { useSearchStore } from '@/stores/useSearchStore';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import LessonComponent from '../Cards/LessonCard';
import UnitHeader from '../Cards/UnitHeader';

export default function TimelineComponent() {
  const search = useSearchStore(state => state.value.toLowerCase().trim());
  const units = useCourseStore(state => state.units);
  const loading = useCourseStore(state => state.loading);

  // Track if any lesson matched
  let anyLessonFound = false;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <Text className="text-lg text-muted">Tegereza gato...</Text>
      </View>
    );
  }

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

      {/* Units and Lessons */}
      {units.map((unit) => {
        const filteredLessons = unit.lessons.filter(lesson =>
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
                description={unit.description}
                progress={unit.progress ?? ''}
                imageUrl={unit.imageUrl ?? ''}
              />
            </View>

            {/* Filtered Lessons */}
            {filteredLessons.map((lesson) => (
              <View key={lesson.id} style={{ marginLeft: 24, marginTop: 16 }}>
                <LessonComponent
                  id={lesson.id}
                  title={lesson.title}
                  description={lesson.description}
                  icon={lesson.icon ?? ''}
                  status={lesson.status}
                />
              </View>
            ))}
          </View>
        );
      })}

      {/* Empty state message */}
      {!anyLessonFound && (
        <View className="items-center justify-center py-16">
          <Text className="text-muted text-lg">Nta somo wabonye ku byo washyizemo.</Text>
        </View>
      )}
    </ScrollView>
  );
}