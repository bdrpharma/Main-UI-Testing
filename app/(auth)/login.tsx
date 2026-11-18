import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

import { useRouter } from 'expo-router';

import Header from '@/src/components/Header';
import CustomInput from '@/src/components/CustomInput';
import CustomButton from '@/src/components/CustomButton';

import { colors } from '@/src/constants/colors';
import { useAuthContext } from '@/src/context/AuthContext';

export default function Login() {
  const [phone, setPhone] = useState('');

  const r = useRouter();

  const { role } = useAuthContext();

  const handleSendOtp = () => {
    const mobile = phone.trim();

    if (!mobile) {
      Alert.alert(
        'Mobile Number Required',
        'Please enter your mobile number.'
      );
      return;
    }

    if (!/^\d+$/.test(mobile)) {
      Alert.alert(
        'Invalid Mobile Number',
        'Only numbers are allowed.'
      );
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert(
        'Invalid Mobile Number',
        'Enter a valid 10 digit mobile number.'
      );
      return;
    }

    r.push({
      pathname: '/(auth)/otp',
      params: {
        phone: mobile,
      },
    });
  };

  return (
    <View style={s.root}>
      <Header
        title={
          role === 'doctor'
            ? 'Login as Doctor'
            : 'Login as User'
        }
      />

      <View style={s.content}>
        <Text style={s.title}>
          Enter your mobile number to continue
        </Text>

        <CustomInput
          label="Mobile Number"
          placeholder="9876543210"
          value={phone}
          onChangeText={(text) =>
            setPhone(text.replace(/\D/g, ''))
          }
          keyboardType="phone-pad"
        />

        <CustomButton
          title="Send OTP"
          onPress={handleSendOtp}
        />

        <Text style={s.note}>
          We will send a 6 digit OTP to your mobile number
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    padding: 22,
  },

  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 22,
  },

  note: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.muted,
    marginTop: 10,
  },
});