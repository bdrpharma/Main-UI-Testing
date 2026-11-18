import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  useRouter,
  useLocalSearchParams,
} from 'expo-router';

import Header from '@/src/components/Header'; 
import CustomInput from '@/src/components/CustomInput';
import CustomButton from '@/src/components/CustomButton';

import { colors } from '@/src/constants/colors';

export default function DoctorRegistration() {
  const router = useRouter();

  const { phone } = useLocalSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] =
    useState('');
  const [specialization, setSpecialization] =
    useState('');
  const [hospitalName, setHospitalName] =
    useState('');
  const [address, setAddress] =
    useState('');
  const [pinCode, setPinCode] =
    useState('');
  const [profilePhoto, setProfilePhoto] =
    useState('');

  const pickProfilePhoto = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
      });

    if (!result.canceled) {
      setProfilePhoto(
        result.assets[0].uri
      );
    }
  };

  const handleContinue = () => {
    if (!name.trim()) {
      Alert.alert(
        'Name Required',
        'Please enter your full name.'
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert(
        'Email Required',
        'Please enter your email.'
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email.'
      );
      return;
    }

    if (!registrationNumber.trim()) {
      Alert.alert(
        'Registration Number Required',
        'Please enter registration number.'
      );
      return;
    }

    if (!specialization.trim()) {
      Alert.alert(
        'Specialization Required',
        'Please enter specialization.'
      );
      return;
    }

    if (!hospitalName.trim()) {
      Alert.alert(
        'Hospital Name Required',
        'Please enter hospital name.'
      );
      return;
    }

    if (!address.trim()) {
      Alert.alert(
        'Address Required',
        'Please enter address.'
      );
      return;
    }

    if (!/^\d{6}$/.test(pinCode)) {
      Alert.alert(
        'Invalid PIN Code',
        'PIN code must be 6 digits.'
      );
      return;
    }

    if (!profilePhoto) {
      Alert.alert(
        'Profile Photo Required',
        'Please upload profile photo.'
      );
      return;
    }

    router.push({
      pathname: '/(auth)/doctor-documents',
      params: {
        phone: String(phone),
        name,
        email,
        registrationNumber,
        specialization,
        hospitalName,
        address,
        pinCode,
        profilePhoto,
      },
    });
  };

  return (
    <View style={s.root}>
      <Header title="Doctor Registration" />

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.sub}>
          Create your professional profile
        </Text>

        <Text style={s.mobileInfo}>
          Verified Mobile: +91 {phone}
        </Text>

        <CustomInput
          label="Full Name"
          placeholder="Dr. Your Name"
          value={name}
          onChangeText={setName}
        />

        <CustomInput
          label="Email"
          placeholder="doctor@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <CustomInput
          label="Registration Number"
          placeholder="MMC/2025/12345"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
        />

        <CustomInput
          label="Specialization"
          placeholder="Cardiologist"
          value={specialization}
          onChangeText={setSpecialization}
        />

        <CustomInput
          label="Hospital / Clinic Name"
          placeholder="Apollo Hospital"
          value={hospitalName}
          onChangeText={setHospitalName}
        />

        <CustomInput
          label="Address"
          placeholder="Full Clinic Address"
          value={address}
          onChangeText={setAddress}
        />

        <CustomInput
          label="PIN Code"
          placeholder="400001"
          value={pinCode}
          onChangeText={(text) =>
            setPinCode(text.replace(/\D/g, ''))
          }
          keyboardType="number-pad"
        />

        <Pressable
          onPress={pickProfilePhoto}
          style={s.upload}
        >
          <Text style={s.uploadTitle}>
            Upload Profile Photo
          </Text>

          <Text style={s.uploadText}>
            {profilePhoto
              ? 'Photo Selected ✅'
              : 'Tap to select image'}
          </Text>
        </Pressable>

        <CustomButton
          title="Continue to Documents"
          onPress={handleContinue}
        />
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
    paddingBottom: 40,
  },

  sub: {
    color: colors.muted,
    marginBottom: 18,
  },

  mobileInfo: {
    marginBottom: 16,
    color: colors.primary,
    fontWeight: '700',
  },

  upload: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  uploadTitle: {
    fontWeight: '800',
    color: colors.text,
  },

  uploadText: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
  },
});