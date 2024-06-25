import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/cube2.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Thomas is poop</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">What we are doing:</ThemedText>
        <ThemedText>
          We're <ThemedText type="defaultSemiBold">flipping the "abestos-era" interstate-highway lodging market on its head </ThemedText> with a 
          nationwide network of sleek, minimalistic 
          <ThemedText type="defaultSemiBold">
            "sleep cubes"
          </ThemedText>{' '}
          to address the <ThemedText type="defaultSemiBold"> lack of quality, affordable overnight accomodations and daytime nap spaces </ThemedText> for long-distance dirvers
        </ThemedText>
      </ThemedView>
      
    </ParallaxScrollView>
  );
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
