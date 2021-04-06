import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {BleManager} from 'react-native-ble-plx';

import React, { Component } from 'react'

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './src/reducers/index';
import thunk from 'redux-thunk';
import FlashMessage from "react-native-flash-message";


import HomeScreen from './src/screens/HomeScreen';
import DeviceScreen from './src/screens/DeviceScreen';

// parameter setting screens
import SetClockScreen from './src/screens/SetClockScreen';
import SetDurationScreen from './src/screens/SetDurationScreen';
import SetSamplingRateScreen from './src/screens/SetSamplingRateScreen';
import SetGpsScreen from './src/screens/SetGpsScreen';


const navigator = createStackNavigator(
  {
    Home: HomeScreen,
    Device: DeviceScreen,

    SetClock: SetClockScreen,
    SetDuration: SetDurationScreen,
    SetSamplingRate: SetSamplingRateScreen,
    SetGps: SetGpsScreen,


    
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      title: 'Songbird Recorder Buddy',
      headerStyle: {
        backgroundColor: '#FF9E00',
      },
    },
  }
);




const DeviceManager = new BleManager();
const store = createStore(
  rootReducer,
  applyMiddleware(
    thunk.withExtraArgument({ DeviceManager } )
  )
);
 
let Navigation = createAppContainer(navigator);

// Render the app container component with the provider around it
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
        <FlashMessage position="center" duration={3370} />
      </Provider>
    );
  }
}