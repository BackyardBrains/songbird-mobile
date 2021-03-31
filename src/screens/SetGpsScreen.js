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
                        <Text>Current GPS Coordinates:  {GpsLatVal}, {GpsLongVal}</Text>
                    </Body>
                </CardItem>
                </Card>
                <Form>
                    <Item fixedLabel>
                        <Label>New GPS Latitude</Label>
                        <Input 
                            keyboardType = 'numeric'
                            onChangeText={(value) => {
                                var reg = new RegExp(/^[1-9-]\d{0,3}(\.\d{1,3})?$/); // need updation later
                                if (!reg.test(value)) {
                                    if (!anyAlert){
                                        // alert('Songbirds will ignore any inputs other than number in this section');
                                        anyAlert = true;
                                    }    
                                    value = value.replace(/[^0-9.-]/g, "");
                                }
                                GpsLatVal = value;
                                console.log(GpsLatVal);
                        }}/>
                    </Item>
                    <Item fixedLabel>
                        <Label>New GPS Longitude</Label>
                        <Input 
                            keyboardType = 'numeric'
                            onChangeText={(value) => {
                                var reg = new RegExp(/^[1-9-]\d{0,3}(\.\d{1,3}){1}$/); // need updation later
                                if (!reg.test(value)) {
                                    if (!anyAlert){
                                        alert('Songbirds will ignore any inputs other than number in this section');
                                        anyAlert = true;
                                    }
                                    value = value.replace(/[^0-9.-]/g, "");
                                }
                                GpsLongVal = value;
                                console.log(GpsLongVal);
                        }}/>
                    </Item>
                </Form>
                <Button
                    title="Submit"
                    onPress={ () => {
                        dispatch(changeParameter(GpsLatitude, GpsLatVal));
                        dispatch(changeParameter(GpsLongitude, GpsLongVal));
                    }}
                >
                </Button>
            </Content>
      </Container>
      //onPress={dispatch(updateGps(gps))}
    );
};


export default SetGpsScreen;