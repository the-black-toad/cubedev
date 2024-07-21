import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';


//interface CubeSelectedScreenProps {
//  route: RouteProp<{ params: { cube: CubeData } }>;
//}
 
interface CubeData {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  distance: number;
  imageUrl: string;
}


export default function CubeSelectedScreen(){
  const { cubeId } = useLocalSearchParams();
 

  // Use cubeId here
  console.log(cubeId);

  return (
    // Your component JSX
    <View>
      <Text> "Test" </Text>
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
});

// export default CubeSelectedScreen;
