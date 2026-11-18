import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import BottomNav from '../../src/components/BottomNav';
import { colors } from '../../src/constants/colors';

export default function SupportScreen() {
  const router = useRouter();

  const handleCallSupport = () => {
    Linking.openURL('tel:+911800123456');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@bdrpharma.com?subject=App%20Support%20Request');
  };

  return (
    <Screen>
      <Header title="Support Center" back />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.banner}>
          <Ionicons name="headset-outline" size={48} color={colors.primary} />
          <Text style={styles.bannerTitle}>How can we assist you?</Text>
          <Text style={styles.bannerSubtitle}>
            Our medical helpdesk and customer care teams are available to support you.
          </Text>
        </View>

        <Text style={styles.sectionHeading}>Help Resources</Text>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => router.push('/support/faq')}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="help-circle-outline" size={26} color={colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Frequently Asked Questions</Text>
            <Text style={styles.cardDesc}>Browse instant answers from our knowledge base</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => router.push('/support/chatbot')}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="chatbubbles-outline" size={26} color={colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Live Assistant Chat</Text>
            <Text style={styles.cardDesc}>Chat with our automated support agent</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <Text style={styles.sectionHeading}>Direct Contact</Text>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={handleCallSupport}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="call-outline" size={26} color="#16a34a" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Toll-Free Helpline</Text>
            <Text style={styles.cardDesc}>1800-123-456 (9 AM - 7 PM)</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={handleEmailSupport}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="mail-outline" size={26} color="#2563eb" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Email Support</Text>
            <Text style={styles.cardDesc}>support@bdrpharma.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 90 },
  banner: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  bannerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginTop: 12 },
  bannerSubtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  sectionHeading: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12, marginTop: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
});