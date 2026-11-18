import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import ProgramCard from '../../src/components/ProgramCard';
import Loading from '../../src/components/Loading';
import { supabase } from '../../src/lib/supabase';

export default function ProgramsScreen() {
  const router = useRouter();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrograms = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      // Supabase columns la ProgramCard props nusar map karne
     const formatted = (data || []).map((p: any) => ({
  ...p,
  id: p.id,
  title: p.title || 'Program',
  description: p.short_description || p.description || '',
  category: p.program_type || p.category || 'General Care',

  // Supabase banner image
  image:
    p.banner_image_url ||
    p.image_url ||
    p.image ||
    'https://placehold.co/300x150?text=Program',
}));

      setPrograms(formatted);
    } catch (err) {
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPrograms();
  };

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header title="Patient Programs" back />
      <FlatList
        data={programs}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>No programs available</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.push({
                pathname: '/(user)/program-details',
                params: { id: item.id },
              });
            }}
          >
            <ProgramCard item={item} />
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 90 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  empty: { color: '#9ca3af', fontSize: 15 },
});