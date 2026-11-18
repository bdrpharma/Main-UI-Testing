
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import CustomInput from '../../src/components/CustomInput';
import CustomButton from '../../src/components/CustomButton';
import Loading from '../../src/components/Loading';

import { useAuth } from '../../src/hooks/useAuth';
import { supabase } from '../../src/lib/supabase';

export default function DoctorProfileScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const [doctor, setDoctor] = useState<any>(null);
  const [name, setName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [hospital, setHospital] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!supabase) return;

        const userPhone = session?.user?.phone;
        const userEmail = session?.user?.email;

        let query = supabase.from('doctors').select('*');

        if (userPhone) {
          const cleanPhone = userPhone.replace('+91', '').trim();

          query = query.or(
            `mobile.eq.${cleanPhone},mobile.eq.+91${cleanPhone}`
          );
        } else if (userEmail) {
          query = query.eq('email', userEmail);
        } else {
          setLoading(false);
          return;
        }

        const { data } = await query.maybeSingle();

        if (data) {
          setDoctor(data);
          setName(data.name || '');
          setSpeciality(
            data.speciality || data.specialization || ''
          );
          setHospital(
            data.hospital || data.clinic_name || ''
          );
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleSave = async () => {
    try {
      setSaving(true);

      if (!supabase) return;

      const userPhone = session?.user?.phone;
      const userEmail = session?.user?.email;

      let query = supabase.from('doctors').update({
        name: name,
        speciality: speciality,
        hospital: hospital,
      });

      if (userPhone) {
        const cleanPhone = userPhone.replace('+91', '').trim();

        query = query.or(
          `mobile.eq.${cleanPhone},mobile.eq.+91${cleanPhone}`
        );
      } else if (userEmail) {
        query = query.eq('email', userEmail);
      }

      const { error } = await query;

      if (error) throw error;

      Alert.alert(
        'Success',
        'Doctor Profile updated successfully!'
      );
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.message || 'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace('/(auth)/login');
  };

  if (loading || saving) {
    return <Loading />;
  }

  return (
    <Screen>
      <Header title="Doctor Profile" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.userName}>
            {name ? `Dr. ${name}` : 'Doctor'}
          </Text>

          <Text style={styles.userPhone}>
            {doctor?.mobile || session?.user?.phone || ''}
          </Text>

          <Text style={styles.verified}>
            Verified Medical Practitioner
          </Text>
        </View>

        <CustomInput
          label="Doctor Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter full name"
        />

        <CustomInput
          label="Speciality / Department"
          value={speciality}
          onChangeText={setSpeciality}
          placeholder="e.g. Oncology, Cardiology"
        />

        <CustomInput
          label="Hospital / Clinic Name"
          value={hospital}
          onChangeText={setHospital}
          placeholder="e.g. Apollo, Lilavati"
        />

        <CustomButton
          title="Update Profile"
          onPress={handleSave}
          style={styles.saveBtn}
        />

        <CustomButton
          title="Sign Out"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 90,
  },

  headerCard: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },

  userPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  verified: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 4,
    fontWeight: '600',
  },

  saveBtn: {
    marginTop: 20,
  },

  logoutBtn: {
    marginTop: 12,
    backgroundColor: '#ef4444',
  },
});
