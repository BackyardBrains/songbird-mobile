<<<<<<< HEAD
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button, FlatList } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { disconnectDevice, changeStatus } from '../actions';
import base64 from 'react-native-base64'

// device.serviceUUIDs[0] === "4fafc201-1fb5..." // in theory

const DeviceScreen = ( { navigation } ) => {
    
    const dispatch = useDispatch();
    const device = useSelector(state => state.BLEs.connectedDevice);
    const status = useSelector(state => state.BLEs.status);
    const servicesArray = useSelector(state => state.BLEs.services);

    const characteristic = useSelector(state => state.BLEs.characteristic);
    console.log("characteristic: ", characteristic);
    
    // NOTE: need to do base64 decode and encode of all characteristic values
    const englishVal = base64.decode(`${characteristic.value}`);
    

    return (
        

        <ScrollView nestedScrollEnabled={true}> 
            <View style={styles.container}/>
            

            <View style={styles.container} // read only parameters
            />
            
            <Text style={styles.SubheadText}>Connected: {device.name}</Text>
            <Text style={styles.smallText}>Battery Level: ??</Text>
            <Text style={styles.smallText}>Storage Capacity: ??</Text>
            
            <View style={styles.container} // read/write parameters, editing takes you to seperate screen with input field
            />

            <Text style={styles.SubheadText}>Recording Settings </Text>
            <Text style={styles.SubheadText}>Basic </Text>
            <Text style={styles.smallText}>Device Clock: ??</Text>
            <Text style={styles.smallText}>Duration: ??</Text>
            <Text style={styles.SubheadText}>Advanced </Text>
            <Text style={styles.smallText}>Sampling Rate: ??</Text>
            <Text style={styles.smallText}>Sensitivity: ??</Text>

            <View style={styles.container} />

            <Text style={styles.SubheadText}>Trigger Mode </Text>
            <Text style={styles.SubheadText}>Basic </Text>
            <Text style={styles.smallText}>Time Schedule Start/Stop: ??</Text>
            <Text style={styles.SubheadText}>Advanced </Text>
            <Text style={styles.smallText}>Light Intensity: ??</Text>
            <Text style={styles.smallText}>Sound Level: ??</Text>
            <Text style={styles.smallText}>GPS Coordinates: ??</Text>
        
            <View style={styles.container} />
            
            <FlatList scrollEnabled={false}
                keyExtractor={ service => service }
                data={servicesArray}
                renderItem={({item}) => {
                    //dispatch(getCharData({item}));
                    return (
                        <Text style={styles.smallText}>Service UUID: {item}</Text>
                    );
                }}
            />

            <Text style={styles.smallText}>Characteristic UUID: {characteristic.uuid}</Text>
            <Text style={styles.smallText}>Characteristic value: {englishVal}</Text>
            
            <View style={styles.container} />
            
            <Button title="Disconnect from Device" onPress={() => dispatch(disconnectDevice())} />

        </ScrollView>
    );
};

export default DeviceScreen;
=======
import React from 'react';
import { View, TouchableOpacity, Button } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { disconnectDevice, changeStatus } from '../actions';
import base64 from 'react-native-base64'
import { Container, Header, Content, List, ListItem, 
    Text, Left, Right, Icon, Card, CardItem, Body } from 'native-base';

// device.serviceUUIDs[0] === "4fafc201-1fb5..." // in theory

const DeviceScreen = ( { navigation } ) => {
    
    const dispatch = useDispatch();
    const device = useSelector(state => state.BLEs.connectedDevice);
    
    const parameters = useSelector(state => state.BLEs.parameters);

    const characteristic = useSelector(state => state.BLEs.characteristic);
    console.log("characteristic: ", characteristic);
    
    // NOTE: need to do base64 decode and encode of all characteristic values
    const englishVal = base64.decode(`${characteristic.value}`);
    

    return (
        

        <Content> 
            <Card>
                <CardItem header bordered>
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
            </Card>
            
            <List>

                <ListItem itemHeader first>
                    <Text>Recording Settings</Text>
                </ListItem>
                <ListItem onPress={() => navigation.navigate('SetClock')}>
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
                <ListItem onPress={() => navigation.navigate('SetDuration')}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>Duration:</Text>   
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
                <ListItem onPress={() => navigation.navigate('SetSensitivity')}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>Sensitivity:</Text>
                        </View>
                        <Text>{parameters.Sensitivity}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem itemHeader>
                    <Text>Trigger Mode</Text>
                </ListItem>
                <ListItem onPress={() => navigation.navigate('SetSchedule')}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>Schedule: </Text>
                        </View>
                        <Text>{parameters.ScheduleStart} - {parameters.ScheduleEnd}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem onPress={() => navigation.navigate('SetLight')}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>Light Intensity: </Text>
                        </View>
                        <Text>{parameters.LightIntensity}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem onPress={() => navigation.navigate('SetSound')}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>Sound Level: </Text>
                        </View>
                        <Text>{parameters.SoundLevel}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem itemHeader>
                    <Text>Tags</Text>
                </ListItem>
                <ListItem onPress={() => navigation.navigate('SetGps')}>
                    <Left>
                        <View style={styles.listLeft}>
                            <Text>GPS Coordinates:</Text>
                        </View>
                        <Text>{parameters.GpsCoordinates}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>

            </List>

            <View style={styles.container} />
            

            <Text>Characteristic UUID: {characteristic.uuid}</Text>
            <Text>Characteristic value: {englishVal}</Text>
            
            <View style={styles.container} />
            
            <Button title="Disconnect from Device" onPress={() => dispatch(disconnectDevice())} />

        </Content>
    );
};

export default DeviceScreen;
>>>>>>> acd6a634e7d491efcc01501d36f7b74c14c80fb2
