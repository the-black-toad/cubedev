import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs 
      initialRouteName="reservations"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
        <Tabs.Screen
        name="reservations"
        options={{
            title: 'Reservations',
            tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
            ),
        }}
        />
      <Tabs.Screen
        name="index"
        options={{
            href: null,
        }}
      />
      <Tabs.Screen
        name="key"
        options={{
          title: 'Key',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'key' : 'key-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
