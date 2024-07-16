import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Button, SafeAreaView, ScrollView, StatusBar, Alert, ActivityIndicator, Image } from 'react-native';
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
  imageUrl: string;
}

// Placeholder function to simulate fetching data from a database
const fetchCubeData = async (): Promise<CubeData[]> => {
  // Simulate an API call to fetch cube data
  return [
    { id: 1, latitude: 37.78825, longitude: -122.4324, title: 'Cube 1', description: 'Description 1', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7" },
    { id: 2, latitude: 37.75825, longitude: -122.4524, title: 'Cube 2', description: 'Description 2', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7" },
    { id: 3, latitude: 37.72825, longitude: -122.4524, title: 'Cube 3', description: 'Description 3', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7" },
    { id: 4, latitude: 37.69825, longitude: -122.4524, title: 'Cube 4', description: 'Description 4', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7" },
    { id: 5, latitude: 37.66825, longitude: -122.4524, title: 'Cube 5', description: 'Description 5', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7" },
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
  const initialLoad = useRef(true);

  //Using callback to only call functions once and save data instead of each time it renders
  const loadData = useCallback(async () => {
    try {
      const data = await fetchCubeData();
      setCubeData(data);
      setFilteredCubeData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to laod cube data');
    } 
  }, []);

  useEffect(() => {
    //Get the users current location to focus there on map
    //First get permission to use location
    (async () => {
      try{
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
      } catch (error) {
        setInitialRegion({
          latitude: 1,
          longitude: 1,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        Alert.alert('Error', 'Failed to get current location');
      }
    })();

    loadData();
  }, [loadData]);

  //When the initialRegion are set we call this function to calculate
  //The distance between the user and each cube
  //Maybe change to calculate drive time not distance but more complicated that way.
  useEffect(() => {
    if (initialRegion && initialLoad.current) {
      // Calculate distances for each cube
      const updatedCubeData = cubeData.map(cube => ({
        ...cube,
        distance: calculateDistance(initialRegion.latitude, initialRegion.longitude, cube.latitude, cube.longitude),
      }));
      // Sort cubes by distance
      updatedCubeData.sort((a, b) => a.distance - b.distance);
      setCubeData(updatedCubeData);
      setFilteredCubeData(updatedCubeData);
      //Added initialLoad so that the distance is only calculated the first time its rendered
      //This should improve performance, but may need it to recalculate on some schedule or change in user location
      initialLoad.current = false;
    }
  }, [initialRegion, cubeData]);


  const handleSearch = (searchText: string) => {
    // Existing search logic to filter cubeData based on searchText
    let filteredData = cubeData.filter(cube =>
      cube.title.toLowerCase().includes(searchText.toLowerCase()) ||
      cube.description.toLowerCase().includes(searchText.toLowerCase())
    );

    if (filteredData.length === 0) {
      // If no matches found, return closest cubes
      filteredData = [...cubeData].sort((a, b) => a.distance - b.distance).slice(0, 5); // Adjust the number of results as needed
    }

    setFilteredCubeData(filteredData);
  
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>CUBE MAP</ThemedText>
        {/*Search Bar inside the header  */}
        <SearchBar onSearch={handleSearch} />
      </ThemedView>
      
      {/*Map container*/}
      <View style={styles.container}>        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
           initialRegion && (
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
        {/*List View*/}
        {view === 'list' && (
          <View style={styles.horizontalScrollViewContainer}>
            <ThemedText type="default" style={styles.cubesNearYouText}>Cubes Near You</ThemedText>
            <ScrollView horizontal>
              {filteredCubeData.map(cube => (
                <View key={cube.id} style={styles.listItem}>
                  <Image source={{ uri: cube.imageUrl }} style={styles.cubeImage} />
                  <ThemedText type="default" style={styles.cubeTitle}>{cube.title}</ThemedText>
                  <ThemedText type="default">{cube.description}</ThemedText>
                  <ThemedText type="default">Distance: {cube.distance.toFixed(2)} miles</ThemedText>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      {/*Button*/}
      <View style={[styles.switchViewsButton, view === 'list' && styles.switchViewsButtonList]}>
        <View style={{width: '100%' }}>
          <Button
            title={view === 'map' ? 'List View' : 'Map View'}
            onPress={() => setView(view === 'map' ? 'list' : 'map')}
          />
        </View>
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
    color: '#4D9EE6',
  },
  map: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  switchViewsButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 100,
    borderColor: '#4D9EE6',
    padding: 13,
    left: '35%',
    width: '30%',
    textAlign: 'center',
  },
  switchViewsButtonList: {
    bottom: 'auto',
    top: 200, // Adjust the distance from the top as needed
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 200,
  },
  cubeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  cubeTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalScrollViewContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    borderColor: '#4D9EE6',
    borderWidth: 2,
    borderTopLeftRadius: 30, // More rounded top corners
    borderTopRightRadius: 30, // More rounded top corners
  },
  cubesNearYouText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
});
