import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import CustomInput from '../../src/components/CustomInput';
import MedicineCard from '../../src/components/MedicineCard';
import Loading from '../../src/components/Loading';
import { supabase } from '../../src/lib/supabase';

export default function MedicinesScreen() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMedicines = async () => {
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('medicines')
        .select('*');

      console.log('LIVE DATA MEDICINES:', data);

      if (error) {
        console.error('Supabase medicines error:', error);
      }

      // Supabase columns la Card props nusar map karne
      const formatted = (data || []).map((m: any) => ({
        ...m,
        id: m.id,
        name: m.medicine_name || m.name || 'Medicine',
        composition: m.composition || '',
        manufacturer: m.company_name || m.manufacturer || 'BDR Pharmaceuticals',
        dosage: m.dosage || 'Prescription Drug',
        description: m.description || '',
      }));

      setMedicines(formatted);
      setFilteredMedicines(formatted);
    } catch (err) {
      console.error('Error fetching medicines:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text.trim()) {
      setFilteredMedicines(medicines);
    } else {
      const q = text.toLowerCase();
      const filtered = medicines.filter(
        (m) =>
          (m.name || '').toLowerCase().includes(q) ||
          (m.composition || '').toLowerCase().includes(q) ||
          (m.manufacturer || '').toLowerCase().includes(q)
      );
      setFilteredMedicines(filtered);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMedicines();
  };

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header title="Medicines" back />
      <View style={styles.searchContainer}>
        <CustomInput
          placeholder="Search by name or composition..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredMedicines}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>No medicines found.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.push({
                pathname: '/(user)/medicine-details',
                params: { id: item.id },
              });
            }}
          >
            <MedicineCard item={item} />
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchContainer: { paddingHorizontal: 16, paddingTop: 10 },
  list: { padding: 16, paddingBottom: 90 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  empty: { textAlign: 'center', color: '#6b7280', fontSize: 16 },
});