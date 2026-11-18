
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import CustomInput from '../../src/components/CustomInput';
import CustomButton from '../../src/components/CustomButton';
import StoreCard from '../../src/components/StoreCard';
import Loading from '../../src/components/Loading';
import { supabase } from '../../src/lib/supabase';

export default function StoreFinderScreen() {
  const [pincode, setPincode] = useState('');
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchStores = async () => {
    if (!pincode.trim()) {
      Alert.alert('Notice', 'Please enter a valid Pincode.');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      if (!supabase) {
        Alert.alert('Error', 'Supabase connection not available.');
        return;
      }

      const { data, error } = await supabase
        .from('medical_stores')
        .select('*')
        .eq('pin_code', pincode.trim())
        .ilike('status', 'active');

      console.log('Store Finder Data:', data);
      console.log('Store Finder Error:', error);

      if (error) throw error;

      setStores(data || []);

    } catch (err: any) {
      console.error('Store Finder Error:', err);
      Alert.alert('Error', err.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Header title="Store Finder" back />

      <View style={styles.container}>
        <View style={styles.searchBox}>
          <CustomInput
            label="Search by Pincode"
            placeholder="Enter Pincode (e.g. 400001)"
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
          />

          <CustomButton
            title="Find Stores"
            onPress={searchStores}
            style={styles.btn}
          />
        </View>

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={stores}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              searched ? (
                <Text style={styles.empty}>
                  No active medical stores found for this pincode.
                </Text>
              ) : null
            }
            renderItem={({ item }) => (
              <StoreCard
                name={item.store_name || 'Medical Store'}
                address={item.address || item.pin_code || ''}
                rating="4.5"
                open={String(item.status || '').trim().toLowerCase() === 'active'}
              />
            )}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchBox: { marginBottom: 16 },
  btn: { marginTop: 12 },
  list: { paddingBottom: 90 },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#9ca3af',
  },
});
