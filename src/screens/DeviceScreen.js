import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
//import { updateBattery, updateStorage} from '../actions/index';


const DeviceScreen = ( { navigation } ) => {
    
    const deviceID = useSelector(state => state.BLEs.connectedDevice.deviceID);
    const batteryLevel = useSelector(state => state.BLEs.deviceBattery);
    console.log("state in dscreen", batteryLevel);

    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>Connected: {deviceID}</Text>
            <Text style={styles.statusText}>Battery: {batteryLevel}%</Text>
            <Text style={styles.statusText}>Storage: 50% </Text>
            <View style={styles.container}/>

            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.statusText}>Device Config Option 1</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.statusText}>Device Config Option 2</Text>
            </TouchableOpacity>


        </View>
    );
};

export default DeviceScreen;
