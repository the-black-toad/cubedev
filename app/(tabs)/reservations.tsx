import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, SafeAreaView, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Define a type for the cube data
interface CubeData {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
}

// Placeholder function to simulate fetching data from a database
const fetchCubeData = async (): Promise<CubeData[]> => {
  // Simulate an API call to fetch cube data
  return [
    { id: 1, latitude: 37.78825, longitude: -122.4324, title: 'Cube 1', description: 'Description 1' },
    { id: 2, latitude: 37.75825, longitude: -122.4524, title: 'Cube 2', description: 'Description 2' },
    // Add more cube data as needed
  ];
};

export default function ReservationsScreen() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [cubeData, setCubeData] = useState<CubeData[]>([]);

  useEffect(() => {
    // Fetch cube data from the database when the component mounts
    const loadData = async () => {
      const data = await fetchCubeData();
      setCubeData(data);
    };

    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ThemedView style={styles.titleContainer}>
          {/* container for the title */}
          <ThemedText type="title" style={styles.title}>CUBE MAP</ThemedText>
       
        </ThemedView>
   
        {/*container for the map */}
        <View style={styles.container}>
          {view === 'map' ? (
            <MapView
              style={styles.map}

              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
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
          ) : (
            <View style={styles.listView}>
              {/* Replace with your list view component or content */}
              {cubeData.map(cube => (
                <View key={cube.id} style={styles.listItem}>
                  <ThemedText type="default">{cube.title}</ThemedText>
                  <ThemedText type="default">{cube.description}</ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={styles.mapOverlay}>
          {/* container for the button */}
            <Button
              title={`${view === 'map' ? 'List View' : 'Map View'}`}
              onPress={() => setView(view === 'map' ? 'list' : 'map')}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
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
  buttonContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  mapContainer: {
    height: '100%', // Adjust the height as needed
    width: '100%',
    marginTop: 20,
  },
  map: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  mapOverlay: {
    position: "absolute",
    bottom: 50,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 100,
    borderColor: '#4D9EE6',
    padding: 16,
    left: "35%",
    width: "35%",
    textAlign: "center"

  },
  listView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
