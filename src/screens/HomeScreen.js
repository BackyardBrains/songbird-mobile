import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from '../styles/style';
import devices from '../components/DeviceData'
import { useDispatch, useSelector } from 'react-redux';
import { changeDevice, updateBattery, updateStorage} from '../actions/index';


const HomeScreen = ( {navigation} ) => {
  
  const stateIn = useSelector(state => state.BLEs);
  const dispatch = useDispatch();

  return (
  <View>
    <View style={styles.container}>
    <FlatList 
            data = {devices}
            renderItem={({item}) => {
              return (
                  <TouchableOpacity 
                    onPress={() => {
                      // this onPress function will eventually call the BLEManager to connect with the 
                      // desired device. That device's data will then populate the state object
                      dispatch(changeDevice(`${item.device}`));
                      dispatch(updateBattery(`${item.battery}`));
                      console.log("state in hscreen",stateIn); // to test state's availability
                      navigation.navigate('Device'); // go to Device Screen
                    }}
                  >
                      <Text style={styles.header}>{item.device}</Text> 
                  </TouchableOpacity>
                );
            }}
        />
    </View>
  </View>
  );
};

export default HomeScreen;
