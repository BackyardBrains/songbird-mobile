import React from "react";
import { Button, View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, startScan } from '../actions/index';


const HomeScreen = ( {navigation} ) => {
  
  const dispatch = useDispatch();
  
  dispatch(startScan());
  const BLEList = useSelector(state => state.BLEs.BLEList);
  const status = useSelector(state => state.BLEs.status)
  console.log("BLEList: ", BLEList);
   
  return (
  <View>
    
    

    <View style={styles.container}>

    <Button title="Refresh" onPress={() => dispatch(changeStatus(`${status}.`))} />

      <FlatList 
        data = {BLEList}
        renderItem={({item}) => {
          return (
            <TouchableOpacity 
              onPress={() => {
                      // 
                      //dispatch(changeDevice(`${item.device}`)); // will dispatch 'connnect' thunk
                      //dispatch(updateBattery(`${item.battery}`)); // worry about these later
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