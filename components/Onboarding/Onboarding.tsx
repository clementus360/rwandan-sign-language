import CustomButton from '@/components/UI/CustomButton';
import { useUserStore } from '@/stores/useUserStore';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
    title: string;
    description: string;
    image: string;
}

const onboardingSteps: OnboardingStep[] = [
    {
        title: 'Karibu Hashize!',
        description: "Ururimi rw'amarenga ni urufunguzo rwo kwegerana n'abavandimwe bawe.",
        image: 'https://res.cloudinary.com/dpfonnjv3/image/upload/v1741851325/social_leb6ou.png',
    },
    {
        title: 'Iga mu buryo bworoshye',
        description: "Gukoresha ibibazo, amashusho, n'amajwi by'umwimerere.",
        image: 'https://res.cloudinary.com/dpfonnjv3/image/upload/v1741851325/social_leb6ou.png',
    },
    {
        title: 'Sangira inkuru zawe',
        description: 'Shyira inkuru zawe, ushime ibyiza, hanyuma ugire amahugurwa.',
        image: 'https://res.cloudinary.com/dpfonnjv3/image/upload/v1741851325/social_leb6ou.png',
    },
];

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

    return (
        <GestureHandlerRootView className="flex-1 bg-white">
            <SafeAreaView className="flex-1" edges={['top']}>
                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
                >
                    <View className="flex-1 justify-between">
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
                                    // Onboarding Steps
                                    <View className="flex-1 pt-12 px-6">
                                        <Image
                                            source={{ uri: onboardingSteps[currentStep].image }}
                                            className="w-full rounded-lg"
                                            style={{
                                                height: keyboardHeight > 0 ? height * 0.4 : height * 0.5,
                                            }}
                                            resizeMode="cover"
                                        />
                                        <View className="p-4">
                                            <Text className="text-2xl inter-bold text-dark mb-2 text-center">
                                                {onboardingSteps[currentStep].title}
                                            </Text>
                                            <Text className="text-muted text-center mb-4 text-base leading-5">
                                                {onboardingSteps[currentStep].description}
                                            </Text>
                                            <View className="flex-row justify-center mb-4">
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