import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import Loading from '../../src/components/Loading';
import { colors } from '../../src/constants/colors';
import { supabase } from '../../src/lib/supabase';

export default function MedicineDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!supabase || !id) return;
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setMedicine(data);
      } catch (err) {
        console.error('Error fetching medicine details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header title="Medicine Details" back />
      <ScrollView contentContainerStyle={styles.container}>
        {medicine ? (
          <View style={styles.card}>
            <Text style={styles.name}>{medicine.name || medicine.brand_name || 'Medicine'}</Text>
            <Text style={styles.composition}>{medicine.composition || medicine.generic_name || ''}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionHeader}>Product Information</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Dosage / Form:</Text>
              <Text style={styles.value}>{medicine.dosage || medicine.form || 'As prescribed'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Manufacturer:</Text>
              <Text style={styles.value}>{medicine.manufacturer || 'BDR Pharmaceuticals'}</Text>
            </View>

            {medicine.description && (
              <View style={styles.descBox}>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.descText}>{medicine.description}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.notFound}>Medicine details not found.</Text>
        )}
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
  name: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  composition: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 16 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: colors.primary, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#4b5563' },
  value: { fontSize: 14, color: '#111827', fontWeight: '500' },
  descBox: { marginTop: 10 },
  descText: { fontSize: 14, color: '#4b5563', marginTop: 4, lineHeight: 22 },
  notFound: { textAlign: 'center', marginTop: 40, color: '#9ca3af' },
});