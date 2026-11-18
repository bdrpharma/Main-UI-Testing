
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import Loading from '../../src/components/Loading';
import { useAuth } from '../../src/hooks/useAuth';
import { supabase } from '../../src/lib/supabase';

export default function UserFormsScreen() {
  const { session } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubmissions = async () => {
    try {
      if (!supabase) return;

      let query = supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      const userPhone = session?.user?.phone;
      const userId = session?.user?.id;

      if (userId && userPhone) {
        query = query.or(`user_id.eq.${userId},phone.eq.${userPhone}`);
      } else if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [session]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSubmissions();
  };

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header title="My Applications" back />

      <FlatList
        data={submissions}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No applications submitted yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>
                {item.program_title || item.name || 'Application'}
              </Text>

              <View
                style={[
                  styles.badge,
                  item.status === 'approved'
                    ? styles.badgeApproved
                    : styles.badgePending,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    item.status === 'approved'
                      ? styles.textApproved
                      : styles.textPending,
                  ]}
                >
                  {item.status || 'Pending'}
                </Text>
              </View>
            </View>

            <Text style={styles.desc}>
              Patient: {item.name || 'Self'} | Age: {item.age || 'N/A'}
            </Text>

            {item.details && (
              <Text style={styles.detailsText}>{item.details}</Text>
            )}

            <Text style={styles.date}>
              Submitted on:{' '}
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : 'Recent'}
            </Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 90 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgePending: { backgroundColor: '#fef3c7' },
  badgeApproved: { backgroundColor: '#dcfce7' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  textPending: { color: '#d97706' },
  textApproved: { color: '#16a34a' },
  desc: { fontSize: 13, color: '#4b5563', marginTop: 6 },
  detailsText: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  date: { fontSize: 12, color: '#9ca3af', marginTop: 10 },
  empty: { textAlign: 'center', marginTop: 40, color: '#9ca3af' },
});
