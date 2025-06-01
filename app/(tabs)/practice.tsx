import CustomButton from '@/components/UI/CustomButton';
import { usePracticeStore } from '@/stores/usePracticeStore';
import { Feather } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';

export default function PracticePage() {
  const {
    loading,
    selectedAnswer,
    feedback,
    selectAnswer,
    goToNextQuestion,
  } = usePracticeStore();

  const currentQuestion = usePracticeStore(state => state.currentQuestion());

  const player = useVideoPlayer(currentQuestion?.video ?? '', player => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const controlsFadeAnim = useRef(new Animated.Value(1)).current;
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);
  const [isInteractingWithControls, setIsInteractingWithControls] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    usePracticeStore.getState().init(); // fetch JSON once
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

  // Show success modal when the answer is correct
  useEffect(() => {
    if (feedback === 'correct') {
      setShowSuccessModal(true);
    }
  }, [feedback]);

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
    setShowSuccessModal(false);
    goToNextQuestion();
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
      <ScrollView className="flex-1 bg-gray-100">
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
              className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 px-6 py-3 rounded-full flex-row items-center justify-center"
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
          <Text className="text-lg font-bold text-gray-800">
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
                            <Text className="font-inter-bold text-gray-800">
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
          {/* 
          {feedback === 'correct' && (
            <CustomButton
              title="Komeza"
              onPress={goToNextQuestion}
              color="primary"
              icon={<Feather name="chevron-right" size={16} color="white" />}
            />
          )} */}
        </View>
        <View className="h-40" />
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-6 w-4/5 max-w-sm">
            <View className="items-center mb-4">
              <Feather name="check-circle" size={48} color="#10B981" />
              <Text className="text-xl font-bold text-gray-800 mt-2">
                Wabikoze!
              </Text>
              <Text className="text-gray-600 text-center mt-1">
                Ni byo rwose! iri ni ijambo
                <Text className='text-accent font-inter-bold'> {currentQuestion?.correctAnswer}</Text>
              </Text>
            </View>
            <CustomButton
              title="Komeza"
              onPress={handleModalClose}
              color="accent"
              icon={<Feather name="chevron-right" size={16} color="white" />}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}