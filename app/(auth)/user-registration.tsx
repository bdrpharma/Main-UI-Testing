import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  useRouter,
  useLocalSearchParams,
} from 'expo-router';

import { createUser } from '@/src/services/userService';

import Header from '@/src/components/Header';
import CustomInput from '@/src/components/CustomInput';
import CustomButton from '@/src/components/CustomButton';

import { colors } from '@/src/constants/colors';

export default function Registration() {
  const r = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your full name.');
      return;
    }

    if (name.trim().length < 3) {
      Alert.alert('Invalid Name', 'Name must be at least 3 characters.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Address Required', 'Please enter your address.');
      return;
    }

    if (address.trim().length < 10) {
      Alert.alert('Invalid Address', 'Please enter a complete address.');
      return;
    }

    if (!pinCode.trim()) {
      Alert.alert('PIN Code Required', 'Please enter your PIN code.');
      return;
    }

    if (!/^\d{6}$/.test(pinCode)) {
      Alert.alert('Invalid PIN Code', 'PIN code must be 6 digits.');
      return;
    }

    setLoading(true);

    try {
      await createUser({
        name,
        mobile: String(phone || ''),
        email,
        address,
        pin_code: pinCode,
      });

      r.replace('/(auth)/registration-success');
    } catch (error: any) {
      console.error('CREATE USER ERROR:', error);
      Alert.alert(
        'Registration Failed',
        error?.message || 'Unable to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <Header title="Complete Your Profile" />

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.sub}>
          Tell us a bit about yourself
        </Text>

        <CustomInput
          label="Full Name"
          placeholder="Anurag Tiwari"
          value={name}
          onChangeText={setName}
        />

        <CustomInput
          label="Email Address"
          placeholder="anurag@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <CustomInput
          label="Address"
          placeholder="Nalasopara East, Mumbai"
          value={address}
          onChangeText={setAddress}
        />

        <CustomInput
          label="PIN Code"
          placeholder="401209"
          value={pinCode}
          onChangeText={(text) =>
            setPinCode(text.replace(/\D/g, ''))
          }
          keyboardType="number-pad"
        />

        <CustomButton
          title={loading ? 'Creating Account...' : 'Create Account'}
          onPress={handleCreateAccount}
        />

        <Text style={s.terms}>
          By creating an account you agree to our Terms & Privacy Policy
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
  },
  sub: {
    color: colors.muted,
    marginBottom: 18,
  },
  terms: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.muted,
    marginTop: 12,
  },
});