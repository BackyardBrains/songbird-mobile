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
