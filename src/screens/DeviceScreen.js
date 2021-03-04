import React from 'react';
import { View, Text, TouchableOpacity, Button, FlatList } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { disconnectDevice, changeStatus, getCharData } from '../actions';

// device.serviceUUIDs[0] === "4fafc201-1fb5..." // in theory

const DeviceScreen = ( { navigation } ) => {
    
    const dispatch = useDispatch();
    const device = useSelector(state => state.BLEs.connectedDevice);
    const status = useSelector(state => state.BLEs.status);
    const servicesArray = useSelector(state => state.BLEs.services);
    //console.log("connected device in dscreen: ", device);
    //const service = device.serviceUUIDs[0];


    return (
        
        <View style={styles.container}>
            <Button title="Refresh" onPress={() => dispatch(changeStatus(`${status}.`))} />

            <Text style={styles.smallText}>Connected: {device.name}</Text>
            
            <View style={styles.container}/>

            <FlatList 
                keyExtractor={ service => service }
                data={servicesArray}
                renderItem={({item}) => {
                    //dispatch(getCharData({item}));
                    return (
                        <Text style={styles.header}>Service UUID: {item}</Text> 

                    );
                }}
            />

            <Button title="Disconnect" onPress={() => dispatch(disconnectDevice())} />


        </View>
    );
};

export default DeviceScreen;
