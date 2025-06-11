import { useCourseStore } from '@/stores/useCourseStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import CustomButton from '../UI/CustomButton';

interface LessonProps {
    id: string;
    title: string;
    description: string;
    icon: string;
    status: 'completed' | 'pending';
    isLiked: boolean;
    type?: 'sign' | 'story'; // New prop to switch card types
}

const LessonComponent: React.FC<LessonProps> = ({ id, title, description, icon, status, isLiked, type }) => {
    const router = useRouter();
    const toggleLessonLike = useCourseStore((state) => state.toggleLessonLike);
    const toggleLessonStatus = useCourseStore((state) => state.toggleLessonStatus);

    const handlePress = () => {
        router.push(`/learn/${id}`);
    };


    if (type === 'story') {
        return (
            <View
                className="flex flex-col gap-2"
                style={{
                    backgroundColor: '#085D41',
                    borderRadius: 10,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    marginLeft: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: status === 'completed' ? '#2a9d8f' : '#f4a261',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: "#fff" }}>{title}</Text>
                        <Text style={{ fontSize: 14, color: '#fff', marginTop: 5 }} numberOfLines={1} ellipsizeMode="tail">
                            {description}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Pressable
                            className={`p-1 rounded-full ${status === 'completed' ? 'bg-accent' : 'bg-primary'}`}
                            onPress={() => toggleLessonStatus(id)}
                        >
                            <Feather
                                name={status === 'completed' ? 'check' : 'clock'}
                                size={10}
                                color="#ffffff"
                            />
                        </Pressable>
                    </View>
                </View>
                <CustomButton
                    title={status === 'completed' ? 'Subiramo' : 'Tangira'}
                    onPress={handlePress}
                    color={status === 'completed' ? 'accent' : 'primary'}
                    size="md"
                    icon={
                        status === 'completed' ? (
                            <Feather name="repeat" size={16} color="white" />
                        ) : (
                            <Feather name="play" size={16} color="white" />
                        )
                    }
                />
            </View>
        );
    }

    return (
        <View
            className="flex flex-col gap-2"
            style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginLeft: 8,
                borderLeftWidth: 4,
                borderLeftColor: status === 'completed' ? '#2a9d8f' : '#f4a261',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 24 }} role="img" aria-label="lesson-icon">
                    {icon}
                </Text>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{title}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }} numberOfLines={1} ellipsizeMode="tail">
                        {description}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Pressable
                        className={`p-1 rounded-full ${status === 'completed' ? 'bg-accent' : 'bg-primary'}`}
                        onPress={() => toggleLessonStatus(id)}
                    >
                        <Feather
                            name={status === 'completed' ? 'check' : 'clock'}
                            size={10}
                            color="#ffffff"
                        />
                    </Pressable>
                </View>
            </View>
            <CustomButton
                title={status === 'completed' ? 'Subiramo' : 'Tangira'}
                onPress={handlePress}
                color={status === 'completed' ? 'accent' : 'primary'}
                size="md"
                icon={
                    status === 'completed' ? (
                        <Feather name="repeat" size={16} color="white" />
                    ) : (
                        <Feather name="play" size={16} color="white" />
                    )
                }
            />
        </View>
    );
};

export default LessonComponent;