import React, {useState} from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { changeParameter } from '../actions';
import { Container, Content, Form, Button, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';



const SetGpsScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let parameters = useSelector(state => state.BLEs.parameters);
    let location = useSelector(state => state.BLEs.location);
    const GpsLatitude = "GpsLatitude";
    const GpsLongitude = "GpsLongitude";
    let GpsLatVal = parameters[GpsLatitude];
    let GpsLongVal = parameters[GpsLongitude];
    let anyAlert = false;

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text >Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text style={{fontWeight: "bold"}}>GPS Coordinates on Songbird device:</Text>
                            <Text>              Lat: {parameters.GpsLatitude} </Text>
                            <Text>              Long: {parameters.GpsLongitude} </Text>
                        </Body>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text style={{fontWeight: "bold"}}>GPS Coordinates on phone:</Text>
                        <Text>              Lat: {location.latitude}</Text>
                        <Text>              Long: {location.longitude} </Text>
                    </Body>
                </CardItem>
                </Card>
                <View style={styles.ButtonSection} >
                    <Button rounded 
                        onPress={ () => {
                            dispatch(changeParameter(GpsLatitude, 
                                                location.latitude, 
                                                GpsLongitude, 
                                                location.longitude));
                        }}
                    >
                        <Text>Submit phone coordinates</Text>
                    </Button>
                </View>
            </Content>
      </Container>
      //onPress={dispatch(updateGps(gps))}
    );
};

SetGpsScreen.navigationOptions = () => ({
    title: 'Set GPS Coordinates'
  });



export default SetGpsScreen;