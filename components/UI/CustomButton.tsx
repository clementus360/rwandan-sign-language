import React, { useRef } from 'react';
import { Animated, Pressable, Text, ViewStyle } from 'react-native';

type CustomButtonProps = {
    title?: string;
    onPress: () => void;
    disabled?: boolean;
    color?: string;
    size?: 'sm' | 'md' | 'lg' | 'round';
    icon?: React.ReactNode;
};

export default function CustomButton({
    title,
    onPress,
    disabled = false,
    color = 'primary',
    size = 'md',
    icon,
}: CustomButtonProps) {
    const scaleValue = useRef(new Animated.Value(1)).current;

    // Handle press down
    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 40,
            bounciness: 5,
        }).start();
    };

    // Handle release
    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 6,
        }).start();
    };

    const buttonStyles = `
    rounded-full gap-2 flex flex-row items-center justify-center
    ${disabled ? 'bg-muted' : `bg-${color} hover:bg-${color}-dark`}
    ${size === 'sm' ? 'px-3 py-1' : size === 'lg' ? 'px-6 py-3' : size === 'round' ? 'px-3 py-3':'px-4 py-3'}
  `;

    const textStyles = `
    text-white font-inter-semibold
    ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}
  `;

    return (
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <Pressable
                onPress={disabled ? undefined : onPress}
                onPressIn={disabled ? undefined : handlePressIn}
                onPressOut={disabled ? undefined : handlePressOut}
                disabled={disabled}
                className={buttonStyles}
                style={({ pressed }) => [
                    {
                        opacity: pressed ? 0.85 : 1,
                        shadowColor: pressed ? '#000' : 'transparent',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: pressed ? 0.2 : 0,
                        shadowRadius: 6,
                        elevation: pressed ? 4 : 0,
                    } as ViewStyle,
                ]}
            >
                {title && <Text className={textStyles}>{title}</Text>}
                {icon && <>{icon}</>}
            </Pressable>
        </Animated.View>
    );
}