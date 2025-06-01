import "@/global.css";


import BookIcon from '@/assets/icons/Book';
import ChatIcon from '@/assets/icons/Chat';
import HomeIcon from '@/assets/icons/Home';
import StarIcon from '@/assets/icons/Star';
import CustomHeader from '@/components/UI/CustomHeader';
import { useUserStore } from "@/stores/useUserStore";
import { Tabs } from 'expo-router';
import React from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Custom animated tab icon component
type AnimatedTabIconProps = {
    Icon: React.ComponentType<{ width?: number; height?: number; stroke?: string }>;
    isFocused: boolean;
    activeColor: string;
    inactiveColor: string;
};

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ Icon, isFocused, activeColor, inactiveColor }) => {

    // Animation value for icon scaling
    const animatedValue = React.useRef(new Animated.Value(isFocused ? 1.2 : 1)).current;


    React.useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: isFocused ? 1.2 : 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, [isFocused, animatedValue]);

    return (
        <Animated.View
            style={{
                transform: [{ scale: animatedValue }],
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Icon
                width={24}
                height={24}
                stroke={isFocused ? activeColor : inactiveColor}
            />
        </Animated.View>
    );
};

export default function TabLayout() {
    const { userName } = useUserStore();
    const activeColor = '#10B981'; // Green color for active tab
    const inactiveColor = '#374151'; // Dark gray for inactive tabs

    const insets = useSafeAreaInsets();
    const paddingBottom = insets.bottom > 0 ? insets.bottom : 4; // fallback

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: inactiveColor,
                tabBarStyle: {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0.2,
                    borderTopColor: '#E5E7EB',
                    paddingBottom: paddingBottom,
                    paddingTop: 8,
                    height: 60 + paddingBottom, // dynamically add space for safe area
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4,
                },
                tabBarIconStyle: {
                    marginBottom: -4, // Reduce space between icon and label
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Ahabanza',
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabIcon
                            Icon={HomeIcon}
                            isFocused={focused}
                            activeColor={activeColor}
                            inactiveColor={inactiveColor}
                        />
                    ),
                    header: () => (
                        <CustomHeader
                            userName={userName || ''}
                            profileImage={require('@/assets/images/profile.jpg')}
                        />
                    ),
                    tabBarButton: (props) => {
                        // Remove any props with value null to avoid type errors
                        const filteredProps = Object.fromEntries(
                            Object.entries(props).filter(([_, v]) => v !== null)
                        );
                        return (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={{ flex: 1 }}
                                {...filteredProps}
                            />
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="learn"
                options={{
                    title: 'Amasomo',
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabIcon
                            Icon={BookIcon}
                            isFocused={focused}
                            activeColor={activeColor}
                            inactiveColor={inactiveColor}
                        />
                    ),
                    header: () => (
                        <CustomHeader
                            title="Amasomo"
                            showBack={true}
                            showNotification={true}
                            showSearch={true}
                        />
                    ),
                    tabBarButton: (props) => {
                        // Remove any props with value null to avoid type errors
                        const filteredProps = Object.fromEntries(
                            Object.entries(props).filter(([_, v]) => v !== null)
                        );
                        return (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={{ flex: 1 }}
                                {...filteredProps}
                            />
                        );
                    },
                }}
            />

            <Tabs.Screen
                name="practice"
                options={{
                    title: 'Gusubiramo',
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabIcon
                            Icon={StarIcon}
                            isFocused={focused}
                            activeColor={activeColor}
                            inactiveColor={inactiveColor}
                        />
                    ),
                    header: () => (
                        <CustomHeader
                            title="Gusubiramo"
                            showBack={true}
                            showNotification={true}
                        />
                    ),
                    tabBarButton: (props) => {
                        // Remove any props with value null to avoid type errors
                        const filteredProps = Object.fromEntries(
                            Object.entries(props).filter(([_, v]) => v !== null)
                        );
                        return (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={{ flex: 1 }}
                                {...filteredProps}
                            />
                        );
                    },
                }}
            />

            <Tabs.Screen
                name="stories"
                options={{
                    title: 'Inkuru',
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabIcon
                            Icon={ChatIcon}
                            isFocused={focused}
                            activeColor={activeColor}
                            inactiveColor={inactiveColor}
                        />
                    ),
                    header: () => (
                        <CustomHeader
                            title="Inkuru"
                            showBack={true}
                            showNotification={true}
                        />
                    ),
                    tabBarButton: (props) => {
                        // Remove any props with value null to avoid type errors
                        const filteredProps = Object.fromEntries(
                            Object.entries(props).filter(([_, v]) => v !== null)
                        );
                        return (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={{ flex: 1 }}
                                {...filteredProps}
                            />
                        );
                    },
                }}
            />

            {/* Keep the route but hide it from the tab bar */}
            <Tabs.Screen
                name="learn/[lessonId]"
                options={{
                    title: 'Learn',
                    href: null, // This prevents direct navigation from tab bar
                    headerShown: false,
                }}
            />

            {/* Keep the route but hide it from the tab bar */}
            <Tabs.Screen
                name="progress"
                options={{
                    title: 'Progress',
                    href: null, // This prevents direct navigation from tab bar
                    header: () => (
                        <CustomHeader
                            userName={userName || ''}
                            profileImage={require('@/assets/images/profile.jpg')}
                        />
                    )
                }}
            />

            {/* Keep the route but hide it from the tab bar */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    href: null, // This prevents direct navigation from tab bar
                    header: () => (
                        <CustomHeader
                            title="Hindura"
                            showBack={true}
                            showNotification={true}
                        />
                    )
                }}
            />
        </Tabs>
    );
}