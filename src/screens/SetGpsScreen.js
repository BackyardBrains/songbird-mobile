import React from 'react';
import { View } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { writePar } from '../actions/interface';
import { Container, Content, Button, Text, Card, CardItem, Body } from 'native-base';
import { convertDMS, displayGpsDMS } from '../actions/TimeLocation'


const SetGpsScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    

    // GpsNew is the value that will be sent to the Songbird device. 
    // TODO:: this could probably be moved to the backend
    let GpsCoordinates = useSelector(state => state.BLEs.parameters.GpsCoordinates);
    let location = useSelector(state => state.BLEs.location);
    let GpsNew = convertDMS(location.latitude, location.longitude);


    let DisplayGpsDevice = displayGpsDMS(GpsCoordinates);
    if (GpsCoordinates === "...") {
        DisplayGpsDevice[0] = "...";
        DisplayGpsDevice[1] = "...";
    }



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
                        disabled={DisplayGpsDevice[0] === "..."}
                        onPress={ () => {
                            dispatch(writePar("GpsCoordinates", GpsNew));
                        }}
                    >
                        <Text>{DisplayGpsDevice[0] === "..." ? "Communicating..." : "Submit phone coordinates"}</Text>
                    </Button>
                </View>
            </Content>
      </Container>
      //onPress={dispatch(updateGps(gps))}
    );
};

SetGpsScreen.navigationOptions = () => ({
    title: 'Set GPS Coordinates'
  });



export default SetGpsScreen;