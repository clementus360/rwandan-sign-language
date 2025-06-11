import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Ellipse, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Background component with refined organic shapes and animations
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export const BackgroundShapes = ({ step }: { step: number }) => {
    // Animation values as SharedValue<number>
    const float1 = useSharedValue(0);
    const float2 = useSharedValue(0);
    const float3 = useSharedValue(0);
    const scale1 = useSharedValue(1);
    const scale2 = useSharedValue(1);
    const opacity = useSharedValue(1);

    // Start floating and pulsing animations
    useEffect(() => {
        float1.value = withRepeat(
            withTiming(10, { duration: 2000 }),
            -1,
            true
        );
        float2.value = withRepeat(
            withTiming(-10, { duration: 2500 }),
            -1,
            true
        );
        float3.value = withRepeat(
            withTiming(8, { duration: 1800 }),
            -1,
            true
        );
        scale1.value = withRepeat(
            withTiming(1.1, { duration: 2200 }),
            -1,
            true
        );
        scale2.value = withRepeat(
            withTiming(0.9, { duration: 2000 }),
            -1,
            true
        );
    }, []);

    // Animate opacity on step change
    useEffect(() => {
        opacity.value = withTiming(0, { duration: 200 }, () => {
            opacity.value = withTiming(1, { duration: 200 });
        });
    }, [step]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const getShapesForStep = (stepIndex: number) => {
        switch (stepIndex) {
            case 0:
                return (
                    <>
                        {/* Smooth flowing curve top right */}
                        <Path
                            d={`M ${width * 0.6} 0 C ${width * 0.8} ${height * 0.1} ${width * 0.9} ${height * 0.2} ${width} ${height * 0.3} L ${width} 0 Z`}
                            fill="#10B981"
                            opacity={0.15}
                        />
                        {/* Secondary overlapping curve */}
                        <Path
                            d={`M ${width * 0.7} 0 C ${width * 0.85} ${height * 0.15} ${width * 0.95} ${height * 0.25} ${width} ${height * 0.35} L ${width} 0 Z`}
                            fill="#F59E0B"
                            opacity={0.08}
                        />
                        {/* Organic shape bottom left */}
                        <Path
                            d={`M 0 ${height * 0.7} C ${width * 0.2} ${height * 0.65} ${width * 0.3} ${height * 0.75} ${width * 0.4} ${height * 0.85} C ${width * 0.3} ${height * 0.95} ${width * 0.1} ${height * 0.9} 0 ${height * 0.85} Z`}
                            fill="#F59E0B"
                            opacity={0.12}
                        />
                        {/* Floating ellipses with animation */}
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.15,
                                cy: height * 0.25 + float1.value,
                                rx: 12,
                                ry: 10,
                            }))}
                            fill="#10B981"
                            opacity={0.6}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.85,
                                cy: height * 0.6 + float2.value,
                                rx: 14,
                                ry: 12,
                            }))}
                            fill="#F59E0B"
                            opacity={0.5}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.25,
                                cy: height * 0.8 + float3.value,
                                rx: 10,
                                ry: 8,
                            }))}
                            fill="#10B981"
                            opacity={0.7}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.05,
                                cy: height * 0.15,
                                rx: 8 * scale1.value,
                                ry: 6 * scale1.value,
                            }))}
                            fill="#F59E0B"
                            opacity={0.6}
                        />
                        <AnimatedEllipse
                            cx={width * 0.9}
                            cy={height * 0.25}
                            rx={12}
                            ry={10}
                            fill="#10B981"
                            opacity={0.4}
                        />
                    </>
                );

            case 1:
                return (
                    <>
                        {/* Smooth wave from left */}
                        <Path
                            d={`M 0 ${height * 0.2} C ${width * 0.25} ${height * 0.1} ${width * 0.4} ${height * 0.15} ${width * 0.6} ${height * 0.2} C ${width * 0.8} ${height * 0.25} ${width * 0.9} ${height * 0.3} ${width} ${height * 0.25} L ${width} 0 L 0 0 Z`}
                            fill="#F59E0B"
                            opacity={0.14}
                        />
                        {/* Secondary wave */}
                        <Path
                            d={`M 0 ${height * 0.15} C ${width * 0.2} ${height * 0.05} ${width * 0.35} ${height * 0.1} ${width * 0.55} ${height * 0.15} C ${width * 0.75} ${height * 0.2} ${width * 0.85} ${height * 0.25} ${width} ${height * 0.2} L ${width} 0 L 0 0 Z`}
                            fill="#10B981"
                            opacity={0.08}
                        />
                        {/* Bottom right organic shape */}
                        <Path
                            d={`M ${width * 0.6} ${height} C ${width * 0.8} ${height * 0.9} ${width * 0.9} ${height * 0.85} ${width} ${height * 0.8} L ${width} ${height} Z`}
                            fill="#10B981"
                            opacity={0.16}
                        />
                        {/* Floating elements */}
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.2,
                                cy: height * 0.4 + float1.value,
                                rx: 16,
                                ry: 12,
                            }))}
                            fill="#F59E0B"
                            opacity={0.45}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.75,
                                cy: height * 0.15 + float2.value,
                                rx: 14,
                                ry: 10,
                            }))}
                            fill="#10B981"
                            opacity={0.55}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.1,
                                cy: height * 0.75 + float3.value,
                                rx: 12,
                                ry: 10,
                            }))}
                            fill="#10B981"
                            opacity={0.6}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.9,
                                cy: height * 0.7,
                                rx: 14 * scale2.value,
                                ry: 12 * scale2.value,
                            }))}
                            fill="#F59E0B"
                            opacity={0.4}
                        />
                        <AnimatedEllipse
                            cx={width * 0.35}
                            cy={height * 0.6}
                            rx={10}
                            ry={8}
                            fill="#10B981"
                            opacity={0.5}
                        />
                    </>
                );

            case 2:
                return (
                    <>
                        {/* Organic blob top left */}
                        <Path
                            d={`M 0 0 C ${width * 0.2} ${height * 0.05} ${width * 0.3} ${height * 0.1} ${width * 0.4} ${height * 0.05} C ${width * 0.5} ${height * 0.15} ${width * 0.3} ${height * 0.2} ${width * 0.2} ${height * 0.25} C ${width * 0.1} ${height * 0.2} 0 ${height * 0.15} 0 0 Z`}
                            fill="#10B981"
                            opacity={0.16}
                        />
                        {/* Overlapping blob */}
                        <Path
                            d={`M 0 0 C ${width * 0.15} ${height * 0.03} ${width * 0.25} ${height * 0.06} ${width * 0.35} ${height * 0.02} C ${width * 0.4} ${height * 0.1} ${width * 0.25} ${height * 0.15} ${width * 0.15} ${height * 0.18} C ${width * 0.05} ${height * 0.15} 0 ${height * 0.1} 0 0 Z`}
                            fill="#F59E0B"
                            opacity={0.1}
                        />
                        {/* Bottom curve */}
                        <Path
                            d={`M 0 ${height * 0.8} C ${width * 0.3} ${height * 0.75} ${width * 0.7} ${height * 0.7} ${width} ${height * 0.85} L ${width} ${height} L 0 ${height} Z`}
                            fill="#F59E0B"
                            opacity={0.13}
                        />
                        {/* Right side shape */}
                        <Path
                            d={`M ${width} ${height * 0.4} C ${width * 0.9} ${height * 0.45} ${width * 0.85} ${height * 0.5} ${width * 0.9} ${height * 0.6} C ${width * 0.95} ${height * 0.55} ${width} ${height * 0.6} ${width} ${height * 0.65} Z`}
                            fill="#10B981"
                            opacity={0.11}
                        />
                        {/* Floating elements */}
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.8,
                                cy: height * 0.3 + float1.value,
                                rx: 16,
                                ry: 14,
                            }))}
                            fill="#F59E0B"
                            opacity={0.5}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.9,
                                cy: height * 0.5 + float2.value,
                                rx: 12,
                                ry: 10,
                            }))}
                            fill="#10B981"
                            opacity={0.65}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.3,
                                cy: height * 0.6 + float3.value,
                                rx: 14,
                                ry: 12,
                            }))}
                            fill="#10B981"
                            opacity={0.4}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.15,
                                cy: height * 0.45,
                                rx: 12 * scale1.value,
                                ry: 10 * scale1.value,
                            }))}
                            fill="#F59E0B"
                            opacity={0.6}
                        />
                        <AnimatedEllipse
                            cx={width * 0.6}
                            cy={height * 0.2}
                            rx={10}
                            ry={8}
                            fill="#10B981"
                            opacity={0.55}
                        />
                    </>
                );

            default:
                return (
                    <>
                        {/* Top left corner accent */}
                        <Path
                            d={`M 0 0 C ${width * 0.2} ${height * 0.05} ${width * 0.3} ${height * 0.08} ${width * 0.4} ${height * 0.05} C ${width * 0.35} ${height * 0.03} ${width * 0.25} 0 0 0 Z`}
                            fill="#10B981"
                            opacity={0.12}
                        />
                        {/* Bottom right corner accent */}
                        <Path
                            d={`M ${width * 0.6} ${height} C ${width * 0.8} ${height * 0.95} ${width * 0.9} ${height * 0.9} ${width} ${height * 0.85} L ${width} ${height} Z`}
                            fill="#F59E0B"
                            opacity={0.11}
                        />
                        {/* Floating elements */}
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.1,
                                cy: height * 0.15 + float1.value,
                                rx: 12,
                                ry: 10,
                            }))}
                            fill="#10B981"
                            opacity={0.5}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.9,
                                cy: height * 0.85 + float2.value,
                                rx: 14,
                                ry: 12,
                            }))}
                            fill="#F59E0B"
                            opacity={0.45}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.15,
                                cy: height * 0.8 + float3.value,
                                rx: 10,
                                ry: 8,
                            }))}
                            fill="#F59E0B"
                            opacity={0.4}
                        />
                        <AnimatedEllipse
                            animatedProps={useAnimatedProps(() => ({
                                cx: width * 0.85,
                                cy: height * 0.2,
                                rx: 8 * scale2.value,
                                ry: 6 * scale2.value,
                            }))}
                            fill="#10B981"
                            opacity={0.6}
                        />
                    </>
                );
        }
    };

    return (
        <Animated.View style={[animatedStyle, { position: 'absolute', top: 0, left: 0 }]}>
            <Svg height={height} width={width}>
                {getShapesForStep(step)}
            </Svg>
        </Animated.View>
    );
};