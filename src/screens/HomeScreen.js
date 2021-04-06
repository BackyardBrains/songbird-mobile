import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import styles from '../styles/style';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { connectDevice, disconnectDevice, startScan } from '../actions/interface';
import { resetBleList, updateCounter } from '../actions/index';
import { Container, Header, Content, List, ListItem, 
      Text, Left, Right, Icon, Card, CardItem, Button, Body, Grid, Col } from 'native-base';
import { handleLocation } from "../actions/TimeLocation";
import { showMessage, hideMessage } from "react-native-flash-message";

const HomeScreen = ( {navigation} ) => {
  
  const dispatch = useDispatch();

  const connectionStatus = useSelector(state => state.BLEs.connectionStatus);
  const BLEList = useSelector(state => state.BLEs.BLEList);
  const location = useSelector(state => state.BLEs.location);
  const readStatus = useSelector(state => state.BLEs.readStatus)
  if (readStatus === "finish") navigation.navigate('Device'); // go to Device Screen

  return (
  <View style={styles.contentContainer}>

    <Card style={styles.cardAStyle} >
      <CardItem header bordered>
        <Text>Scan to find your Songbird device </Text>
      </CardItem>
    </Card>


    <FlatList 
      keyExtractor={ device => device.name}
      data={BLEList}
      renderItem={({item}) => {
        return (
          <ListItem onPress={() => {
            showMessage({
              message: "Loading, please wait",
              type: "default",
              backgroundColor: "#007aff"
            });
            dispatch(connectDevice({item}));
          }}>
              <Text>{item.name}</Text> 
          </ListItem>
        );
      }}
    />
    
    <View style={styles.ButtonSection} >
      <Button rounded 
        onPress={() => {
          console.log(connectionStatus);
          if (connectionStatus !== "Disconnected") dispatch(disconnectDevice());
          if (Object.keys(location).length === 0) dispatch(handleLocation());
          dispatch(resetBleList());
          dispatch(startScan());
       }} 
      >
        <Text>Scan</Text>
      </Button>
    </View>

  </View>
  );
};



export default HomeScreen;

