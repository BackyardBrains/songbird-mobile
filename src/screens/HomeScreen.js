import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import styles from '../styles/style';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { connectDevice, disconnectDevice, startScan } from '../actions/interface';
import { resetBleList, updateCounter } from '../actions/index';
import { Container, Header, Content, List, ListItem, 
      Text, Left, Right, Icon, Card, CardItem, Button, Body, Grid, Col } from 'native-base';
import colors from 'native-base/src/theme/variables/commonColor';
import { handleLocation } from "../actions/TimeLocation";
import { showMessage, hideMessage } from "react-native-flash-message";

const HomeScreen = ( {navigation} ) => {
  
  const dispatch = useDispatch();

  const connectionStatus = useSelector(state => state.BLEs.connectionStatus);
  const BLEList = useSelector(state => state.BLEs.BLEList);
  const location = useSelector(state => state.BLEs.location);

  const [isDisabled, toggleDisabled] = useState(false);

  const connectPressEvent = (item) => {
    showMessage({
      message: "Connecting, please wait",
      type: "default",
      backgroundColor: colors.brandPrimary,
      titleStyle: styles.AlertText,
    });
    dispatch(connectDevice({item}))
    setTimeout( () =>
      { navigation.navigate('Device'); },
      3370);
    
    
  }

  const scanPressEvent = () => {
    console.log(connectionStatus);
    if (connectionStatus !== "Disconnected") dispatch(disconnectDevice());
    if (Object.keys(location).length === 0) dispatch(handleLocation());
    dispatch(resetBleList());
    dispatch(startScan());
    toggleDisabled(true)
    setTimeout( () => 
      { toggleDisabled(false) },
      3000
    )
  }

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
          <ListItem onPress={() => connectPressEvent(item)}>
              <Text>{item.name}</Text> 
          </ListItem>
        );
      }}
    />
    
    <View style={styles.ButtonSection} >
      <Button rounded
        disabled={isDisabled} 
        onPress={() => scanPressEvent()} 
      >
        <Text>Scan</Text>
      </Button>
    </View>

  </View>
  );
};



export default HomeScreen;

