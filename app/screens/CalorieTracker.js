import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { supabase } from '../../src/services/supabase';
import { analyzeFoodImage } from '../../src/services/googleGeminiService';
import { getNutritionData } from '../../src/services/deepSeekService';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';

const CalorieTracker = () => {
  const [foodImage, setFoodImage] = useState(null);
  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionResponse] = Camera.useCameraPermissions();

  const handleUploadFoodImage = async () => {
    setLoading(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    setLoading(false);

    if (!result.canceled) {
      setFoodImage(result.assets[0].uri);
      try {
        const analysisResult = await analyzeFoodImage(result.assets[0].uri);
        setFoodItem(analysisResult.foodItem);
        Alert.alert('Success', 'Food image analyzed successfully!');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const takePhoto = async () => {
    if (!permissionResponse || permissionResponse.status !== 'granted') {
      Alert.alert('Camera permission is required to use the camera.');
      return;
    }

    setLoading(true);

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    setLoading(false);

    if (!result.canceled) {
      setFoodImage(result.assets[0].uri);
      try {
        const analysisResult = await analyzeFoodImage(result.assets[0].uri);
        setFoodItem(analysisResult.foodItem);
        Alert.alert('Success', 'Food image analyzed successfully!');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleTrackCalories = async () => {
    if (!foodItem) {
      Alert.alert('Error', 'Please identify a food item first.');
      return;
    }

    try {
      const nutritionData = await getNutritionData(foodItem);
      const calorieCount = nutritionData.calories;
      Alert.alert('Success', `Calories: ${calorieCount}`);

      const { error } = await supabase
        .from('calorie_tracking')
        .insert([{ food_item: foodItem, calories: calorieCount }]);

      if (error) {
        console.error('Supabase error:', error);
        Alert.alert('Error', 'Failed to save calorie data.');
      }
    } catch (error) {
      console.error('Tracking Error:', error);
      Alert.alert('Tracking Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a Photo" onPress={takePhoto} disabled={loading} />
      <Button title="Upload Food Image" onPress={handleUploadFoodImage} disabled={loading} />
      <Button title="Track Calories" onPress={handleTrackCalories} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {foodImage && <Image source={{ uri: foodImage }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});

export default CalorieTracker;