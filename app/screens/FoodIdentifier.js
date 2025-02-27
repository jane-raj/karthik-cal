import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { supabase } from '../../src/services/supabase';
import { analyzeFoodImage } from '../../src/services/googleGeminiService'; // Adjust the path accordingly

const FoodIdentifier = () => {
    const [image, setImage] = useState(null);
    const [foodItem, setFoodItem] = useState(null);
    const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();

    useEffect(() => {
        if (cameraPermission?.granted === false) {
            Alert.alert('Camera permission is required to use the camera.');
        }
    }, [cameraPermission]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            identifyFood(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        if (!cameraPermission) {
            requestCameraPermission();
            return;
        }

        if (!cameraPermission.granted) {
            Alert.alert('No access to camera');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            identifyFood(result.assets[0].uri);
        }
    };

    const identifyFood = async (imageUri) => {
        try {
            const analysisResult = await analyzeFoodImage(imageUri);
            setFoodItem(analysisResult.foodItem);
            Alert.alert('Success', 'Food image analyzed successfully!');

            const { error } = await supabase
                .from('food_items')
                .insert([{ name: analysisResult.foodItem }]);

            if (error) {
                Alert.alert('Error', 'Failed to save food item to database.');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            <Button title="Take a photo" onPress={takePhoto} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            {foodItem && <Text style={styles.foodText}>Identified Food: {foodItem}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 20,
    },
    foodText: {
        fontSize: 18,
        marginTop: 10,
    },
});

export default FoodIdentifier; 