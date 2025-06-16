import CustomButton from '@/components/UI/CustomButton';
import CustomHeader from '@/components/UI/CustomHeader';
import { useCourseStore } from '@/stores/useCourseStore';
import { Feather } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, Text, View } from 'react-native';

export default function LessonDetailPage() {
    const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
    const router = useRouter();

    const lesson = useCourseStore((state) => state.getLessonById(lessonId));
    const toggleLessonStatus = useCourseStore((state) => state.toggleLessonStatus);
    const toggleLessonLike = useCourseStore((state) => state.toggleLessonLike);
    const getNextLessonId = useCourseStore((state) => state.getNextLessonId);

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [controlsVisible, setControlsVisible] = useState(true);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isInteractingWithControls, setIsInteractingWithControls] = useState(false);

    // Initialize player with lesson video and set to loop
    const player = useVideoPlayer(lesson?.video ?? '', (player) => {
        player.loop = true;
        // Don't auto-play until video is loaded
    });

    // Listen to player status changes
    const { status } = useEvent(player, 'statusChange', {
        status: player.status,
    });

    // Clean up player when lessonId changes or component unmounts
    useEffect(() => {
        return () => {
            player.pause();
            player.replace(null); // Reset the player source
        };
    }, []);

    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });

    // Handle video loading status
    useEffect(() => {
        if (status === 'readyToPlay') {
            setIsVideoLoading(false);
            // Auto-play once the video is ready
            player.play();
        } else if (status === 'loading' || status === 'idle') {
            setIsVideoLoading(true);
        }
    }, [status, player]);

    const fadeIn = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        setControlsVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = () => {
        if (isInteractingWithControls) {
            return;
        }
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setControlsVisible(false);
        });
    };

    const setupAutoHide = () => {
        if (isPlaying) {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
            hideTimeoutRef.current = setTimeout(() => {
                fadeOut();
            }, 1000);
        }
    };

    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isPlaying) {
            setupAutoHide();
        } else {
            fadeIn();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (!isInteractingWithControls && isPlaying) {
            setupAutoHide();
        }
    }, [isInteractingWithControls]);

    if (!lesson) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-muted">Nta somo ribonetse.</Text>
            </View>
        );
    }

    const handlePlay = () => {
        // Prevent play/pause when video is still loading
        if (isVideoLoading) return;
        
        if (!isPlaying) {
            player.play();
        } else {
            player.pause();
        }
    };

    const handleVideoTap = () => {
        // Don't handle video tap when loading
        if (isVideoLoading) return;
        
        if (controlsVisible && isPlaying) {
            fadeOut();
        } else if (!controlsVisible) {
            fadeIn();
            if (isPlaying) {
                setupAutoHide();
            }
        }
    };

    const handleNext = () => {
        if (lesson.status === 'pending') {
            toggleLessonStatus(lesson.id);
        }
        const nextLessonId = getNextLessonId(lesson.id);
        if (nextLessonId) {
            router.push(`/learn/${nextLessonId}`);
        } else {
            router.push('/learn');
        }
    };

    return (
        <>
            <CustomHeader
                title={lesson.title}
                showBack={true}
                showNotification={true}
            />
            <ScrollView className="flex-1 bg-white">
                <View className="relative">
                    <VideoView
                        style={{ width: '100%', height: 480, backgroundColor: '#000' }}
                        player={player}
                        showsTimecodes={false}
                        nativeControls={false}
                        allowsFullscreen
                        allowsPictureInPicture
                    />
                    
                    {/* Loading overlay */}
                    {isVideoLoading && (
                        <View
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 20,
                            }}
                        >
                            <ActivityIndicator size="large" color="#F59E0B" />
                            <Text style={{ color: 'white', marginTop: 16, fontSize: 16 }}>
                                Gushakisha video...
                            </Text>
                        </View>
                    )}

                    <Animated.View
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: fadeAnim,
                        }}
                    >
                        <Pressable
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            }}
                            onPress={handleVideoTap}
                            pointerEvents="auto"
                        />
                        <Pressable
                            onPress={() => {
                                handlePlay();
                            }}
                            onPressIn={() => {
                                setIsInteractingWithControls(true);
                            }}
                            onPressOut={() => {
                                setIsInteractingWithControls(false);
                            }}
                            style={{
                                position: 'absolute',
                                top: '40%',
                                left: '50%',
                                transform: [
                                    { translateX: -0.5 * 150 },
                                    { translateY: -0.5 * 48 }
                                ],
                                backgroundColor: isVideoLoading ? 'rgba(245, 158, 11, 0.5)' : '#F59E0B',
                                paddingHorizontal: 24,
                                paddingVertical: 16,
                                borderRadius: 9999,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10,
                            }}
                            disabled={isVideoLoading}
                        >
                            {isVideoLoading ? (
                                <ActivityIndicator size={20} color="#fff" />
                            ) : (
                                <Feather name={isPlaying ? 'pause' : 'play'} size={20} color="#fff" />
                            )}
                            <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8 }}>
                                {isVideoLoading ? 'Gutegura...' : (isPlaying ? 'Hagarara' : 'Tangira')}
                            </Text>
                        </Pressable>
                        <Pressable
                            className="absolute bottom-3 right-4 bg-neutral px-3 py-1 rounded-full"
                            onPressIn={() => {
                                setIsInteractingWithControls(true);
                            }}
                            onPressOut={() => {
                                setIsInteractingWithControls(false);
                            }}
                        >
                            <Text className="text-muted text-sm">Gahoro</Text>
                        </Pressable>
                    </Animated.View>
                </View>

                <View className="flex flex-col gap-4 px-4 py-4">
                    <View className="flex-1 flex-row justify-between gap-4">
                        <View className="flex flex-col w-9/12">
                            <Text className="text-4xl font-bold text-dark w-10/12">{lesson.title}</Text>
                            <Text className="text-muted w-72 text-base text-wrap">{lesson.description}</Text>
                        </View>
                        <View className="flex flex-row items-center justify-center gap-2 rounded-full">
                            <Pressable
                                className={`flex flex-row items-center justify-center ${lesson.isLiked ? 'bg-primary' : 'border-2 border-primary'} p-2 rounded-full`}
                                onPress={() => toggleLessonLike(lesson.id)}
                            >
                                <Feather
                                    name="heart"
                                    size={12}
                                    color={lesson.isLiked ? '#ffffff' : '#F59E0B'}
                                />
                            </Pressable>
                            <Text>Kunda</Text>
                        </View>
                    </View>
                    <CustomButton
                        title="Ikimenyetso gikurikiyeho"
                        onPress={handleNext}
                        color="primary"
                        icon={<Feather name="chevron-right" size={18} color="white" />}
                    />
                </View>
                <View className="h-20" />
            </ScrollView>
        </>
    );
}