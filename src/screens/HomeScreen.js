import React from "react";
import { Button, View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, connectDevice, startScan } from '../actions/index';
import SideBar from "./Sidebar.js"


const HomeScreenRouter = DrawerNavigator(
  {
    Home : { screen: HomeScreen },
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

const HomeScreen = ( {navigation} ) => {
  
  const dispatch = useDispatch();
  
  dispatch(startScan());
  const BLEList = useSelector(state => state.BLEs.BLEList);
  const status = useSelector(state => state.BLEs.status);
  
   
  return (
  <View>
    
    <View style={styles.container}>

    <Header>
      <Left>
        <Button
          transparent
          onPress={() => navigation.navigate("DrawerOpen")}>
          <Icon name="menu" />
        </Button>
      </Left>
      <Body>
        <Title>HomeScreen</Title>
      </Body>
      <Right />
    </Header>

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