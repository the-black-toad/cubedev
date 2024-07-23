import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCubeData } from '../../cubeContext';

export default function CubeSelectedScreen() {
  const { cubeId } = useLocalSearchParams();
  const { getCubeById } = useCubeData();
  const cube = getCubeById(Number(cubeId));
  const router = useRouter();

  // Use cubeId here
  console.log(cubeId);

  if (!cube) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Cube not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{cube.title}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: cube.imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.reserveButton}>
          <Text style={styles.reserveButtonText}>Reserve Now</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>Details:</Text>
        <View style={styles.detailsList}>
            <Text style={styles.detailItem}>Rooms Available: {cube.roomsAvailable}</Text>
            <Text style={styles.detailItem}>Distance: {cube.distance.toFixed(2)} Miles</Text>
            <Text style={styles.detailItem}>Price Per Night: ${cube.pricePerNight}</Text>
            <Text style={styles.detailItem}>Price Per Hour: ${cube.pricePerHour}</Text>
        </View>
      </View>
      <View style={styles.amenitiesContainer}>
        <Text style={styles.amenitiesText}>Amenities:</Text>
        <View style={styles.amenitiesList}>
          <Text style={styles.amenity}>• Pod Room</Text>
          <Text style={styles.amenity}>• Streaming Services</Text>
          <Text style={styles.amenity}>• Courtyard</Text>
          <Text style={styles.amenity}>• Gaming Rig</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#4D9EE6',
    alignItems: 'center',
    paddingBottom: 20,
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent background
    width: '100%',
    paddingVertical: 50,
    alignItems: 'center',
    position: 'absolute', // Position it on top of the image
    top: 0,
    zIndex: 1,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    top: '60%',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 10, height: 10 }, // Offset of the shadow
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 10, // Radius of the shadow blur
    elevation: 5, // Android only: elevation of the shadow
    //marginBottom: 0,
  },
  image: {
    width: '100%',
    height: 500,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    
  },
  reserveButton: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 10, height: 10 }, // Offset of the shadow
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 10, // Radius of the shadow blur
    elevation: 5, // Android only: elevation of the shadow
  },
  reserveButtonText: {
    color: '#4D9EE6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    width: '85%',
    borderRadius: 10,
    padding: 5,
    marginTop: 30,
    marginBottom: 20,
  },
  detailsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailsText: {
    fontSize: 18,
    fontWeight: 'bold',
    //marginBottom: 10,
    color: '#ffffff',
  },
  detailItem: {
    fontSize: 14,
    marginTop: 15,
    marginRight: 15,
    color: '#ffffff',
  },
  amenitiesContainer: {
    width: '85%',
    borderRadius: 10,
    padding: 5,
  },
  amenitiesText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenity: {
    color: '#ffffff',
    fontSize: 14,
    marginRight: 15,
    marginBottom: 5,
    
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
