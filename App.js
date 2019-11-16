import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  returnCoordsView() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      const altitude = this.state.location.coords.altitude;
      const latitude = this.state.location.coords.latitude;
      const longitude = this.state.location.coords.longitude;
      text = altitude + ' / ' + latitude + ' / ' + longitude;
      return [
        <Text key='coordsHeader' style={styles.paragraph}>Altitude / Latitude / Longitude</Text>,
        <Text key='coords' style={styles.paragraph}>{text}</Text>
      ];
    }
    return ( <Text style={styles.paragraph}>{text}</Text> );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Welcome to TripHop!
        </Text>
        {this.returnCoordsView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    color: '#fff',
    margin: 12
  }

});
