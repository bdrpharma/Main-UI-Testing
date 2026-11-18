import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import CustomInput from '../../src/components/CustomInput';
import CustomButton from '../../src/components/CustomButton';
import Loading from '../../src/components/Loading';
import { useAuth } from '../../src/hooks/useAuth';
import { supabase } from '../../src/lib/supabase';

export default function ProgramFormScreen() {
  const router = useRouter();
  const { programId, programTitle } = useLocalSearchParams();
  const { session } = useAuth();

  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [contact, setContact] = useState(session?.user?.phone || '');
  const [city, setCity] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!patientName.trim() || !contact.trim()) {
      Alert.alert('Required', 'Please enter Patient Name and Contact number.');
      return;
    }

    try {
      setSubmitting(true);
      if (!supabase) return;

      const { data, error } = await supabase
        .from('form_submissions')
        .insert([
          {
            user_id: session?.user?.id || null,
            name: patientName,
            age: age ? parseInt(age) : null,
            phone: contact,
            city: city,
            details: details,
            program_id: programId ? parseInt(programId as string) : null,
            program_title: programTitle || 'Patient Support',
            status: 'pending',
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      Alert.alert('Success', 'Application submitted successfully!', [
        { text: 'OK', onPress: () => router.replace('/(user)/forms') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) return <Loading />;

  return (
    <Screen>
      <Header title="Program Application" back />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>{programTitle ? `Applying for: ${programTitle}` : 'Patient Application'}</Text>
          <Text style={styles.subheading}>Fill the details below to register.</Text>

          <CustomInput
            label="Patient Full Name"
            placeholder="Enter full name"
            value={patientName}
            onChangeText={setPatientName}
          />

          <CustomInput
            label="Age"
            placeholder="Enter age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />

          <CustomInput
            label="Contact Mobile"
            placeholder="Enter 10-digit mobile"
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
          />

          <CustomInput
            label="City"
            placeholder="Enter city"
            value={city}
            onChangeText={setCity}
          />

          <CustomInput
            label="Medical Details / Prescribed Doctor"
            placeholder="Enter diagnosis or doctor recommendation"
            value={details}
            onChangeText={setDetails}
          />

          <CustomButton
            title="Submit Application"
            onPress={handleSubmit}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  subheading: { fontSize: 13, color: '#6b7280', marginTop: 2, marginBottom: 16 },
  submitBtn: { marginTop: 20 },
});