
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import Header from '@/src/components/Header';
import CustomButton from '@/src/components/CustomButton';

import { colors } from '@/src/constants/colors';
import { useAuthContext } from '@/src/context/AuthContext';

import * as UserService from '@/src/services/userService';
import * as DoctorService from '@/src/services/doctorService';

export default function Otp() {
  const [otp, setOtp] = useState('');

  const router = useRouter();
  const { phone } = useLocalSearchParams();

  const {
    role,
    setRole,
    setDoctorId,
  } = useAuthContext();

  const handleVerify = async () => {
    if (!otp.trim()) {
      Alert.alert('OTP Required', 'Please enter the OTP.');
      return;
    }

    if (otp !== '123456') {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
      return;
    }

    try {
      // DOCTOR LOGIN FLOW
      if (role === 'doctor') {
        const doctor =
          await DoctorService.getDoctorByMobile(
            String(phone)
          );

        console.log('Doctor Found:', doctor);
        console.log('Doctor Login Phone:', phone);

        if (!doctor) {
          console.log('Doctor not found. Opening registration.');

          router.replace({
            pathname: '/(auth)/doctor-registration',
            params: { phone: String(phone) },
          });

          return;
        }

        const status = String(doctor.status ?? '')
          .trim()
          .toLowerCase();

        console.log('DOCTOR STATUS:', status);
        console.log('DOCTOR ID:', doctor.id);

        if (status === 'pending') {
          router.replace('/(auth)/pending-review');
          return;
        }

        if (
          status === 'verified' ||
          status === 'approved'
        ) {
          const id = String(doctor.id);

          // SAVE DOCTOR ROLE AND ID
          setRole('doctor');
          setDoctorId(id);

          console.log('Saved Doctor ID:', id);

          router.replace({
            pathname: '/(doctor)/home',
            params: {
              doctorId: id,
            },
          });

          return;
        }

        if (status === 'rejected') {
          Alert.alert(
            'Application Rejected',
            'Please contact support.'
          );
          return;
        }

        Alert.alert(
          'Doctor Status',
          `Your current status is "${doctor.status ?? 'Unknown'}". Please contact support if your account has been verified.`
        );

        return;
      }

      // USER LOGIN FLOW
      const user =
        await UserService.getUserByMobile(
          String(phone)
        );

      console.log('User Found:', user);

      setRole('user');
      setDoctorId(null);

      if (user) {
        router.replace('/(user)/home');
        return;
      }

      router.replace({
        pathname: '/(auth)/user-registration',
        params: {
          phone: String(phone),
        },
      });

    } catch (error) {
      console.error('OTP VERIFY ERROR:', error);

      Alert.alert(
        'Login Error',
        'Unable to verify your account. Please try again.'
      );
    }
  };

  return (
    <View style={styles.root}>
      <Header title="Verify OTP" />

      <View style={styles.content}>
        <Text style={styles.title}>
          Enter the 6 digit code sent to
          {'\n'}
          +91 {phone || '9876543210'}
        </Text>

        <TextInput
          maxLength={6}
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          placeholder="1 2 3 4 5 6"
          style={styles.input}
        />

        <Text style={styles.resend}>
          Resend OTP in 00:25
        </Text>

        <CustomButton
          title="Verify & Continue"
          onPress={handleVerify}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    padding: 22,
  },

  title: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 28,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    height: 58,
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: 8,
    color: colors.text,
  },

  resend: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 11,
    marginVertical: 14,
  },
});
