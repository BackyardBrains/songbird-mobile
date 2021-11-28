import React from 'react';
import { View, PermissionsAndroid } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { writePar } from '../actions/interface';
import { Container, Content, Button, Text, Card, CardItem, FlatList} from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';


const SaveFileSreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);

    dispatch(readDirectory());
    let cardFile = useSelector(state => state.BLEs.cardFiles);

    

    let boardFiles_1 = [...cardFile[0]];
    let boardFiles_2 = [...cardFile[1]];

    
    if (!PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)){
        alert("Storage Permission Request Fails");
    }

    console.log(RNFetchBlob.fs.dirs.DocumentDir);


    RNFetchBlob.fs.exists(RNFetchBlob.fs.dirs.DocumentDir + "/Songbird/")
    .then((res) => {
        if (!res) {
            console.log("Creating App directory...", RNFetchBlob.fs.dirs.DocumentDir, "/Songbird/")
            RNFetchBlob.fs.mkdir(RNFetchBlob.fs.dirs.DocumentDir + "/Songbird/")
                .then((res) => {console.log("App directory created..")})
                .catch((err) => {console.log(err)})
        };
    }); // may want to add error handling here?
    


    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text >Connected: {device.name}</Text>
                    </CardItem>
                </Card>
                
                <FlatList 
                    data={boardFiles_1}
                    renderItem={({item}) => {
                        return (
                            <ListItem onPress={() => dispatch(requestFile(RNFetchBlob.fs.dirs.DocumentDir + "/Songbird/" + item, boardFiles_1.indexOf(item), 0))}>
                                <Text>{item}</Text> 
                            </ListItem>
                          );
                    }}    
                />
                <FlatList 
                    data={boardFiles_2}
                    renderItem={({item}) => {
                        return (
                            <ListItem onPress={() => dispatch(requestFile(RNFetchBlob.fs.dirs.DocumentDir + "/Songbird/" + item, boardFiles_2.indexOf(item), 1))}>
                                <Text>{item}</Text> 
                            </ListItem>
                          );
                    }}    
                />
            </Content>
        </Container>
    );
    
};

SaveFileSreen.navigationOptions = () => ({
    title: 'Save Files From Songbird (temp)'
  });



export default SaveFileSreen;