import React from 'react';
import { View } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { disconnectDevice, writePar, readPar, mapSRCodeToVal } from '../actions/interface';
import base64 from 'react-native-base64'
import { Content, List, ListItem, 
    Text, Left, Right, Icon, Card, CardItem, Body, Button } from 'native-base';
import convertToDisplay from '../actions/TimeLocation';

const DeviceScreen = ( { navigation } ) => {
    
    const dispatch = useDispatch();
    const device = useSelector(state => state.BLEs.connectedDevice);
    const parameters = useSelector(state => state.BLEs.parameters);

    //config recording duration display
    let displayRecDur = parseInt(parameters.RecordingDuration);

    //config battery display
    let displayBattery = parameters.BatteryLevel;
    if (displayBattery !== "100") displayBattery = displayBattery.substring(1);
    
    //config GPS & time display
    let coords = parameters.GpsCoordinates.split(':');
    let displayTime = convertToDisplay(parameters.DeviceClock, "deviceScreen");
    
    
    //config recording display
    let recordingString, toggle, toggleView;
    switch (parameters.IsRecording){
        case "START":
            recordingString = "Recording...";
            toggle = "STOP";
            toggleView = "Stop Recording";
            break;
        case "STOP":
            recordingString = "Not Recording";
            toggle = "START";
            toggleView = "Start Recording";
            break;
        default:
            recordingString = "Not Recording";
            toggle = "STOP";
            toggleView = "Start Recording";
            break;
    }

    return (
        <Content> 
            <Card style={styles.cardBStyle}>
                <CardItem header bordered >
                    <Text>Connected: {device.name}</Text>
                </CardItem>
                <CardItem bordered>
                    <Body>
                        <Text>Battery Level: {displayBattery}%</Text>
                    </Body>
                </CardItem>
                <CardItem bordered>
                    <Body>
                        <Text>Storage Capacity: {parameters.StorageCapacity}%</Text>
                    </Body>
                </CardItem>
                <CardItem bordered>
                    <Body>
                        <Text>{recordingString}</Text>
                    </Body>
                </CardItem>
            </Card>
            
            <View style={styles.ButtonSection} // recording button
            >
                <Button rounded 
                    onPress={() => dispatch(writePar("IsRecording", toggle))}
                >
                    <Text>{toggleView}</Text>
                </Button>
            </View>

            <List>
                <ListItem itemHeader first>
                    <Text>Settings</Text>
                </ListItem>
                
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
                        <Text>{coords[0]},{'\n'}{coords[1]}</Text>
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

            </List>
            <View style={styles.ButtonSection} >
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