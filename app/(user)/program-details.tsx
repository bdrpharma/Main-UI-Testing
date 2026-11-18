import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import CustomButton from '../../src/components/CustomButton';
import Loading from '../../src/components/Loading';
import { colors } from '../../src/constants/colors';
import { supabase } from '../../src/lib/supabase';

export default function ProgramDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        if (!supabase || !id) return;
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProgram(data);
      } catch (err) {
        console.error('Error fetching program:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header title="Program Details" back />
      <ScrollView contentContainerStyle={styles.container}>
        {program ? (
          <View style={styles.card}>
            <Text style={styles.title}>{program.title || program.name}</Text>
            <Text style={styles.category}>{program.category || 'Special Support Program'}</Text>

            <View style={styles.divider} />

            <Text style={styles.label}>Overview:</Text>
            <Text style={styles.desc}>
              {program.description || 'Program details are currently being updated.'}
            </Text>

            {program.benefits && (
              <>
                <Text style={styles.label}>Benefits:</Text>
                <Text style={styles.desc}>{program.benefits}</Text>
              </>
            )}

            <CustomButton
              title="Apply For Program"
              onPress={() => {
                router.push({
                  pathname: '/(user)/program-form',
                  params: { programId: program.id, programTitle: program.title || program.name },
                });
              }}
              style={styles.applyBtn}
            />
          </View>
        ) : (
          <Text style={styles.notFound}>Program not found.</Text>
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
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  category: { fontSize: 14, color: colors.primary, marginTop: 4, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 16 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#374151', marginTop: 12 },
  desc: { fontSize: 14, color: '#4b5563', marginTop: 4, lineHeight: 22 },
  applyBtn: { marginTop: 24 },
  notFound: { textAlign: 'center', marginTop: 40, color: '#9ca3af' },
});