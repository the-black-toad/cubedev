import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Button, SafeAreaView, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SearchBar from '@/components/SearchBar';

// Define a type for the cube data
interface CubeData {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  distance: number;
}

// Placeholder function to simulate fetching data from a database
const fetchCubeData = async (): Promise<CubeData[]> => {
  // Simulate an API call to fetch cube data
  return [
    { id: 1, latitude: 37.78825, longitude: -122.4324, title: 'Cube 1', description: 'Description 1', distance: 0 },
    { id: 2, latitude: 37.75825, longitude: -122.4524, title: 'Cube 2', description: 'Description 2', distance: 0 },
    { id: 3, latitude: 37.72825, longitude: -122.4524, title: 'Cube 3', description: 'Description 3', distance: 0 },
    { id: 4, latitude: 37.69825, longitude: -122.4524, title: 'Cube 4', description: 'Description 4', distance: 0 },
    { id: 5, latitude: 37.66825, longitude: -122.4524, title: 'Cube 5', description: 'Description 5', distance: 0 },
    // Add more cube data as needed
  ];
};

// Function to calculate distance using haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3958.8; // Radius of the earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in miles
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export default function ReservationsScreen() {
  //Set up the variables for the reservation screen
  const [view, setView] = useState<'map' | 'list'>('map');
  const [cubeData, setCubeData] = useState<CubeData[]>([]);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [filteredCubeData, setFilteredCubeData] = useState<CubeData[]>([]);

  //Using callback to only call functions once and save data instead of each time it renders
  const loadData = useCallback(async () => {
    const data = await fetchCubeData();
    setCubeData(data);
  }, []);

  useEffect(() => {
    //Get the users current location to focus there on map
    //First get permission to use location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      //Once we fetch the users location we will set the loading screen to false so the real map will load
      setLoading(false);
    })();

    loadData();
  }, [loadData]);

  //When the initialRegion are set we call this function to calculate
  //The distance between the user and each cube
  //Maybe change to calculate drive time not distance but more complicated that way.
  useEffect(() => {
    if (initialRegion) {
      // Calculate distances for each cube
      const updatedCubeData = cubeData.map(cube => ({
        ...cube,
        distance: calculateDistance(initialRegion.latitude, initialRegion.longitude, cube.latitude, cube.longitude),
      }));
      // Sort cubes by distance
      updatedCubeData.sort((a, b) => a.distance - b.distance);
      setCubeData(updatedCubeData);
      setFilteredCubeData(updatedCubeData);
    }
  }, [initialRegion]);


  const handleSearch = (searchText: string) => {
    // Existing search logic to filter cubeData based on searchText
  
  
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>CUBE MAP</ThemedText>
        
      <SearchBar onSearch={handleSearch} />
      </ThemedView>
      
  
      <View style={styles.container}>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          view === 'map' && initialRegion && (
            <MapView
              style={styles.map}
              showsUserLocation={true}
              initialRegion={initialRegion}
            >
          

              {cubeData.map(cube => (
                <Marker
                  key={cube.id}
                  coordinate={{ latitude: cube.latitude, longitude: cube.longitude }}
                  title={cube.title}
                  description={cube.description}
                />
              ))}
            </MapView>
          )
        )}
        {view === 'list' && (
          <SafeAreaView style={styles.scrollContainer}>
            <ThemedText type="title">Cubes to rent:</ThemedText>
            <ScrollView>
              {cubeData.map(cube => (
                <View key={cube.id} style={styles.listItem}>
                  <ThemedText type="default">{cube.title}</ThemedText>
                  <ThemedText type="default">{cube.description}</ThemedText>
                  <ThemedText type="default">Distance: {cube.distance.toFixed(2)} miles</ThemedText>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        )}
      </View>
      <View style={styles.mapOverlay}>
        <Button
          title={view === 'map' ? 'List View' : 'Map View'}
          onPress={() => setView(view === 'map' ? 'list' : 'map')}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20, // Adjust font size as needed
  },
  map: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 100,
    borderColor: '#4D9EE6',
    padding: 16,
    left: '35%',
    width: '30%',
    textAlign: 'center',
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
