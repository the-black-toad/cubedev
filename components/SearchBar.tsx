import React, { Component } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

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

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search Cubes"
          onChangeText={this.handleSearchChange}
          value={searchText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  input: {
    height: 35,
    padding: 8,
  },
});

export default SearchBar;
