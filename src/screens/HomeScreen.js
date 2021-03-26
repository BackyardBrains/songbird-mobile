import React from "react";
import { Button, View, FlatList, TouchableOpacity } from "react-native";
import styles from '../styles/style';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { changeStatus, connectDevice, disconnectDevice, resetBleList, startScan, updateCounter } from '../actions/index';
import { Container, Header, Content, List, ListItem, 
  Text, Left, Right, Icon, Card, CardItem, Body } from 'native-base';

const HomeScreen = ( {navigation} ) => {
  
  const dispatch = useDispatch();
  
  dispatch(changeStatus("render homescreen"));

  const currDevice = useSelector(state => state.BLEs.connectedDevice);
  
  //disconnects form device if device is connected

  dispatch(startScan());
  const BLEList = useSelector(state => state.BLEs.BLEList);
  
   
  return (
  <View style={styles.contentContainer}>

    <Card style={{alignItems: 'center'}}>
      <CardItem header bordered>
        <Text>Find and select your Songbird device </Text>
      </CardItem>
    </Card>

    <FlatList 
      keyExtractor={ device => device.name}
      data={BLEList}
      renderItem={({item}) => {
        return (
          <ListItem onPress={() => {
            dispatch(connectDevice({item}));
            navigation.navigate('Device'); // go to Device Screen
          }}>
              <Text>{item.name}</Text> 
          </ListItem>
        );
      }}
    />
    
    <View style={styles.footer}>
      <Button 
        title="Refresh" 
        onPress={() => {
          if (Object.keys(currDevice).length !== 0) dispatch(disconnectDevice());
          dispatch(resetBleList());
       }} 
      />
    </View>
    
  </View>
  );
};

HomeScreen.navigationOptions = () => ({
  // title: 'ggggg',
  headerStyle: {
    backgroundColor: '#FF9E00',
  },
});

export default HomeScreen;

