import React from "react";
import { Button, View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, connectDevice, disconnectDevice, startScan } from '../actions/index';


const HomeScreen = ( {navigation} ) => {
  
  const dispatch = useDispatch();
  
  //dispatch(disconnectDevice());
  dispatch(startScan());
  const BLEList = useSelector(state => state.BLEs.BLEList);
  const status = useSelector(state => state.BLEs.status);
  
   
  return (
  <View>
    
    <View style={styles.container}>

    <Button title="Refresh" onPress={() => dispatch(changeStatus(`${status}.`))} />

      <FlatList 
        keyExtractor={ device => device.name}
        data={BLEList}
        renderItem={({item}) => {
          return (
            <TouchableOpacity 
              onPress={() => {
                dispatch(connectDevice({item})); // still needs thorough testing

                navigation.navigate('Device'); // go to Device Screen
              }}
            >
              <Text style={styles.header}>{item.name}</Text> 
            </TouchableOpacity>
          );
        }}
      />
    </View>
  </View>
  );
};

export default HomeScreen;