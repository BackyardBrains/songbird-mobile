import React, { useState, useEffect } from 'react';
import { View, FlatList, PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { readDirectory, requestFile } from '../actions/interface';
import { Container, Content, Button, Text, Card, CardItem, ListItem} from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import styles from '../styles/style';
import { showMessage } from "react-native-flash-message";
import colors from 'native-base/src/theme/variables/commonColor';


  

const SaveFileScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);

    // update directory
    let cardFiles;
    useEffect(() => { dispatch(readDirectory()); }, [cardFiles, RNFetchBlob] );
    cardFiles = useSelector(state => state.BLEs.cardFiles);

    const requestFileEvent = (item) => {
        showMessage({
          message: "File will be on Dropbox when this message closes",
          type: "default",
          autoHide: false,
          backgroundColor: colors.brandPrimary,
          titleStyle: styles.AlertText,
        });
        dispatch(requestFile(
            TARGET_DIRECTORY_PATH + "songbird_" + num_files_on_device + ".wav", 
            item.index, 
            item.card));
      }

    // THIS IS TEMPORARY DUE TO FIRMWARE ISSUE
    const boardFiles = 
                    [
                        {"name":"card 1 file 1", "card":"1", "index":"0"}, 
                        {"name":"card 2 file 1","card":"2","index":"1"},
                        {"name":"card 2 file 2","card":"2","index":"1"},
                        {"name":"card 2 file 3","card":"2","index":"2"}
                    ];

    ///////////// START prepare storage ///////////////
    // permissions
    if (!PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)){
        alert("Storage Permission Request Fails");
    }
    // directory
    const TARGET_DIRECTORY_PATH = RNFetchBlob.fs.dirs.DocumentDir + "/Songbird/";
    RNFetchBlob.fs.exists(TARGET_DIRECTORY_PATH)
    .then((res) => {
        if (!res) {
            console.log("Creating App directory...", TARGET_DIRECTORY_PATH)
            RNFetchBlob.fs.mkdir(TARGET_DIRECTORY_PATH)
                .then((res) => {console.log("App directory created..")})
                .catch((err) => {console.log(err)})
        };
    });
    let num_files_on_device;
    RNFetchBlob.fs.ls(TARGET_DIRECTORY_PATH)
    // files will an array contains filenames
    .then((files) => {
        num_files_on_device = files.length;
        console.log(files)
    })
    //////////////// END prepare storage /////////////////
    


    return (
        <View style={styles.contentContainer}>

            <Card style={styles.cardAStyle}>
                <CardItem header bordered>
                    <Text >Connected: {device.name}</Text>
                </CardItem>
            </Card>

            <FlatList
                keyExtractor={ file => file.name } 
                data={boardFiles}
                renderItem={( {item} ) => {
                    return (
                        <ListItem onPress={() => requestFileEvent(item)}>
                            <Text>{item.name}</Text> 
                        </ListItem>
                    );
                }}    
            />
            
        </View>
    );
    
};

SaveFileScreen.navigationOptions = () => ({
    title: 'Save Files From Songbird'
  });



export default SaveFileScreen;