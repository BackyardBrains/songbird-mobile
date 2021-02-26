import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {BleManager} from 'react-native-ble-plx';

import React, { Component } from 'react'

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './src/reducers/index';

import HomeScreen from './src/screens/HomeScreen';
import DeviceScreen from './src/screens/DeviceScreen';

const navigator = createStackNavigator(
  {
    Home: HomeScreen,
    Device: DeviceScreen
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      title: 'Songbird Recorder Buddy',
    },
  }
);

const store = createStore(rootReducer);

let Navigation = createAppContainer(navigator);

// Render the app container component with the provider around it
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}