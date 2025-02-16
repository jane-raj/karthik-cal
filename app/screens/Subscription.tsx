import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';

const Subscription = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan) => {
    setLoading(true);
    const amount = plan === 'monthly' ? 1500 : 3000; // Amount in cents

    try {
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
      const { user } = supabase.auth.user(); // Get the current user
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert([{ user_id: user.id, subscription_status: plan, stripe_payment_history: data }]);

      if (insertError) throw insertError;

      // Handle successful payment (e.g., show confirmation, update user status)
      Alert.alert('Success', 'Subscription successful!');
    } catch (error) {
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