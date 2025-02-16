import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/services/supabase';

const Subscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to subscribe.');
      return;
    }

    setLoading(true);
    const amount = plan === 'monthly' ? 1500 : 3000; // Amount in cents

    try {
      // Call your backend to create a payment intent
      const response = await fetch('http://localhost:5000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Store subscription details in Supabase
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert([{ user_id: user.id, subscription_status: plan, stripe_payment_history: data }]);

      if (insertError) throw insertError;

      Alert.alert('Success', 'Subscription successful!');
    } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred';
      Alert.alert('Error', errorMessage);
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