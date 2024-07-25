import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useCubeData } from '../cubeContext';

var babyBlueColor = '#D6E9F8';
var checkInTime = "01/01/25";
var checkOutTime = "01/02/25";

export default function RoomScreen() {
  const router = useRouter();
  const { getCubeById } = useCubeData();
  const cube = getCubeById(Number(1));
  const [modalVisible, setModalVisible] = useState(false);

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

    
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Room</Text>
      </View>
      <View style={styles.roomContainer}>
        <Image source={{ uri: cube.imageUrl }} style={styles.roomImage} />
        <View style={styles.checkInOutContainer}>
          <Text style={styles.checkInOutText}>
            <Text style={styles.boldText}>Check In: </Text>{checkInTime}
          </Text>
          <Text style={styles.checkInOutText}>
            <Text style={styles.boldText}>Check Out: </Text>{checkOutTime}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Extend</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Check-out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.keyContainer}>
        <Text style={styles.keyText}>My Key</Text>
        <View style={styles.keyBox}></View>
      </View>
      <TouchableOpacity style={styles.serviceRequestButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.serviceRequestText}>Service Request</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Service Request</Text>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cleaning</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>AC - Repair</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Water Issue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={[styles.modalButtonText, { color: 'red' }]}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  safeArea: {
    flexGrow: 1,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ECECED',
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#4D9EE6',
    fontSize: 24,
    fontWeight: 'bold',
  },
  roomContainer: {
    width: '85%',
    backgroundColor: babyBlueColor,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 10 }, // Offset of the shadow
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 10, // Radius of the shadow blur
    elevation: 5, // Android only: elevation of the shadow
  },
  roomImage: {
    width: 200,
    height: 200,
    borderRadius: 75,
    marginBottom: 10,
  },
  checkInOutContainer: {
    width: '100%',
    alignItems: 'center',
  },
  checkInOutText: {
    fontSize: 14,
    color: '#4D9EE6',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 10 }, // Offset of the shadow
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 10, // Radius of the shadow blur
    elevation: 5, // Android only: elevation of the shadow
  },
  buttonText: {
    color: '#4D9EE6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyContainer: {
    width: '85%',
    backgroundColor: babyBlueColor,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 10 }, // Offset of the shadow
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 10, // Radius of the shadow blur
    elevation: 5, // Android only: elevation of the shadow
  },
  keyText: {
    fontSize: 18,
    color: '#4D9EE6',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  keyBox: {
    width: 100,
    height: 100,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    marginBottom: 30,
  },
  serviceRequestButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    width: '85%',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 10 }, // Offset of the shadow
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 10, // Radius of the shadow blur
    elevation: 5, // Android only: elevation of the shadow
  },
  serviceRequestText: {
    color: '#4D9EE6',
    fontSize: 16,
    fontWeight: 'bold',

  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4D9EE6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
