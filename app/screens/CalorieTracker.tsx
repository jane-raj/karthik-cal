import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { supabase } from '../services/supabase';
import { analyzeFoodImage } from '../services/googleGeminiService';
import { getNutritionData } from '../services/deepSeekService';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera'; // Importing expo-camera

const CalorieTracker = () => {
  const [foodImage, setFoodImage] = useState<string | null>(null);
  const [foodItem, setFoodItem] = useState<string>('');

  const handleUploadFoodImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Updated to use 'All'
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoodImage(result.assets[0].uri);
      try {
        const analysisResult = await analyzeFoodImage(result.assets[0].uri);
        setFoodItem(analysisResult.foodItem); // Set the identified food item
        Alert.alert('Success', 'Food image analyzed successfully!');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleTrackCalories = async () => {
    try {
      const response = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY&ingr=${foodItem}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const calorieCount = data.calories; // Get calorie count from the response
      Alert.alert('Success', `Calories: ${calorieCount}`);
    } catch (error) {
      Alert.alert('Tracking Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Food Image" onPress={handleUploadFoodImage} />
      {foodImage && <Image source={{ uri: foodImage }} style={{ width: 200, height: 200 }} />}
      {foodItem && <Text>Identified Food Item: {foodItem}</Text>}
      <Button title="Track Calories" onPress={handleTrackCalories} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default CalorieTracker;