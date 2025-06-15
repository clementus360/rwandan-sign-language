import CustomButton from '@/components/UI/CustomButton';
import { usePracticeStore } from '@/stores/usePracticeStore';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PracticePage() {
  const {
    loading,
    selectedAnswer,
    feedback,
    selectAnswer,
    goToNextQuestion,
  } = usePracticeStore();

  const currentQuestion = usePracticeStore(state => state.currentQuestion());

  // Initialize player with current question video and set to loop and autoplay
  const player = useVideoPlayer(currentQuestion?.video ?? '', player => {
    player.loop = true;
    player.play(); // Start playing automatically
  });

  // Clean up player when currentQuestion changes or component unmounts
  useEffect(() => {
    return () => {
      player.pause();
      player.replace(null); // Reset the player source
    };
  }, []);

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const controlsFadeAnim = useRef(new Animated.Value(1)).current;
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);
  const [isInteractingWithControls, setIsInteractingWithControls] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Enhanced modal animations
  const successModalScale = useRef(new Animated.Value(0)).current;
  const successModalRotation = useRef(new Animated.Value(0)).current;
  const successConfetti = useRef(new Animated.Value(0)).current;
  const onboardingModalSlide = useRef(new Animated.Value(screenHeight)).current;
  const onboardingPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenPracticeOnboarding');
      if (!hasSeenOnboarding) {
        setShowOnboardingModal(true);
        await AsyncStorage.setItem('hasSeenPracticeOnboarding', 'true');
      }
    };
    usePracticeStore.getState().init(); // fetch JSON once
    checkOnboarding();
  }, []);

  // Feedback animation for wrong answers
  useEffect(() => {
    if (feedback === 'wrong' && selectedAnswer) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [feedback, selectedAnswer]);

  // Enhanced success modal animation
  useEffect(() => {
    if (feedback === 'correct') {
      setShowSuccessModal(true);

      // Bouncy scale animation
      Animated.sequence([
        Animated.timing(successModalScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(successModalScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Rotation celebration
      Animated.timing(successModalRotation, {
        toValue: 360,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Confetti effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(successConfetti, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(successConfetti, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [feedback]);

  // Enhanced onboarding modal animation
  useEffect(() => {
    if (showOnboardingModal) {
      Animated.parallel([
        Animated.spring(onboardingModalSlide, {
          toValue: 0,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(onboardingPulse, {
              toValue: 1.05,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(onboardingPulse, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }
  }, [showOnboardingModal]);

  // Video controls visibility animation
  const fadeInControls = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setControlsVisible(true);
    Animated.timing(controlsFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutControls = () => {
    if (isInteractingWithControls) {
      return;
    }
    Animated.timing(controlsFadeAnim, {
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
        fadeOutControls();
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
      fadeInControls();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isInteractingWithControls && isPlaying) {
      setupAutoHide();
    }
  }, [isInteractingWithControls]);

  const handlePlay = () => {
    if (!isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  };

  const handleVideoTap = () => {
    if (controlsVisible && isPlaying) {
      fadeOutControls();
    } else if (!controlsVisible) {
      fadeInControls();
      if (isPlaying) {
        setupAutoHide();
      }
    }
  };

  const handleModalClose = () => {
    // Reset animations
    successModalScale.setValue(0);
    successModalRotation.setValue(0);
    successConfetti.setValue(0);

    setShowSuccessModal(false);
    goToNextQuestion();
  };

  const handleOnboardingClose = () => {
    Animated.timing(onboardingModalSlide, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowOnboardingModal(false);
      onboardingModalSlide.setValue(screenHeight);
      onboardingPulse.setValue(1);
    });
  };

  const clearAsyncStorage = async () => {
    await AsyncStorage.clear();
    setShowOnboardingModal(true);
  };

  // Confetti particles component
  const ConfettiParticle = ({ delay = 0, color = '#FFC107' }) => {
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (showSuccessModal) {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }, [showSuccessModal]);

    return (
      <Animated.View
        style={{
          position: 'absolute',
          width: 6,
          height: 6,
          backgroundColor: color,
          borderRadius: 3,
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 200],
              }),
            },
            {
              rotate: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '720deg'],
              }),
            },
          ],
          opacity: animValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1, 0],
          }),
        }}
      />
    );
  };

  if (loading || !currentQuestion) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading questions...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView className="flex-1 bg-neutral">
        <View className="relative">
          <VideoView
            style={{ width: '100%', height: 360, backgroundColor: '#000' }}
            player={player}
            nativeControls={false}
            allowsFullscreen
            allowsPictureInPicture
          />
          <Animated.View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: controlsFadeAnim,
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
              onPress={handlePlay}
              onPressIn={() => setIsInteractingWithControls(true)}
              onPressOut={() => setIsInteractingWithControls(false)}
              className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary px-6 py-3 rounded-full flex-row items-center justify-center"
            >
              <Feather name={isPlaying ? 'pause' : 'play'} size={20} color="#fff" />
              <Text className="text-white font-bold ml-2">
                {isPlaying ? 'Hagarara' : 'Tangira'}
              </Text>
            </Pressable>
            <Pressable
              className="absolute bottom-3 right-4 bg-gray-300 px-3 py-1 rounded-full"
              onPressIn={() => setIsInteractingWithControls(true)}
              onPressOut={() => setIsInteractingWithControls(false)}
            >
              <Text className="text-gray-600 text-sm">Gahoro</Text>
            </Pressable>
          </Animated.View>
        </View>

        <View className="p-4 flex flex-col gap-6">
          <Text className="text-lg font-bold text-dark">
            Reba iyi videwo. Ni iki kimenyetso kiri gukorwa?
          </Text>

          <View className="flex flex-col gap-2">
            {currentQuestion?.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = feedback === 'correct' && isSelected;
              const isWrong = feedback === 'wrong' && isSelected;

              return (
                <View key={option} className="flex flex-col">
                  <Pressable
                    onPress={() => selectAnswer(option)}
                    className={`rounded-t-lg p-4 border flex-row items-center gap-3 ${isCorrect
                      ? 'border-accent bg-green-50'
                      : isWrong
                        ? 'border-primary bg-red-50 rounded-b-none'
                        : 'border-gray-300 bg-white rounded-b-lg'
                      }`}
                  >
                    <View
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${isCorrect
                        ? 'bg-accent'
                        : isWrong
                          ? 'bg-primary'
                          : 'bg-gray-300'
                        }`}
                    >
                      {isWrong ? (
                        <Feather name="x" size={20} color="#fff" />
                      ) : (
                        <Text className="text-white font-bold">{index + 1}</Text>
                      )}
                    </View>
                    <Text className="text-gray-800 text-base">{option}</Text>
                  </Pressable>

                  {isWrong && (
                    <Animated.View
                      style={{
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateY: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-20, 0],
                            }),
                          },
                        ],
                      }}
                      className="flex gap-6 bg-primary-light border border-yellow-400 px-4 py-3 rounded-b-xl mt-[-1px]"
                    >
                      <View>
                        <View className="flex flex-row gap-2">
                          <Text className="font-inter-medium text-lg">
                            Wagerageje! Ariko iri ni ijambo{' '}
                            <Text className="font-inter-bold text-dark">
                              {currentQuestion?.correctAnswer}
                            </Text>
                          </Text>
                        </View>
                        <Text className="font-inter-medium">
                          Ongera ugerageze — uko ugerageza niko wiga.
                        </Text>
                      </View>
                      <CustomButton
                        title="Gerageza indi nshuro"
                        onPress={() => selectAnswer('')}
                        icon={<Feather name="rotate-ccw" size={16} color="white" />}
                      />
                    </Animated.View>
                  )}
                </View>
              );
            })}
          </View>
          {/* Temporary Clear Button for Testing */}
          {/* <CustomButton
            title="Clear AsyncStorage"
            onPress={clearAsyncStorage}
            color="accent"
            icon={<Feather name="trash-2" size={16} color="white" />}
          /> */}
        </View>
        <View className="h-40" />
      </ScrollView>

      {/* Enhanced Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="none"
        onRequestClose={handleModalClose}
      >
        <View className="flex-1 justify-center items-center bg-black/60">
          {/* Confetti particles */}
          <View style={{ position: 'absolute', top: '30%', left: '20%' }}>
            <ConfettiParticle delay={0} color="#FFC107" />
          </View>
          <View style={{ position: 'absolute', top: '25%', left: '70%' }}>
            <ConfettiParticle delay={200} color="#10B981" />
          </View>
          <View style={{ position: 'absolute', top: '35%', left: '80%' }}>
            <ConfettiParticle delay={400} color="#F59E0B" />
          </View>
          <View style={{ position: 'absolute', top: '20%', left: '30%' }}>
            <ConfettiParticle delay={600} color="#EF4444" />
          </View>
          <View style={{ position: 'absolute', top: '40%', left: '15%' }}>
            <ConfettiParticle delay={800} color="#8B5CF6" />
          </View>

          <Animated.View
            style={{
              transform: [{ scale: successModalScale }],
            }}
            className="bg-white rounded-3xl p-8 w-4/5 max-w-sm shadow-2xl"
          >
            <View className="items-center mb-6">
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: successModalRotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }}
                className="bg-green-100 rounded-full p-4 mb-4"
              >
                <Feather name="check-circle" size={56} color="#10B981" />
              </Animated.View>

              <Text className="text-2xl font-bold text-dark mb-2">
                🎉 Wabikoze! 🎉
              </Text>

              <View className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                <Text className="text-muted text-center text-base">
                  Ni byo rwose! Iri ni ijambo
                </Text>
                <Text className="text-accent font-inter-bold text-xl text-center mt-1">
                  {currentQuestion?.correctAnswer}
                </Text>
              </View>

              <View className="flex-row mt-4 space-x-2">
                <Text style={{ fontSize: 24 }}>⭐</Text>
                <Text style={{ fontSize: 24 }}>✨</Text>
                <Text style={{ fontSize: 24 }}>🌟</Text>
              </View>
            </View>

            <CustomButton
              title="Komereza Aho!"
              onPress={handleModalClose}
              color="accent"
              icon={<Feather name="chevron-right" size={16} color="white" />}
            />
          </Animated.View>
        </View>
      </Modal>

      {/* Enhanced Onboarding Modal */}
      <Modal
        visible={showOnboardingModal}
        transparent={true}
        animationType="none"
        onRequestClose={handleOnboardingClose}
      >
        <View className="flex-1 justify-center items-center bg-black/70">
          <Animated.View
            style={{
              transform: [
                { translateY: onboardingModalSlide },
                { scale: onboardingPulse },
              ],
            }}
            className="bg-white rounded-3xl p-8 w-4/5 max-w-md shadow-2xl"
          >
            <View className="items-center mb-6">
              <View className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
                <Text style={{ fontSize: 48 }}>👋</Text>
              </View>

              <Text className="text-3xl font-bold text-dark mb-2 text-center">
                Karibu! 🎓
              </Text>

              <Text className="text-xl font-semibold text-primary text-center mb-4">
                Murakaza neza mu Myitozo!
              </Text>

              <View className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200 mb-4">
                <Text className="text-muted text-center text-base leading-6">
                  Iyi myitozo izagufasha gusubiramo no gukomeza ubumenyi bwawe bw'Ururimi rw'Amarenga.
                </Text>
              </View>
            </View>

            <View className="flex-col gap-4 mb-6">
              <View className="flex-row items-center gap-3 bg-yellow-50 rounded-xl p-3">
                <View className="bg-yellow-400 rounded-full p-2">
                  <Feather name="play" size={20} color="white" />
                </View>
                <Text className="text-gray-700 flex-1 font-medium">
                  Reba videwo y'ikimenyetso
                </Text>
              </View>

              <View className="flex-row items-center gap-3 bg-green-50 rounded-xl p-3">
                <View className="bg-green-400 rounded-full p-2">
                  <Feather name="list" size={20} color="white" />
                </View>
                <Text className="text-gray-700 flex-1 font-medium">
                  Hitamo ijambo rijyanye n'icyo kimenyetso
                </Text>
              </View>

              <View className="flex-row items-center gap-3 bg-purple-50 rounded-xl p-3">
                <View className="bg-purple-400 rounded-full p-2">
                  <Feather name="heart" size={20} color="white" />
                </View>
                <Text className="text-gray-700 flex-1 font-medium">
                  Ntucike intege! Uko wongera kugerageza ni ko urushaho kumenya
                </Text>
              </View>
            </View>

            <CustomButton
              title="Ngwino Dutangire!"
              onPress={handleOnboardingClose}
              color="primary"
              icon={<Feather name="chevron-right" size={16} color="white" />}
            />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}