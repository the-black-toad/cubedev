import React, { Component } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { TabBarIcon } from './navigation/TabBarIcon';


interface CubeData {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  distance: number;
}

interface SearchBarProps {
  onSearch: (searchText: string) => void;
}


class SearchBar extends Component<SearchBarProps> {
  state = {
    searchText: '',
  };

  handleSearchChange = (text: string) => {
    this.setState({ searchText: text });
    this.props.onSearch(text);
  };
  
  render() {
    const { searchText } = this.state;

    // organizing the search bar components 
    return (
      <View style={styles.container}>
        <TabBarIcon name={'search'} size={15} color={"#999"} style={styles.icon}/>
        <TextInput
          style={styles.input}
          placeholder="Search Cubes"
          placeholderTextColor="#999"
          onChangeText={this.handleSearchChange}
          value={searchText}
        />
     
      </View>
    );
  }
}
// need to have things align center and flex 
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 25,
    padding: 4,
    color: "#000000",
  },
  icon :{
    marginRight: 10, 
  }
});

export default SearchBar;
