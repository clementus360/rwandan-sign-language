import Onboarding from '@/components/Onboarding/Onboarding';
import { useCourseStore } from '@/stores/useCourseStore';
import { useUserStore } from '@/stores/useUserStore';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts as useInter } from '@expo-google-fonts/inter';
import { NunitoSans_400Regular, NunitoSans_700Bold, NunitoSans_800ExtraBold, useFonts as useNunito } from '@expo-google-fonts/nunito-sans';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [nunitoLoaded] = useNunito({
    NunitoSans_400Regular,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  const fontsReady = interLoaded && nunitoLoaded;
  const { userName } = useUserStore();

  useEffect(() => {
    useCourseStore.getState().init();
  }, []);

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  if (!fontsReady) return null;

  // Show onboarding if userName is not set
  if (!userName) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Onboarding />
      </>
    );
  }

  return <Slot />;
}