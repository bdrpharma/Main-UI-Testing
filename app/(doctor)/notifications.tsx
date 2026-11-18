
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';

import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import Loading from '../../src/components/Loading';
import { colors } from '../../src/constants/colors';
import { supabase } from '../../src/lib/supabase';

export default function DoctorNotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header title="Notifications" back />

      <FlatList
        data={notifications}
        keyExtractor={(item) =>
          item.id
            ? item.id.toString()
            : Math.random().toString()
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No notifications yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              {item.title || 'Update Alert'}
            </Text>

            <Text style={styles.message}>
              {item.message || item.body || ''}
            </Text>

            <Text style={styles.time}>
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
  list: {
    padding: 16,
    paddingBottom: 90,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  message: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 4,
    lineHeight: 18,
  },

  time: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#9ca3af',
  },
});
