import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import Loading from '../../src/components/Loading';
import { colors } from '../../src/constants/colors';
import { useAuth } from '../../src/hooks/useAuth';
import { supabase } from '../../src/lib/supabase';

export default function UserHomeScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      if (!supabase) return;

      const rawPhone = session?.user?.phone || session?.user?.user_metadata?.phone || '';
      const rawEmail = session?.user?.email || '';

      // Clean 10 digit number extract karne (e.g. +91 7896541352 -> 7896541352)
      const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);

      let query = supabase.from('users').select('*');

      if (cleanPhone) {
        query = query.or(`mobile.eq.${cleanPhone},mobile.ilike.%${cleanPhone}%`);
      } else if (rawEmail) {
        query = query.eq('email', rawEmail);
      } else {
        // Fallback: Shevat cha registered user aanne test sathi
        query = query.order('id', { ascending: false }).limit(1);
      }

      const { data, error } = await query;
      if (data && data.length > 0) {
        setProfile(data[0]);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [session]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header
        title="BDR Healthcare"
        right={
          <TouchableOpacity onPress={() => router.push('/(user)/notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        }
      />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.contentWrapper}>
          {/* Welcome User Card */}
          <View style={styles.welcomeBanner}>
            <View style={styles.welcomeInfo}>
              <Text style={styles.welcomeSubtitle}>Welcome Back,</Text>
              <Text style={styles.userName}>
                {profile?.name || session?.user?.phone || 'Harsh'}
              </Text>
              <Text style={styles.userPhone}>
                {profile?.mobile || profile?.email || ''}
              </Text>
            </View>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={26} color={colors.primary} />
            </View>
          </View>

          {/* Quick Services Grid */}
          <Text style={styles.sectionTitle}>Quick Services</Text>
          <View style={styles.grid}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push('/(user)/programs')}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="fitness-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Programs</Text>
              <Text style={styles.cardDesc}>Patient care plans</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push('/(user)/medicines')}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="medkit-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Medicines</Text>
              <Text style={styles.cardDesc}>Search catalog</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push('/(user)/store-finder')}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="location-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Store Finder</Text>
              <Text style={styles.cardDesc}>Locate pharmacies</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push('/(user)/forms')}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="document-text-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>My Forms</Text>
              <Text style={styles.cardDesc}>Track applications</Text>
            </TouchableOpacity>
          </View>

          {/* Health Articles Banner */}
          <TouchableOpacity
            style={styles.bannerCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(user)/blogs')}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Health Articles & Tips</Text>
              <Text style={styles.bannerSubtitle}>Read verified medical updates</Text>
            </View>
            <View style={styles.arrowCircle}>
              <Ionicons name="arrow-forward" size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    paddingBottom: 90,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 480, // Web browser var mobile app layout locked thevnyasathi
  },
  welcomeBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  welcomeInfo: { flex: 1 },
  welcomeSubtitle: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginTop: 2 },
  userPhone: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
    marginLeft: 4,
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
    paddingVertical: 22,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  cardDesc: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 4 },
  bannerCard: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  bannerTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  bannerSubtitle: { color: '#e0f2fe', fontSize: 13, marginTop: 4 },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});