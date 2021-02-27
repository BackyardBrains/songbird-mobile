import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { startScan } from '../actions/index';


const HomeScreen = ( {navigation} ) => {
  
  const stateIn = useSelector(state => state.BLEs);
  const dispatch = useDispatch();
  console.log(stateIn);
  dispatch(startScan());
  const BLEList = useSelector(state => state.BLEs.BLEList);

  return (
  <View>
    <View style={styles.container}>
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