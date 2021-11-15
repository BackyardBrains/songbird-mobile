import React from 'react';
import { View, PermissionsAndroid } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { writePar } from '../actions/interface';
import { Container, Content, Button, Text, Card, CardItem, Body, ListItem, Left, Right, Icon, List, ScrollView } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';


const SaveFileSreen = () => {
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    if (PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)){
        console.log(RNFetchBlob.fs.dirs.DocumentDir);
        RNFetchBlob.fs.exists(RNFetchBlob.fs.dirs.DocumentDir + "/Songbird/")
            .then((res) =>
                {
                    if (!res) {
                        console.log("Creating App directory...", RNFetchBlob.fs.dirs.DocumentDir, "/Songbird/")
                        RNFetchBlob.fs.mkdir(RNFetchBlob.fs.dirs.DocumentDir + "/Songbird/")
                            .then((res) => {console.log("App directory created..")})
                            .catch((err) => {console.log(err)})
                    }
                }
            );
    }
    else {
        console.log(RNFetchBlob.fs.dirs.DocumentDir);
        const granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
    }

    RNFetchBlob.fs.createFile(RNFetchBlob.fs.dirs.DocumentDir + "/Songbird/1.txt", RNFetchBlob.base64.encode('foo'), 'base64')
    fileList = RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DocumentDir);
    console.log("fileList: ", fileList);

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text >Connected: {device.name}</Text>
                    </CardItem>
                </Card>
                {/* <List dataArray={fileList}
                    renderRow={(files) => {
                        return 
                        <ListItem>
                            <Left>
                                <View style={styles.listLeft}>
                                    <Text>{files}</Text>   
                                </View>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                        }                
                    } >
                </List> */}
                {/* <View style={styles.ButtonSection} >
                    <Button rounded 
                        onPress={ () => {
                            dispatch(writePar("GpsCoordinates", GpsNew));
                        }}
                    >
                        <Text>Submit phone coordinates</Text>
                    </Button>
                </View> */}
            </Content>
      </Container>
      //onPress={dispatch(updateGps(gps))}
    );
    

    /*const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let GpsCoordinates = useSelector(state => state.BLEs.parameters.GpsCoordinates);
    let location = useSelector(state => state.BLEs.location);
    
    let DisplayGpsDevice = displayGpsDMS(GpsCoordinates);
    if (GpsCoordinates === "...") {
        DisplayGpsDevice[0] = "...";
        DisplayGpsDevice[1] = "...";
    }
    let GpsNew = convertDMS(location.latitude, location.longitude);
    let DisplayGpsNew = displayGpsDMS(GpsNew);

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text >Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text style={{fontWeight: "bold"}}>GPS Coordinates on Songbird device:</Text>
                            <Text>              Lat: {DisplayGpsDevice[0]} </Text>
                            <Text>              Long: {DisplayGpsDevice[1]} </Text>
                        </Body>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text style={{fontWeight: "bold"}}>GPS Coordinates on phone:</Text>
                        <Text>              Lat: {DisplayGpsNew[0]} </Text>
                        <Text>              Long: {DisplayGpsNew[1]} </Text>
                    </Body>
                </CardItem>
                </Card>
                <View style={styles.ButtonSection} >
                    <Button rounded 
                        onPress={ () => {
                            dispatch(writePar("GpsCoordinates", GpsNew));
                        }}
                    >
                        <Text>Submit phone coordinates</Text>
                    </Button>
                </View>
            </Content>
      </Container>
      //onPress={dispatch(updateGps(gps))}
    );*/
};

SaveFileSreen.navigationOptions = () => ({
    title: 'Save Files From Songbird (temp)'
  });



export default SaveFileSreen;