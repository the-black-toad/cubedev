import { Image, StyleSheet, Platform } from 'react-native';
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  
  return <Redirect href="(tabs)/reservations" />;
  
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    marginTop: 50,
    height: 360,
    width: 400,
    bottom: 10,
    left: 0,
    position: 'relative',
  },
});
