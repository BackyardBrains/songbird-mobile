import React from 'react';
import { View } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { disconnectDevice, writePar, readPar } from '../actions/interface';
import base64 from 'react-native-base64'
import { Content, List, ListItem, 
    Text, Left, Right, Icon, Card, CardItem, Body, Button } from 'native-base';

const DeviceScreen = ( { navigation } ) => {
    
    const dispatch = useDispatch();
    const device = useSelector(state => state.BLEs.connectedDevice);
    const parameters = useSelector(state => state.BLEs.parameters);

    let coords = parameters.GpsCoordinates.split(':');

    let recordingString, toggle, toggleView;
    console.log("recording?", parameters.IsRecording)
    switch (parameters.IsRecording){
        case "1":
            recordingString = "Recording...";
            toggle = "0";
            toggleView = "Stop Recording";
            break;
        case "0":
            recordingString = "Not Recording";
            toggle = "1";
            toggleView = "Start Recording";
            break;
        default:
            recordingString = "Not Recording";
            toggle = "1";
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
                        <Text>Battery Level: {parameters.BatteryLevel}%</Text>
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
                        <Text>{parameters.RecordingDuration} hrs</Text>
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
                        <Text>{parameters.SamplingRate} kHz</Text>
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
                        <Text>{coords[0]}, {coords[1]}</Text>
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
                        <Text>{parameters.DeviceClock}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>

            </List>
            <View style={styles.ButtonSection} >
                <Button rounded 
                    onPress={() => dispatch(disconnectDevice())}
                >
                    <Text>Disconnect</Text>
                </Button>
            </View>
           

        </Content>
    );
};

DeviceScreen.navigationOptions = () => ({
    // title: 'ggggg',
    headerStyle: {
      backgroundColor: '#FF9E00',
    },
  });

export default DeviceScreen;