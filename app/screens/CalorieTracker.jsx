import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { supabase } from '../../src/services/supabase';
import { analyzeFoodImage } from '../../src/services/googleGeminiService';
import { getNutritionData } from '../../src/services/deepSeekService';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';

const CalorieTracker = () => {
  const [foodImage, setFoodImage] = useState(null);
  const [foodItem, setFoodItem] = useState(null);

  // Use the hook at the top level of the component
  const [permissionResponse] = Camera.useCameraPermissions();

  const handleUploadFoodImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

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

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

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
      <Button title="Take a Photo" onPress={takePhoto} />
      <Button title="Upload Food Image" onPress={handleUploadFoodImage} />
      <Button title="Track Calories" onPress={handleTrackCalories} />
      {foodImage && <Text>Food Image: {foodImage}</Text>}
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