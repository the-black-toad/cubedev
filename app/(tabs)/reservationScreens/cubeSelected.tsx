import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCubeData } from '../../cubeContext'; // Import useCubeData

//interface CubeSelectedScreenProps {
//  route: RouteProp<{ params: { cube: CubeData } }>;
//}



export default function CubeSelectedScreen(){
  const { cubeId } = useLocalSearchParams();
  const { getCubeById } = useCubeData();
  const cube = getCubeById(Number(cubeId));
  const router = useRouter();

  // Use cubeId here
  console.log(cubeId);

  if (!cube) {
    return (
        <View style={styles.container}>
          <Text>Cube not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: cube.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{cube.title}</Text>
      <Text style={styles.description}>{cube.description}</Text>
      <Text style={styles.distance}>{cube.distance.toFixed(2)} miles away</Text>
    </View>
  );
}
/*
const CubeSelectedScreen: React.FC<CubeSelectedScreenProps> = ({ route }) => {
  const { cube } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: cube.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{cube.title}</Text>
      <Text style={styles.description}>{cube.description}</Text>
      <Text style={styles.distance}>Distance: {cube.distance.toFixed(2)} miles</Text>
      }
    </View>
  );
};
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  distance: {
    fontSize: 16,
    color: 'grey',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

// export default CubeSelectedScreen;
