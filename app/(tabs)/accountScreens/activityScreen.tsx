import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function activityScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Activity</ThemedText>
      {/* Add activity details here */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
