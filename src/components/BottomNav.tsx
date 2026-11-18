
import React from 'react';

import {
  View,
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  usePathname,
  useRouter,
} from 'expo-router';

import { colors } from '@/src/constants/colors';
import { useAuthContext } from '@/src/context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    role,
    doctorId,
  } = useAuthContext();

  const isDoctor = role === 'doctor';

  const items = [
    {
      icon: 'home-outline',
      label: 'Home',
      path: isDoctor
        ? '/(doctor)/home'
        : '/(user)/home',
    },
    {
      icon: 'medkit-outline',
      label: 'Medicines',
      path: '/(user)/medicines',
    },
    {
      icon: 'calendar-outline',
      label: 'Programs',
      path: '/(user)/programs',
    },
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      path: isDoctor
        ? '/(doctor)/notifications'
        : '/(user)/notifications',
    },
    {
      icon: 'person-outline',
      label: 'Profile',
      path: isDoctor
        ? '/(doctor)/profile'
        : '/(user)/profile',
    },
  ] as const;

  const handleNavigation = (path: string) => {
    if (isDoctor) {
      router.replace({
        pathname: path as any,
        params: {
          doctorId: doctorId ?? '',
        },
      });
    } else {
      router.replace(path as any);
    }
  };

  return (
    <View style={styles.bar}>
      {items.map((item) => {
        const active =
          pathname === item.path ||
          pathname.endsWith(
            item.path.split('/').pop() || ''
          );

        return (
          <Pressable
            key={item.label}
            onPress={() => handleNavigation(item.path)}
            style={styles.item}
          >
            <Ionicons
              name={item.icon as any}
              size={21}
              color={
                active
                  ? colors.primary
                  : colors.muted
              }
            />

            <Text
              style={[
                styles.label,
                active && {
                  color: colors.primary,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 68,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 7,
  },

  item: {
    alignItems: 'center',
    minWidth: 55,
  },

  label: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 3,
    fontWeight: '700',
  },
});
