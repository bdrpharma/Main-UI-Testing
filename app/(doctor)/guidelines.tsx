
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

export default function DoctorGuidelinesScreen() {
  const [guidelines, setGuidelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGuidelines = async () => {
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('guidelines')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setGuidelines(data || []);
    } catch (err) {
      console.error('Error fetching guidelines:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGuidelines();
  };

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header title="Clinical Guidelines" back />

      <FlatList
        data={guidelines}
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
            No guidelines found.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.category}>
              {item.category || 'Standard Protocol'}
            </Text>

            <Text style={styles.title}>
              {item.title || 'Guideline Reference'}
            </Text>

            <Text style={styles.description}>
              {item.description || item.content || ''}
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

  category: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },

  description: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 6,
    lineHeight: 20,
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#9ca3af',
  },
});
