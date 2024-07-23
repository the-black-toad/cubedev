import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Button, SafeAreaView, ScrollView, StatusBar, Alert, ActivityIndicator, Image, TouchableOpacity  } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'expo-router';
import { useCubeData } from '../../cubeContext'; // Import useCubeData

// Define a type for the cube data
interface CubeData {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  distance: number;
  imageUrl: string;
  roomsAvailable: number;
  pricePerNight: number;
  pricePerHour: number;
}

// Placeholder function to simulate fetching data from a database
const fetchCubeData = async (): Promise<CubeData[]> => {
  // Simulate an API call to fetch cube data
  return [
    { id: 1, latitude: 37.78825, longitude: -122.4324, title: 'Cube 1', description: 'Description 1', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7", roomsAvailable: 5, pricePerNight: 90, pricePerHour: 10  },
    { id: 2, latitude: 37.75825, longitude: -122.4524, title: 'Cube 2', description: 'Description 2', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7", roomsAvailable: 5, pricePerNight: 90, pricePerHour: 10 },
    { id: 3, latitude: 37.72825, longitude: -122.4524, title: 'Cube 3', description: 'Description 3', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7", roomsAvailable: 5, pricePerNight: 90, pricePerHour: 10 },
    { id: 4, latitude: 37.69825, longitude: -122.4524, title: 'Cube 4', description: 'Description 4', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7", roomsAvailable: 5, pricePerNight: 90, pricePerHour: 10 },
    { id: 5, latitude: 37.66825, longitude: -122.4524, title: 'Cube 5', description: 'Description 5', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7", roomsAvailable: 5, pricePerNight: 90, pricePerHour: 10 },
    { id: 6, latitude:37.253292, longitude: -76.4788, title: 'Thomas freak shack', description: 'based chuds only', distance: 0, imageUrl: "https://th.bing.com/th/id/OIP.n-DGGMe2U9zA7qY4XN1TfQHaJQ?w=130&h=180&c=7&r=0&o=5&pid=1.7", roomsAvailable: 5, pricePerNight: 90, pricePerHour: 10 }
    
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
  //const [cubeData, setCubeData] = useState<CubeData[]>([]);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [filteredCubeData, setFilteredCubeData] = useState<CubeData[]>([]);
  const initialLoad = useRef(true);
  const router = useRouter();
  const { cubeData, setCubeData } = useCubeData();
  
  

  //Using callback to only call functions once and save data instead of each time it renders
  const loadData = useCallback(async () => {
    try {
      const data = await fetchCubeData();
      setCubeData(data);
      setFilteredCubeData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load cube data');
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
          useDefaultRegion();
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
        useDefaultRegion();
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
      // Sort cubes by distance, though we may be able to calculate this on the backend
      updatedCubeData.sort((a, b) => a.distance - b.distance);
      setCubeData(updatedCubeData);
      setFilteredCubeData(updatedCubeData);
      //Added initialLoad so that the distance is only calculated the first time its rendered
      //This should improve performance, but may need it to recalculate on some schedule or change in user location
      initialLoad.current = false;
    }
  }, [initialRegion, cubeData]);

  const useDefaultRegion = () => {
    setInitialRegion({
      latitude: 37.78825,
      longitude: -122.4524,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  const handleSearch = (searchText: string) => {
    // Existing search logic to filter cubeData based on searchText
    let filteredData = cubeData.filter(cube =>
      cube.title.toLowerCase().includes(searchText.toLowerCase()) ||
      cube.description.toLowerCase().includes(searchText.toLowerCase())
    );

    if (filteredData.length === 0) {
      // If no matches found, return closest cubes
      filteredData = [...cubeData].sort((a, b) => a.distance - b.distance).slice(0, 5); // Adjust the number of results as needed
    } else {
      // If a match is found, move the map to the location of the first matched cube
      moveToCubeLocation(filteredData[0].latitude, filteredData[0].longitude);
    }

    setFilteredCubeData(filteredData);
  
  };

  const moveToCubeLocation = (latitude: number, longitude: number) => {
    setInitialRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleBook = (cubeIdfromMap: number) =>{
    //router.push('reservationScreens/cubeSelected', { params: { cubeFromMap } });
    // const router = useRouter();
    console.log(cubeIdfromMap);
    router.push({
        pathname: `/reservationScreens/cubeSelected`,
        params: { cubeId: cubeIdfromMap },
    });
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
            <React.Fragment>
                <MapView
                  style={styles.map}
                  showsUserLocation={true}
                  initialRegion={initialRegion}
                >
                  {filteredCubeData.map(cube => (
                    
                    <Marker 
                    key={cube.id}
                    coordinate={{ latitude: cube.latitude, longitude: cube.longitude }}
                    title={cube.title}
                    description={cube.description}
                    onCalloutPress={e => handleBook(cube.id)}                  
                  />                                              
                  ))}

                </MapView>
              </React.Fragment>
          )
        )}
        {/*List View*/}
        {view === 'list' && (
          <View style={styles.horizontalScrollViewContainer}>
            <ThemedText type="default" style={styles.cubesNearYouText}>Cubes Near You</ThemedText>
            <ScrollView horizontal>
              {filteredCubeData.map(cube => (
                <View key={cube.id} style={styles.listItem}>
                  <TouchableOpacity onPress={e => handleBook(cube.id)}>
                    <Image source={{ uri: cube.imageUrl }} style={styles.cubeImage} />
                    <View style={styles.cubeDetailsContainer}>
                        <ThemedText type="default" style={styles.cubeTitle}>{cube.title}</ThemedText>
                        <ThemedText type="default" style={styles.cubeDescription}>{cube.description}</ThemedText>
                        <ThemedText type="default" style={styles.cubeDescription}>Distance: {cube.distance.toFixed(2)} miles</ThemedText>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      {/*Buttons*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.bookNowButton, view === 'list' && styles.bookNowButtonList]} onPress={e => handleBook(filteredCubeData[0].id)}>
            <ThemedText type="default" style={styles.bookNowText}>Book Now</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.switchViewsButton, view === 'list' && styles.switchViewsButtonList]} onPress={() => setView(view === 'map' ? 'list' : 'map')}>
            <ThemedText type="default" style={styles.switchViewsButtonText}>
            {view === 'map' ? 'List View' : 'Map View'}
            </ThemedText>
        </TouchableOpacity>
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#4D9EE6',
    padding: 3,
    width: '30%',
    textAlign: 'center',
    fontSize: 14,
  },
  switchViewsButtonList: {
    bottom: 340,
  },
  switchViewsButtonText: {
    color: '#4D9EE6',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  bookNowButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#4D9EE6',
    padding: 3,
    width: '30%',
    textAlign: 'center',
    fontSize: 14,
  },
  bookNowButtonList: {
    bottom: 340, // Move up when in list view
  },
  bookNowText: {
    color: '#4D9EE6',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listItem: {
    marginHorizontal: 10,
    width: 150,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cubeImage: {
    width: '100%',
    height: 250,
  },
  cubeDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  cubeTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff'
  },
  cubeDescription: {
    fontSize: 12,
    color: '#fff',
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
    borderTopLeftRadius: 40, // More rounded top corners
    borderTopRightRadius: 40, // More rounded top corners
  },
  cubesNearYouText: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 15,
    marginLeft: 12,
    color: '#ffffff',
  },
});
