import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { disconnectDevice, sleep, TranslateStorageCapacity, writePar, readDynamicPars, readPar, mapSRCodeToVal } from '../actions/interface';
import base64 from 'react-native-base64'
import { Content, List, ListItem, 
    Text, Left, Right, Icon, Card, CardItem, Body, Button } from 'native-base';
import { convertToDisplay, displayGpsDMS } from '../actions/TimeLocation';

const DeviceScreen = ( { navigation } ) => {
    
    const dispatch = useDispatch();
    const device = useSelector(state => state.BLEs.connectedDevice);
    const parameters = useSelector(state => state.BLEs.parameters);

    
    useEffect(() => {
        let secTimer = setInterval( () => {
            dispatch(readDynamicPars());
         }, 4000);
        return () => clearInterval(secTimer);
    }, []);

    //config recording duration display
    let displayRecDur = parseInt(parameters.RecordingDuration);

    //config battery display
    let displayBattery = parameters.BatteryLevel;
    if (displayBattery !== "100") displayBattery = displayBattery.substring(1);
    
    //config storage display
    let displayStorage = TranslateStorageCapacity(parameters.StorageCapacity)
    
    //config GPS & time display
    let displayGps = displayGpsDMS(parameters.GpsCoordinates);
    let displayTime = convertToDisplay(parameters.DeviceClock, "deviceScreen");
    
    
    //config recording display
    let recordingString, toggle, toggleView;
    switch (parameters.IsRecording){
        case "1":
            recordingString = "ON";
            toggle = "STOP";
            toggleView = "Stop Recording";
            break;
        case "0":
            recordingString = "OFF";
            toggle = "START";
            toggleView = "Start Recording";
            break;
        default:
            recordingString = "...";
            toggle = "START";
            toggleView = "Communicating...";
            break;
    }

    return (
        <Content> 
            <Card style={styles.cardBStyle}>
                <CardItem header bordered >
                    <Text>Connected: {device.name}</Text>
                </CardItem>
                <CardItem bordered>
                    <Body style={{ flexDirection: 'row'}}>
                        <View style={styles.listLeft}>
                            <Text>Battery Level:</Text>
                        </View>
                        <View><Text>{displayBattery}%</Text></View>
                    </Body>
                </CardItem>
                <CardItem bordered>
                    <Body style={{ flexDirection: 'row'}}>
                        <View style={styles.listLeft}>
                            <Text>Storage Capacity:</Text>
                        </View>
                        <View><Text>{displayStorage}</Text></View>
                    </Body>
                </CardItem>
                <CardItem bordered>
                    <Body style={{ flexDirection: 'row'}}>
                        <View style={styles.listLeft}>
                            <Text>Recording:</Text>
                        </View>
                        <View><Text>{recordingString}</Text></View>
                    </Body>
                </CardItem>
            </Card>
            
            <View style={styles.ButtonSection} // recording button
            >
                <Button rounded 
                    disabled={recordingString === "..."}
                    onPress={() => {
                        dispatch(writePar("IsRecording", toggle));
                    }}
                >
                    <Text>{toggleView}</Text>
                </Button>
            </View>

            <List >

                <ListItem onPress={() => navigation.navigate('SetDuration')}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>Recording Duration:</Text>   
                        </View>
                        <Text>{displayRecDur} mins</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />  
                    </Right>
                </ListItem>
                <ListItem onPress={() => navigation.navigate('SetSamplingRate')}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>Sampling Rate:</Text>   
                        </View>
                        <Text>{mapSRCodeToVal[parameters.SamplingRate]} kHz</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem onPress={() => navigation.navigate('SetGps')}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>GPS Coordinates:</Text>
                        </View>
                        <Text>{displayGps[0]},{'\n'}{displayGps[1]}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem onPress={() => {
                    dispatch(readPar("DeviceClock"));
                    navigation.navigate('SetClock');
                }}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>Device Clock:</Text>   
                        </View>
                        <Text>{displayTime}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem onPress={() => navigation.navigate("SaveFiles")}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>Save file (temp)</Text>   
                        </View>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>

            </List>
            <View style={styles.DisconnectButtonSection} >
                <Button rounded 
                    onPress={() => {
                        dispatch(disconnectDevice());
                        navigation.navigate('Home');
                    }}
                >
                    <Text>Disconnect</Text>
                </Button>
            </View>
           

        </Content>
    );
};

DeviceScreen.navigationOptions = () => ({
    headerLeft: () => null
    
  });

export default DeviceScreen;