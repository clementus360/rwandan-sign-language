import CustomButton from '@/components/UI/CustomButton';
import { useStoriesStore } from '@/stores/useStoriesStore';
import { formatTimestamp } from '@/utils/timestamp';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';

export default function StoriesPage() {
  const { stories, loading, init, addStory, toggleLike } = useStoriesStore();
  const [showPostModal, setShowPostModal] = useState(false);
  const [newStoryText, setNewStoryText] = useState('');
  const [newStoryImage, setNewStoryImage] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permission to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setNewStoryImage(result.assets[0].uri);
    }
  };

  const handlePostStory = () => {
    if (newStoryText.trim()) {
      addStory(newStoryText, newStoryImage);
      setNewStoryText('');
      setNewStoryImage(null);
      setShowPostModal(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView className="flex-1 bg-gray-100">
        <View className="p-4 flex flex-col gap-4">
          {stories.map(story => (
            <View key={story.id} className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2">
                <Image
                  source={{
                    uri: `https://api.dicebear.com/7.x/initials/png?seed=${story.userName}`,
                  }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View>
                  <Text className="font-bold text-gray-800">{story.userName}</Text>
                  <Text className="text-gray-500 text-sm">
                    {formatTimestamp(story.timestamp)}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-800 mb-3">{story.text}</Text>
              {story.image && (
                <Image
                  source={{ uri: story.image }}
                  className="w-full h-48 rounded-lg mb-3"
                  resizeMode="cover"
                />
              )}
              <Pressable
                className="flex-row items-center"
                onPress={() => toggleLike(story.id)}
              >
                <Feather
                  name={story.liked ? 'heart' : 'heart'}
                  size={20}
                  color={story.liked ? '#F59E0B' : '#D1D5DB'}
                />
                <Text className="ml-2 text-gray-600">{story.likes}</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <View className="h-32" />
      </ScrollView>

      <Pressable
        className="absolute bottom-32 right-6 bg-primary w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
        onPress={() => setShowPostModal(true)}
      >
        <Feather name="plus" size={32} color="white" />
      </Pressable>

      <Modal
        visible={showPostModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPostModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-8 w-11/12 max-w-md flex-1 max-h-[80%]">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Andika inkuru yawe hano
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 flex-1 text-gray-800 mb-4"
              placeholder="Andika hano..."
              multiline
              textAlignVertical="top" // Move placeholder to top
              value={newStoryText}
              onChangeText={setNewStoryText}
            />
            <Pressable
              className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-center mb-4"
              onPress={pickImage}
            >
              <Feather name="image" size={20} color="#374151" />
              <Text className="ml-2 text-gray-600">Ongeraho ifoto</Text>
            </Pressable>
            {newStoryImage && (
              <Image
                source={{ uri: newStoryImage }}
                className="w-full h-48 rounded-lg mb-4"
                resizeMode="cover"
              />
            )}
            <CustomButton
              title="Sangiza inkuru yawe"
              onPress={handlePostStory}
              color="primary"
              icon={<Feather name="chevron-right" size={16} color="white" />}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}