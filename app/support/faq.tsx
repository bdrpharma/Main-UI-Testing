import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import Loading from '../../src/components/Loading';
import BottomNav from '../../src/components/BottomNav';
import { colors } from '../../src/constants/colors';
import { supabase } from '../../src/lib/supabase';

export default function FAQScreen() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | string | null>(null);

  const fetchFaqs = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFaqs();
  };

  const toggleExpand = (id: number | string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header title="Frequently Asked Questions" back />
      <FlatList
        data={faqs}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No FAQs found.</Text>}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => toggleExpand(item.id)}
            >
              <View style={styles.questionRow}>
                <Text style={styles.question}>{item.question || item.title || 'FAQ Question'}</Text>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#6b7280"
                />
              </View>
              {isExpanded && (
                <View style={styles.answerBox}>
                  <Text style={styles.answer}>{item.answer || item.description || ''}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
      <BottomNav />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 90 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  questionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  question: { fontSize: 15, fontWeight: '600', color: '#111827', flex: 1, marginRight: 10 },
  answerBox: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  answer: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  empty: { textAlign: 'center', marginTop: 40, color: '#9ca3af' },
});