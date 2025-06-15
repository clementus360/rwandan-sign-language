import { useUserStore } from '@/stores/useUserStore';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Settings() {
    const { userName, userImage, setUserName, setUserImage, clearUserImage, clearUserName } = useUserStore();
    const [name, setName] = useState(userName || '');
    const [image, setImage] = useState(userImage || '');
    const [isLoading, setIsLoading] = useState(false);
    const [nameError, setNameError] = useState('');

    const validateName = (input: string) => {
        if (input.length < 2) {
            setNameError('Izina rigomba kugira byibuze inyuguti 2');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(input)) {
            setNameError("Izina rigomba kuba rigizwe n' inyuguti gusa");
            return false;
        }
        setNameError('');
        return true;
    };

    const pickImage = async () => {
        setIsLoading(true);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets[0].uri) {
            setImage(result.assets[0].uri);
            setUserImage(result.assets[0].uri);
        }
        setIsLoading(false);
    };

    const clearImage = () => {
        setImage('');
        clearUserImage();
    };

    const saveSettings = () => {
        if (!validateName(name)) return;
        if (name.trim()) setUserName(name);
        if (image) setUserImage(image);
        Alert.alert('Byakunze', 'Guhindura ifoto byakunze!');
        router.back();
    };

    const initials = (name || 'User')
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    const displayImage = image || `https://api.dicebear.com/7.x/initials/png?seed=${initials}&backgroundColor=F59E0B,10B981&size=128`;

    useEffect(() => {
        console.log('Display Image URL:', displayImage); // Debug log
    }, [displayImage]);

    return (
        <View className="flex-1 bg-white p-4">

            {/* Profile Image */}
            <View className="items-center mb-6">
                {isLoading ? (
                    <View className="w-32 h-32 rounded-full bg-gray-200 justify-center items-center">
                        <ActivityIndicator size="large" color="#10B981" />
                    </View>
                ) : (
                    <Pressable onPress={pickImage}>
                        <Image
                            source={{ uri: displayImage }}
                            className="w-32 h-32 rounded-full"
                            onError={() => console.log('Guhindura ifoto byanze:', displayImage)}
                            defaultSource={{ uri: 'https://via.placeholder.com/128' }} // Default fallback image
                        />
                    </Pressable>
                )}
                <Text className="text-muted mt-2">Kanda hano uhindure ifoto</Text>
                {image && (
                    <Pressable onPress={clearImage} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>Kuraho ifoto</Text>
                    </Pressable>
                )}
            </View>

            {/* Name Input */}
            <View className="mb-6">
                <Text className="text-dark mb-2">Name</Text>
                <TextInput
                    className={`border ${nameError ? 'border-red-500' : 'border-primary'} rounded-lg p-3 text-dark text-base`}
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        validateName(text);
                    }}
                    placeholder="Enter your name"
                    placeholderTextColor="#6B7280"
                />
                {nameError ? <Text className="text-red-500 mt-1">{nameError}</Text> : null}
            </View>

            {/* Save Button */}
            <Pressable onPress={saveSettings} style={styles.saveButton} disabled={!!nameError}>
                <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>

            {/* Logout Button */}
            {/* <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable> */}
        </View>
    );
}

const styles = StyleSheet.create({
    saveButton: {
        backgroundColor: '#10B981',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clearButton: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#EF4444',
        borderRadius: 8,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});