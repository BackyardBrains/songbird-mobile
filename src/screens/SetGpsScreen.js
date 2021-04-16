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
    
    let GpsCoordinates = useSelector(state => state.BLEs.parameters.GpsCoordinates);
    let location = useSelector(state => state.BLEs.location);
    
    let coords = GpsCoordinates.split(':');
    let GpsNew = convertDMS(location.latitude, location.longitude);
    let DisplayGps = displayGpsDMS(GpsNew);

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
                            <Text>              Lat: {coords[0]} </Text>
                            <Text>              Long: {coords[1]} </Text>
                        </Body>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text style={{fontWeight: "bold"}}>GPS Coordinates on phone:</Text>
                        <Text>              Lat: {DisplayGps[0]} </Text>
                        <Text>              Long: {DisplayGps[1]} </Text>
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
    );
};

SetGpsScreen.navigationOptions = () => ({
    title: 'Set GPS Coordinates'
  });



export default SetGpsScreen;