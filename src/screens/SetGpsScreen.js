import React, {useState} from 'react';
import { View, TouchableOpacity, Button } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { changeParameter } from '../actions';
import { Container, Content, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';



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
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text>GPS Coordinates on device:</Text>
                        <Text>      Lat: {parameters.GpsLatitude} </Text>
                        <Text>      Long: {parameters.GpsLongitude} </Text>
                        
                        <Text>GPS Coordinates on phone:</Text>
                        <Text>      Lat: {location.latitude}</Text>
                        <Text>      Long: {location.longitude} </Text>
                    </Body>
                </CardItem>
                </Card>
                <Button
                    title="Submit current coordinates"
                    onPress={ () => {
                        dispatch(changeParameter(GpsLatitude, 
                                                location.latitude, 
                                                GpsLongitude, 
                                                location.longitude));
                    }}
                >
                </Button>
            </Content>
      </Container>
      //onPress={dispatch(updateGps(gps))}
    );
};


export default SetGpsScreen;