
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';

import {
  useRouter,
  useLocalSearchParams,
} from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import Loading from '../../src/components/Loading';

import { colors } from '../../src/constants/colors';
import { useAuth } from '../../src/hooks/useAuth';
import { useAuthContext } from '../../src/context/AuthContext';
import { supabase } from '../../src/lib/supabase';

export default function DoctorHomeScreen() {
  const router = useRouter();

  // Doctor ID from route
  const { doctorId: routeDoctorId } =
    useLocalSearchParams<{
      doctorId?: string;
    }>();

  // Doctor ID from AuthContext
  const { doctorId: savedDoctorId } =
    useAuthContext();

  // Prefer route ID, fallback to saved ID
  const doctorId =
    routeDoctorId || savedDoctorId || undefined;

  const { session } = useAuth();

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDoctorData = useCallback(async () => {
    try {
      if (!supabase) {
        console.error(
          'Supabase client is not initialized.'
        );
        setDoctor(null);
        return;
      }

      let query = supabase
        .from('doctors')
        .select('*');

      // First preference: saved Doctor ID
      if (doctorId) {
        const numericDoctorId = Number(doctorId);

        if (!Number.isFinite(numericDoctorId)) {
          console.error('Invalid Doctor ID:', doctorId);
          setDoctor(null);
          return;
        }

        query = query.eq('id', numericDoctorId);
      } else {
        // Fallback: Supabase Auth session
        const userPhone = session?.user?.phone;
        const userEmail = session?.user?.email;

        if (userPhone) {
          const cleanPhone = userPhone
            .replace(/^\+91/, '')
            .trim();

          query = query.or(
            `mobile.eq.${cleanPhone},mobile.eq.+91${cleanPhone}`
          );
        } else if (userEmail) {
          query = query.eq('email', userEmail);
        } else {
          console.log(
            'No Doctor ID or Supabase Auth session found.'
          );

          setDoctor(null);
          return;
        }
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error(
          'Error fetching doctor from Supabase:',
          error.message
        );

        setDoctor(null);
        return;
      }

      if (!data) {
        console.log('No matching doctor record found.');
        setDoctor(null);
        return;
      }

      console.log('Doctor data:', data);
      console.log('Doctor ID:', data.id);
      console.log('Doctor status:', data.status);

      const status = String(data.status ?? '')
        .trim()
        .toLowerCase();

      // Only verified or approved doctors
      if (
        status !== 'verified' &&
        status !== 'approved'
      ) {
        setDoctor(null);

        if (status === 'pending') {
          Alert.alert(
            'Verification Pending',
            'Your doctor account is still waiting for admin verification.'
          );
        } else if (status === 'rejected') {
          Alert.alert(
            'Application Rejected',
            'Your doctor application has been rejected. Please contact support.'
          );
        } else {
          Alert.alert(
            'Account Not Verified',
            `Your current account status is: ${
              status || 'unknown'
            }. Please contact support.`
          );
        }

        return;
      }

      setDoctor(data);
    } catch (error) {
      console.error(
        'Doctor data fetch failed:',
        error
      );

      setDoctor(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [doctorId, session]);

  useEffect(() => {
    fetchDoctorData();
  }, [fetchDoctorData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDoctorData();
  };

  if (loading) {
    return <Loading />;
  }

  if (!doctor) {
    return (
      <Screen>
        <Header title="Doctor Portal" />

        <View style={styles.messageContainer}>
          <Ionicons
            name="person-circle-outline"
            size={64}
            color={colors.primary}
          />

          <Text style={styles.messageTitle}>
            Doctor Account Not Available
          </Text>

          <Text style={styles.messageText}>
            We could not load a verified doctor account.
            Please check your verification status and try again.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRefresh}
            disabled={refreshing}
          >
            <Text style={styles.retryButtonText}>
              {refreshing ? 'Loading...' : 'Try Again'}
            </Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Doctor Portal"
        right={
          <TouchableOpacity
            onPress={() =>
              router.push('/(doctor)/notifications')
            }
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.profileCard}>
          <Text style={styles.badge}>
            VERIFIED CLINICIAN
          </Text>

          <Text style={styles.docName}>
            {doctor.name
              ? doctor.name.toLowerCase().startsWith('dr.')
                ? doctor.name
                : `Dr. ${doctor.name}`
              : 'Doctor Console'}
          </Text>

          <Text style={styles.docSpeciality}>
            {doctor.speciality ||
              doctor.specialization ||
              'Healthcare Specialist'}
          </Text>

          <Text style={styles.docHospital}>
            {doctor.hospital ||
              doctor.hospital_name ||
              doctor.clinic_name ||
              doctor.address ||
              ''}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Clinical Resources
        </Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push('/(doctor)/guidelines')
            }
          >
            <Ionicons
              name="journal-outline"
              size={32}
              color={colors.primary}
            />

            <Text style={styles.cardTitle}>
              Guidelines
            </Text>

            <Text style={styles.cardDesc}>
              Clinical Protocols
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push('/(doctor)/resources')
            }
          >
            <Ionicons
              name="library-outline"
              size={32}
              color={colors.primary}
            />

            <Text style={styles.cardTitle}>
              Learning
            </Text>

            <Text style={styles.cardDesc}>
              Medical Research
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push('/(user)/medicines')
            }
          >
            <Ionicons
              name="medkit-outline"
              size={32}
              color={colors.primary}
            />

            <Text style={styles.cardTitle}>
              Medicines
            </Text>

            <Text style={styles.cardDesc}>
              Prescription Directory
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push('/(doctor)/profile')
            }
          >
            <Ionicons
              name="person-outline"
              size={32}
              color={colors.primary}
            />

            <Text style={styles.cardTitle}>
              My Profile
            </Text>

            <Text style={styles.cardDesc}>
              Credentials & Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 90,
  },

  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  docName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },

  docSpeciality: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 2,
    fontWeight: '500',
  },

  docHospital: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    elevation: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
  },

  cardDesc: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
  },

  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  messageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },

  messageText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 21,
  },

  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 20,
  },

  retryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
