import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  useRouter,
  useLocalSearchParams,
} from 'expo-router';

import Header from '@/src/components/Header';
import CustomButton from '@/src/components/CustomButton';

import * as DoctorService from '@/src/services/doctorService';
import * as StorageService from '@/src/services/storageService';

import { colors } from '@/src/constants/colors';

export default function DoctorDocs() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [mrc, setMrc] = useState('');
  const [idProof, setIdProof] = useState('');
  const [degree, setDegree] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickFile = async (
    setter: (value: string) => void
  ) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setter(result.assets[0].uri);
      }
    } catch (error) {
      console.error('FILE PICKER ERROR:', error);

      Alert.alert(
        'Error',
        'Unable to select the document. Please try again.'
      );
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    // Validate required documents
    if (!mrc) {
      Alert.alert(
        'Document Required',
        'Please upload Medical Registration Certificate.'
      );
      return;
    }

    if (!idProof) {
      Alert.alert(
        'Document Required',
        'Please upload ID Proof.'
      );
      return;
    }

    if (!degree) {
      Alert.alert(
        'Document Required',
        'Please upload Degree / Qualification.'
      );
      return;
    }

    // Validate doctor information
    const mobile = String(params.phone ?? '');
    const profilePhoto = String(params.profilePhoto ?? '');

    if (
      !mobile ||
      mobile === 'undefined' ||
      mobile === 'null'
    ) {
      Alert.alert(
        'Missing Information',
        'Doctor mobile number is missing. Please go back and try again.'
      );
      return;
    }

    if (
      !profilePhoto ||
      profilePhoto === 'undefined' ||
      profilePhoto === 'null'
    ) {
      Alert.alert(
        'Missing Photo',
        'Doctor profile photo is missing. Please go back and select the photo again.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(
        'StorageService exports:',
        Object.keys(StorageService)
      );

      // Verify storage service functions
      if (
        typeof StorageService.uploadDoctorProfilePhoto !== 'function'
      ) {
        throw new Error(
          'uploadDoctorProfilePhoto export is missing. Check src/services/storageService.ts.'
        );
      }

      if (
        typeof StorageService.uploadDoctorCertificate !== 'function'
      ) {
        throw new Error(
          'uploadDoctorCertificate export is missing. Check src/services/storageService.ts.'
        );
      }

      // 1. Upload profile photo
      console.log('Uploading doctor profile photo...');

      const profilePhotoUrl =
        await StorageService.uploadDoctorProfilePhoto(
          mobile,
          profilePhoto
        );

      console.log('PROFILE URL:', profilePhotoUrl);

      // 2. Upload Medical Registration Certificate
      console.log('Uploading MRC...');

      const mrcUrl =
        await StorageService.uploadDoctorCertificate(
          mobile,
          'mrc',
          mrc
        );

      console.log('MRC URL:', mrcUrl);

      // 3. Upload ID proof
      console.log('Uploading ID proof...');

      const idProofUrl =
        await StorageService.uploadDoctorCertificate(
          mobile,
          'id-proof',
          idProof
        );

      console.log('ID URL:', idProofUrl);

      // 4. Upload degree certificate
      console.log('Uploading degree certificate...');

      const degreeUrl =
        await StorageService.uploadDoctorCertificate(
          mobile,
          'degree',
          degree
        );

      console.log('DEGREE URL:', degreeUrl);

      // 5. Register doctor in Supabase
      console.log('Registering doctor...');

      await DoctorService.registerDoctor({
        name: String(params.name ?? ''),
        mobile,
        email: String(params.email ?? ''),
        registration_number: String(
          params.registrationNumber ?? ''
        ),
        specialization: String(
          params.specialization ?? ''
        ),
        hospital_name: String(
          params.hospitalName ?? ''
        ),
        address: String(params.address ?? ''),
        pin_code: String(params.pinCode ?? ''),
        profile_photo_url: profilePhotoUrl,
        medical_council_certificate_url: mrcUrl,
        qualification_certificate_url: degreeUrl,
        id_proof_url: idProofUrl,
      });

      console.log('Doctor registration successful.');

      // 6. Navigate directly after successful registration.
      // Do not wait for Alert.alert() button interaction.
      router.replace('/(auth)/pending-review');

    } catch (error: unknown) {
      console.error('DOCTOR SUBMISSION ERROR:', error);

      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.';

      Alert.alert(
        'Submission Failed',
        message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={s.root}>
      <Header title="Doctor Documents" />

      <View style={s.content}>
        <Text style={s.sub}>
          Upload your professional documents
        </Text>

        <Pressable
          onPress={() => pickFile(setMrc)}
          style={s.upload}
          disabled={isSubmitting}
        >
          <Text style={s.icon}>↑</Text>

          <View style={s.fileInfo}>
            <Text style={s.name}>
              Medical Registration Certificate
            </Text>

            <Text style={s.help}>
              {mrc ? 'Uploaded ✅' : 'Tap to upload'}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => pickFile(setIdProof)}
          style={s.upload}
          disabled={isSubmitting}
        >
          <Text style={s.icon}>↑</Text>

          <View style={s.fileInfo}>
            <Text style={s.name}>
              ID Proof
            </Text>

            <Text style={s.help}>
              {idProof ? 'Uploaded ✅' : 'Tap to upload'}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => pickFile(setDegree)}
          style={s.upload}
          disabled={isSubmitting}
        >
          <Text style={s.icon}>↑</Text>

          <View style={s.fileInfo}>
            <Text style={s.name}>
              Degree / Qualification
            </Text>

            <Text style={s.help}>
              {degree ? 'Uploaded ✅' : 'Tap to upload'}
            </Text>
          </View>
        </Pressable>

        <CustomButton
          title={
            isSubmitting
              ? 'Submitting...'
              : 'Submit For Review'
          }
          onPress={handleSubmit}
        />
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
    padding: 20,
  },

  sub: {
    color: colors.muted,
    marginBottom: 18,
  },

  upload: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  fileInfo: {
    flex: 1,
  },

  icon: {
    fontSize: 26,
    color: colors.primary,
    width: 42,
  },

  name: {
    fontWeight: '800',
    color: colors.text,
  },

  help: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 3,
  },
});