import { useSearchStore } from '@/stores/useSearchStore';
import { useUserStore } from '@/stores/useUserStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CustomHeaderProps = {
    title?: string;
    showBack?: boolean;
    showNotification?: boolean;
    showSearch?: boolean;
    profileImage?: any;
    userName?: string;
};

export default function CustomHeader({
    title,
    showBack = false,
    showNotification = true,
    showSearch = false,
    profileImage,
    userName,
}: CustomHeaderProps) {
    const insets = useSafeAreaInsets();
    const [menuVisible, setMenuVisible] = useState(false); // Debug state
    // console.log('setMenuVisible type:', typeof setMenuVisible); // Debug log

    const { userName: storedUserName, userImage } = useUserStore(); // Moved inside to ensure it’s defined

    const displayName = userName || storedUserName || 'User';
    const avatarUrl = userImage || `https://api.dicebear.com/7.x/initials/png?seed=${displayName}`;
    const avatarSource = { uri: avatarUrl };

    const toggleMenu = () => {
        // console.log('Toggling menu, current state:', menuVisible, 'setter:', setMenuVisible);
        setMenuVisible((prev) => !prev); // Use functional update to ensure correct state
    };

    const handleSettingsPress = () => {
        router.push('/settings');
        toggleMenu();
    };

    const handleProgressPress = () => {
        router.push('/progress');
        toggleMenu();
    };

    return (
        <View className={`pt-6 px-4 pb-4 bg-white`}>
            {/* Status Bar Space */}
            <View style={{ height: insets.top }} />

            {/* Header Row */}
            <View className="flex-row items-center justify-between">
                {/* Left Side: Back or Profile */}
                {showBack ? (
                    <Pressable onPress={() => router.back()} className="p-1">
                        <Feather name="arrow-left" size={24} color="black" />
                    </Pressable>
                ) : (
                    <View className="flex-row items-center">
                        <Image
                            source={avatarSource}
                            className="w-16 h-16 rounded-full mr-2.5"
                            onError={() => console.log('Failed to load avatar:', avatarUrl)}
                        />
                        {displayName && (
                            <View>
                                <Text className="font-nunito text-xl text-dark">Wiriwe neza,</Text>
                                <Text className="font-nunito text-xl text-accent">{displayName} 👋</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Center: Title (only when showBack is true) */}
                {title && showBack && (
                    <Text className="text-lg font-bold text-dark absolute left-1/2 -translate-x-1/2">
                        {title}
                    </Text>
                )}

                {/* Right Side: Menu Icon */}
                {showNotification && (
                    <Pressable className="p-1 relative" onPress={toggleMenu}>
                        <Feather name="menu" size={22} color="black" />
                    </Pressable>
                )}
            </View>

            {/* Search Bar (only when showSearch is true) */}
            {showSearch && (
                <View className="mt-2.5">
                    <View className="flex-row items-center bg-neutral rounded-lg px-2.5 py-2">
                        <Feather name="search" size={20} color="muted" className="mr-2" />
                        <TextInput
                            placeholder="Shakisha mu masomo"
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 text-base text-dark"
                            onChangeText={(text) => useSearchStore.getState().setValue(text)}
                            value={useSearchStore(state => state.value)}
                        />
                    </View>
                </View>
            )}

            {/* Menu (with backdrop) */}
            {menuVisible && (
                <View style={styles.menuContainer}>
                    {/* Backdrop */}
                    <TouchableWithoutFeedback onPress={toggleMenu}>
                        <View />
                    </TouchableWithoutFeedback>
                    {/* Menu */}
                    <View style={[styles.menu, { top: 60 + insets.top }]}>
                        <Pressable
                            onPress={handleSettingsPress}
                            style={styles.menuItem}
                            accessibilityLabel="Settings"
                            accessibilityRole="button"
                        >
                            <Feather name="settings" size={20} color="#000000" style={styles.menuIcon} />
                            <Text style={styles.menuText}>Hindura</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleProgressPress}
                            style={styles.menuItem}
                            accessibilityLabel="Progress"
                            accessibilityRole="button"
                        >
                            <Feather name="trending-up" size={20} color="#000000" style={styles.menuIcon} />
                            <Text style={styles.menuText}>Ibyagezweho</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        zIndex: 1000, // Base zIndex for header
        position: 'relative',
    },
    headerRow: {
        zIndex: 1001, // Ensure header row is above other content
    },
    searchContainer: {
        zIndex: 500, // Lower zIndex for search bar
    },
    searchInput: {
        zIndex: 500, // Explicitly set for TextInput
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000, // High zIndex for menu container
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent backdrop
        zIndex: 9999, // Just below menu
    },
    menu: {
        position: 'absolute',
        right: 16,
        width: 200,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        zIndex: 10000, // Ensure menu is on top
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 4,
        backgroundColor: '#F9FAFB',
    },
    menuIcon: {
        marginRight: 12,
    },
    menuText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: '500',
    },
});