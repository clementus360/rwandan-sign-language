import ArrowLeftCircleIcon from '@/assets/icons/ArrowLeftCircle';
import HeartIcon from '@/assets/icons/Heart';
import RepeatIcon from '@/assets/icons/Repeat';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function QuickActions() {

    const [activeAction, setActiveAction] = useState<number | null>(null);
    
    const quickActions = [
        {
            id: 1,
            title: "Ibyabanje",
            icon: <ArrowLeftCircleIcon width={16} height={16} />,
        },
        {
            id: 2,
            title: "Subiramo",
            icon: <RepeatIcon width={16} height={16} />,
        },
        {
            id: 3,
            title: "Ibikunzwe",
            icon: <HeartIcon width={16} height={16} />,
        },
    ]
    return (
        <View className='flex flex-col gap-4'>
            <Text className='font-nunito-bold text-2xl'>Ibikorwa byihuse</Text>
            <View className='flex-row justify-between gap-2'>
                {quickActions.map((action) => (
                    <Pressable
                        key={action.id}
                        onPressIn={() => setActiveAction(action.id)}
                        onPressOut={() => setActiveAction(null)}
                        className={`flex-1 flex-row items-center justify-center bg-white rounded-full gap-2 px-6 py-4 border ${activeAction === action.id ? 'border-primary' : 'border-gray-200'
                            }`}
                        style={({ pressed }) => [
                            {
                                elevation: pressed ? 0 : 3,
                                transform: [{ scale: pressed ? 0.98 : 1 }],
                            }
                        ]}
                    >
                        {action.icon}
                        <Text className='text-center text-sm font-inter-medium text-nowrap'>{action.title}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}