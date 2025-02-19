import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../../src/services/supabase';
import axios from 'axios';

const Subscription = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan) => {
    setLoading(true);
    const amount = plan === 'monthly' ? 1500 : 3000; // Amount in cents

    try {
      const response = await axios.post('http://localhost:5000/create-payment-intent', {
        amount,
      });
      console.log('Payment Intent:', response.data);

      // Store subscription details in Supabase
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert([{ subscription_status: plan, stripe_payment_history: response.data }]);

      if (insertError) throw insertError;

      Alert.alert('Success', 'Subscription successful!');
    } catch (error) {
      console.error('Error creating payment intent:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Subscription Plan</Text>
      <Button title="Monthly Subscription - $15" onPress={() => handleSubscribe('monthly')} disabled={loading} />
      <Button title="Yearly Subscription - $30" onPress={() => handleSubscribe('yearly')} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Subscription; 