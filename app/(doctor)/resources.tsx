
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

export default function DoctorResourcesScreen() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchResources = async () => {
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setResources(data || []);
    } catch (err) {
      console.error('Error fetching learning resources:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResources();
  };

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header title="Learning Resources" back />

      <FlatList
        data={resources}
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
            No learning resources found.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.topic}>
              {item.topic || item.type || 'Publication'}
            </Text>

            <Text style={styles.title}>
              {item.title || 'Medical Study'}
            </Text>

            <Text style={styles.desc}>
              {item.description || item.abstract || ''}
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

  topic: {
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

  desc: {
    fontSize: 13,
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
