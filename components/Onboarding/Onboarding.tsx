import CustomButton from '@/components/UI/CustomButton';
import { useUserStore } from '@/stores/useUserStore';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
    title: string;
    description: string;
    image: string;
}

const onboardingSteps: OnboardingStep[] = [
    {
        title: "Vugana n'umutima we",
        description: "Amarenga si amagambo gusa, ni inzira yo kumva no gusobanukirwa isi y'umwana wawe. Reka tugufashe gutangira uru rugendo rwuje urukundo no kwiyunga.",
        image: 'https://res.cloudinary.com/dpfonnjv3/image/upload/v1749546987/bg2_anndpr.png',
    },
    {
        title: "Intambwe imwe ku yindi",
        description: "Twaguteguriye amasomo magufi kandi yoroshye kugira ngo wige utababaye. Buri munsi, wiga ikimenyetso gishya mu buryo bushimishije kandi butakuremereye.",
        image: 'https://res.cloudinary.com/dpfonnjv3/image/upload/v1749546986/bg_i6j86a.png',
    },
    {
        title: "Buri kimenyetso n' ingenzi",
        description: "Buri kimenyetso wiga cyubaka ikiraro kiguhuza n'umwana wawe. Komeza kandi wizere ko intambwe ntoya ariyo itanga impinduka nini.",
        image: 'https://res.cloudinary.com/dpfonnjv3/image/upload/v1749546987/bg3_brefk2.png',
    },
];

// Curved mask component
const CurvedMask = ({ width: maskWidth }: { width: number }) => (
    <Svg
        width={maskWidth}
        height={60}
        viewBox={`0 0 ${maskWidth} 60`}
        style={{ position: 'absolute', bottom: -1, left: 0 }}
    >
        <Path
            d={`M0,60 L0,20 Q${maskWidth / 4},0 ${maskWidth / 2},10 Q${maskWidth * 3 / 4},20 ${maskWidth},0 L${maskWidth},60 Z`}
            fill="white"
        />
    </Svg>
);

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [userName, setUserName] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const { setUserName: saveUserName } = useUserStore();

    // Animation values for fade effect
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    const handleNext = () => {
        if (currentStep < onboardingSteps.length) {
            opacity.value = withTiming(0, { duration: 200 }, () => {
                runOnJS(setCurrentStep)(currentStep + 1);
                opacity.value = withTiming(1, { duration: 200 });
            });
        } else if (currentStep === onboardingSteps.length && userName.trim()) {
            saveUserName(userName);
        }
    };

    const handleSwipe = (direction: 'left' | 'right') => {
        if (direction === 'left' && currentStep < onboardingSteps.length - 1) {
            opacity.value = withTiming(0, { duration: 200 }, () => {
                runOnJS(setCurrentStep)(currentStep + 1);
                opacity.value = withTiming(1, { duration: 200 });
            });
        } else if (direction === 'right' && currentStep > 0) {
            opacity.value = withTiming(0, { duration: 200 }, () => {
                runOnJS(setCurrentStep)(currentStep - 1);
                opacity.value = withTiming(1, { duration: 200 });
            });
        }
    };

    const swipeGesture = Gesture.Pan()
        .minDistance(50)
        .onEnd((event) => {
            const threshold = 50;
            if (event.translationX < -threshold) {
                runOnJS(handleSwipe)('left');
            } else if (event.translationX > threshold) {
                runOnJS(handleSwipe)('right');
            }
        });

    const isLastStep = currentStep === onboardingSteps.length;

    // Calculate image height based on screen size and keyboard
    const imageHeight = keyboardHeight > 0 ? height * 0.45 : height * 0.65;

    return (
        <GestureHandlerRootView className="flex-1 bg-white">
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Background shapes */}
                {/* <BackgroundShapes step={currentStep} /> */}

                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
                >
                    <View className="flex-1">
                        {/* Content Area */}
                        <GestureDetector gesture={swipeGesture}>
                            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                                {isLastStep ? (
                                    // Centered Name Input
                                    <View className="flex-1 justify-center items-center px-6">
                                        <View className="w-full max-w-md">
                                            <Text className="text-2xl inter-bold text-dark mb-4 text-center">
                                                Andika izina ryawe
                                            </Text>
                                            <TextInput
                                                className="border border-primary rounded-lg p-4 text-dark mb-4 w-full text-lg"
                                                placeholder="Izina ryawe..."
                                                value={userName}
                                                onChangeText={setUserName}
                                                returnKeyType="done"
                                                blurOnSubmit={true}
                                                autoFocus={false}
                                                style={{ fontSize: 16 }}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    // Onboarding Steps with enhanced layout
                                    <View className="flex-1">
                                        {/* Image Container with curved mask */}
                                        <View style={{ height: imageHeight, position: 'relative', marginTop: 20 }}>
                                            <ImageBackground
                                                source={{ uri: onboardingSteps[currentStep].image }}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                                resizeMode="cover"
                                                imageStyle={{
                                                    resizeMode: 'cover',
                                                    alignSelf: 'flex-start'
                                                }}
                                            >
                                            </ImageBackground>
                                            {/* Curved mask at bottom */}
                                            <CurvedMask width={width} />
                                        </View>

                                        {/* Content below image */}
                                        <View className="flex-1 px-6">
                                            <Text className="text-2xl inter-bold text-dark mb-4 text-center">
                                                {onboardingSteps[currentStep].title}
                                            </Text>
                                            <Text className="text-muted text-center mb-6 text-base leading-6">
                                                {onboardingSteps[currentStep].description}
                                            </Text>

                                            {/* Progress indicators */}
                                            <View className="flex-row justify-center mb-8">
                                                {onboardingSteps.map((_, index) => (
                                                    <View
                                                        key={index}
                                                        className={`w-3 h-3 rounded-full mx-1 ${index === currentStep ? 'bg-primary' : 'bg-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </Animated.View>
                        </GestureDetector>

                        {/* Fixed Button */}
                        <SafeAreaView edges={['bottom']} style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
                            <CustomButton
                                title="Komeza"
                                onPress={handleNext}
                                disabled={isLastStep && !userName.trim()}
                                color="primary"
                                icon={<Feather name="chevron-right" size={16} color="white" />}
                            />
                        </SafeAreaView>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}