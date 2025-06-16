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
        description: "Amarenga si amagambo gusa, ni inzira yo kumva no gusobanukirwa umwana wawe. Uko wiga amarenga, niko urushaho kumva amarangamutima ye no kumufasha mu rugendo rwe.",
        image: 'https://res.cloudinary.com/dpfonnjv3/image/upload/v1749546987/bg2_anndpr.png',
    },
    {
        title: "Intambwe imwe ku yindi",
        description: "Twaguteguriye amasomo magufi kandi yoroshye kugira ngo wige bitakugoye. Buri munsi, wiga ikimenyetso gishya mu buryo bushimishije kandi butakuremereye.",
        image: 'https://res.cloudinary.com/dpfonnjv3/image/upload/v1749546986/bg_i6j86a.png',
    },
    {
        title: "Buri kimenyetso n' ingenzi",
        description: "Buri kimenyetso wiga cyubaka ikiraro kiguhuza n'umwana wawe. Komeza kandi wizere ko n' intambwe ntoya yatanga impinduka nini.",
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
            fill="#FFFFFF" // Match the white background
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
    const imageHeight = keyboardHeight > 0 ? height * 0.4 : height * 0.6;

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}
                >
                    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                        {/* Content Area */}
                        <GestureDetector gesture={swipeGesture}>
                            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                                {isLastStep ? (
                                    // Centered Name Input for the last step
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, backgroundColor: '#FFFFFF' }}>
                                        <View style={{ width: '100%', maxWidth: 400 }}>
                                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2A44', marginBottom: 16, textAlign: 'center' }}>
                                                Izina Ryawe
                                            </Text>
                                            <TextInput
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: '#6B4EFF',
                                                    borderRadius: 8,
                                                    padding: 16,
                                                    color: '#1F2A44',
                                                    fontSize: 16,
                                                    marginBottom: 24,
                                                    width: '100%',
                                                }}
                                                placeholder="Izina ryawe..."
                                                placeholderTextColor="#A0AEC0"
                                                value={userName}
                                                onChangeText={setUserName}
                                                returnKeyType="done"
                                                blurOnSubmit={true}
                                                autoFocus={false}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    // Onboarding Steps
                                    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                                        {/* Image Container */}
                                        <View style={{ height: imageHeight, position: 'relative', marginTop: 16, width: '100%' }}>
                                            <ImageBackground
                                                source={{ uri: onboardingSteps[currentStep].image }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode="cover" // Use cover to fill width
                                            />
                                            <CurvedMask width={width} />
                                        </View>

                                        {/* Content below image */}
                                        <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2A44', marginBottom: 16, textAlign: 'center' }}>
                                                {onboardingSteps[currentStep].title}
                                            </Text>
                                            <Text style={{ fontSize: 16, color: '#4A5568', textAlign: 'center', marginBottom: 24, lineHeight: 24 }}>
                                                {onboardingSteps[currentStep].description}
                                            </Text>

                                            {/* Progress indicators */}
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
                                                {onboardingSteps.map((_, index) => (
                                                    <View
                                                        key={index}
                                                        style={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: 6,
                                                            marginHorizontal: 4,
                                                            backgroundColor: index === currentStep ? '#6B4EFF' : '#D1D5DB',
                                                        }}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </Animated.View>
                        </GestureDetector>

                        {/* Fixed Button */}
                        <SafeAreaView edges={['bottom']} style={{ paddingHorizontal: 24, paddingBottom: 16, backgroundColor: '#FFFFFF' }}>
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