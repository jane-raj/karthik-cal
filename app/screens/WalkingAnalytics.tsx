import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';

const WalkingAnalytics = () => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0); // in kilometers
  const [walkingStats, setWalkingStats] = useState([]);

  const handleTrackWalking = async () => {
    try {
      const { data, error } = await supabase
        .from('walking_stats')
        .insert([{ steps, distance }]);

      if (error) throw error;

      Alert.alert('Success', 'Walking data tracked successfully!');
    } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred';
      Alert.alert('Tracking Error', errorMessage);
    }
  };

  const fetchWalkingStats = async () => {
    const response = await fetch('http://localhost:5000/fetch-walking-stats');
    const data = await response.json();
    if (!response.ok) {
      Alert.alert('Error fetching walking stats', data.error);
    } else {
      setWalkingStats(data);
    }
  };

  useEffect(() => {
    fetchWalkingStats();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter steps"
        value={steps.toString()}
        onChangeText={text => setSteps(Number(text))}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Enter distance (km)"
        value={distance.toString()}
        onChangeText={text => setDistance(Number(text))}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Track Walking" onPress={handleTrackWalking} />
      {/* Display walking stats here if needed */}
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

export default WalkingAnalytics; 