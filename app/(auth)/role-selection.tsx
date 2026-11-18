import React from 'react'; 
import { useAuthContext } from '@/src/context/AuthContext';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { colors, shadow } from '@/src/constants/colors';
import Header from '@/src/components/Header';
export default function Role() {
  const r = useRouter();
  const { setRole } = useAuthContext();
return <View style={s.root}>
    <Header title="Welcome to BDR Healthcare" />
    <View style={s.content}><Text style={s.sub}>Choose how you want to continue</Text>
    <Pressable style={s.card} onPress={() => {
  setRole('user');
  r.push('/(auth)/login');
}}><Ionicons name="person" size={36} color={colors.primary} /><Text style={s.title}>I am a User</Text><Text style={s.desc}>For your health & wellness</Text></Pressable><Pressable style={s.card} onPress={() => {
  setRole('doctor');
  r.push('/(auth)/login');
}}><Ionicons name="medkit" size={36} color={colors.green} />
    <Text style={s.title}>I am a Doctor</Text><Text style={s.desc}>For HCPs & Medical Professionals</Text></Pressable><Text style={s.login}>Already have an account? <Text onPress={() => r.push('/(auth)/login')} style={{ color: colors.primary, fontWeight: '800' }}>Login</Text></Text></View></View> }
const s = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.bg }, content: { padding: 20, alignItems: 'center' }, sub: { color: colors.muted, marginBottom: 22 }, card: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 22, alignItems: 'center', marginBottom: 14, ...shadow }, title: { fontWeight: '900', color: colors.text, fontSize: 17, marginTop: 10 }, desc: { color: colors.muted, fontSize: 12, marginTop: 4 }, login: { marginTop: 14, color: colors.muted, fontSize: 12 } });
