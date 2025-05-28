import { Feather } from '@expo/vector-icons'; // For the arrow icon
import { Image, Text, TouchableOpacity, View } from 'react-native';

type CardSectionProps = {
    imageSource: number | { uri: string };
    title: string;
    description: string;
    iconSource?: number | { uri: string }; // Changed from string to number or uri object
    onCTAPress: () => void;
    motifSource?: number | { uri: string };
};

export default function CardSection({
    imageSource,
    title,
    description,
    iconSource,
    onCTAPress,
    motifSource = require('@/assets/images/motif-overlay.png'), // Default motif
}: CardSectionProps) {
    return (
        <View className="relative w-80 h-48 bg-accent-dark rounded-2xl overflow-hidden mr-4">
            {/* Soft Overlay Motif */}
            <Image
                source={motifSource}
                className="absolute w-full h-full opacity-30"
                resizeMode="cover"
            />

            {/* Content Container - Main flex layout */}
            <View className="flex-1 h-full flex-row">
                {/* Left side - Image */}
                <View className="w-36 h-full justify-end">
                    <Image
                        source={imageSource}
                        style={{
                            width: '100%',
                            height: '100%',
                            marginLeft: 4, // Small margin from edge
                        }}
                        resizeMode="contain"
                    />
                </View>

                {/* Right side - Text and Icon */}
                <View className="flex-1 justify-end pb-4 pr-4 pl-2">
                    {/* Icon and Title */}
                    <View className="flex-row items-center mb-1">
                        {iconSource && (
                            <View className="bg-white rounded-full px-2 py-1">
                                <Image
                                    source={iconSource}
                                    style={{ width: 16, height: 16 }}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                        <Text className="text-white text-xl font-bold ml-1" numberOfLines={1} ellipsizeMode="tail">
                            {title}
                        </Text>
                    </View>

                    {/* Description Text */}
                    <Text
                        className="text-white text-sm mb-2"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {description}
                    </Text>

                    {/* CTA Button */}
                    <TouchableOpacity
                        onPress={onCTAPress}
                        className="w-12 h-12 bg-orange-400 rounded-full justify-center items-center"
                    >
                        <Feather name="arrow-right" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}