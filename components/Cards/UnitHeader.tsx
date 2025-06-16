import React from 'react';
import { Image, Text, View } from 'react-native';

type UnitHeaderProps = {
    title: string;
    description: string;
    progress: string;
    imageUrl: string; // Renamed to imageUrl but can handle emojis or URLs
};

export default function UnitHeader({
    title,
    description,
    progress,
    imageUrl,
}: UnitHeaderProps) {

    return (
        <View className="relative w-full flex flex-row items-center justify-start gap-4 py-4">
            <Image
                src={imageUrl}
                className='rounded-full'
                style={{ width: 64, height: 64, borderRadius: 20 }}
                resizeMode="cover"
                onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
            />

            <View className="flex flex-col">
                <Text className="font-inter-bold text-xl text-dark">
                    {title}
                </Text>
                <Text className="font-inter text-xl text-muted">
                    {description}
                </Text>
            </View>

            <Text className="ml-auto font-inter text-sm text-muted">
                {progress}
            </Text>
        </View>
    );
}