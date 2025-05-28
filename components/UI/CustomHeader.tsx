import { useSearchStore } from '@/stores/useSearchStore';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CustomHeaderProps = {
    title?: string;
    showBack?: boolean;
    showNotification?: boolean;
    showSearch?: boolean;
    profileImage?: any; // You can replace 'any' with ImageSourcePropType if you want stricter typing
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
    const navigation = useNavigation();

    return (
        <View className={`pt-12 px-4 pb-4 bg-white`}>
            {/* Header Row */}
            <View className="flex-row items-center justify-between">
                {/* Left Side: Back or Profile */}
                {showBack ? (
                    <Pressable onPress={() => navigation.goBack()} className="p-1">
                        <Feather name="arrow-left" size={24} color="dark" />
                    </Pressable>
                ) : (
                    <View className="flex-row items-center">
                        {profileImage && (
                            <Image
                                source={profileImage}
                                className="w-16 h-16 rounded-full mr-2.5"
                            />
                        )}
                        {userName && (
                            <View>
                                <Text className="font-nunito text-xl text-dark">Wiriwe neza,</Text>
                                <Text className="font-nunito text-xl text-accent">{userName} 👋</Text>
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

                {/* Right Side: Notification Icon */}
                {showNotification && (
                    <Pressable className="p-1 relative">
                        <Feather name="menu" size={22} color="dark" />
                        {/* Red dot for notifications */}
                        {/* <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-alert rounded-full" /> */}
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
                            placeholderTextColor="muted"
                            className="flex-1 text-base text-dark"
                            onChangeText={(text) => useSearchStore.getState().setValue(text)}
                            value={useSearchStore(state => state.value)}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}