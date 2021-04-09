import React, { useState, useEffect } from "react";
import { View } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { writePar } from '../actions/interface';
import { Container, Content, Button, Text, Card, CardItem, Body } from 'native-base';
import convertToDisplay from '../actions/TimeLocation';


const SetClockScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let DeviceClock = useSelector(state => state.BLEs.parameters.DeviceClock);

    const [dateTime, setDt] = useState(new Date());
    useEffect(() => {
        let secTimer = setInterval( () => {
          setDt(new Date())
        },1000)

        return () => clearInterval(secTimer);
    }, []);
    // https://stackoverflow.com/questions/41294576/react-native-show-current-time-and-update-the-seconds-in-real-time

    
    //Current Day-Of-Month
    let date = (100 + parseInt(dateTime.getDate())).toString(10).substring(1); //Current Day-Of-Month
    let month = (100 + parseInt(dateTime.getMonth() + 1)).toString(10).substring(1); //Current Month
    let year = (100 + parseInt(dateTime.getFullYear() - 2000)).toString(10).substring(1); //Current Year
    let hours = (100 + parseInt(dateTime.getHours())).toString(10).substring(1); //Current Hours
    let min = (100 + parseInt(dateTime.getMinutes())).toString(10).substring(1); //Current Minutes
    let sec = (100 + parseInt(dateTime.getSeconds())).toString(10).substring(1); //Current Seconds

    clockVal = hours + ':' + min + ':' + sec + ':'+ month + ':' + date + ':' + year;

//
    let displayDeviceClock = convertToDisplay(DeviceClock);
    let displayPhoneClock = convertToDisplay(clockVal);



    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text style={{fontWeight: "bold"}}> Device Time (last refresh): </Text>
                        <Text>              {displayDeviceClock} </Text>
                        <Text style={{fontWeight: "bold"}}> Phone Time: </Text>
                        <Text>              {displayPhoneClock} </Text>
                    </Body>
                </CardItem>
                </Card>
                <View style={styles.ButtonSection} >
                    <Button rounded 
                        onPress={ () => {
                            
                            console.log(clockVal);
                            dispatch(writePar("DeviceClock", clockVal));
                        }}
                    >
                        <Text>Submit Phone Time</Text>
                    </Button>
                </View>
            </Content>
      </Container>
    );
};


SetClockScreen.navigationOptions = () => ({
    title: 'Set Device Clock'
  });

export default SetClockScreen;