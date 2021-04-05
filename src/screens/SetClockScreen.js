import React from 'react';
import { View } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { writePar } from '../actions/interface';
import { Container, Content, Button, Text, Card, CardItem, Body } from 'native-base';

const SetClockScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let DeviceClock = useSelector(state => state.BLEs.parameters.DeviceClock);
    let clockVal = DeviceClock;
    // will have to add function to convert user input to correct syntax
    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text> Current Time: {DeviceClock} </Text>
                    </Body>
                </CardItem>
                </Card>
                <View style={styles.ButtonSection} >
                    <Button rounded 
                        onPress={ () => {
                            let date = new Date().getDate(); //Current Date
                            let month = new Date().getMonth() + 1; //Current Month
                            let year = new Date().getFullYear(); //Current Year
                            let hours = new Date().getHours(); //Current Hours
                            let min = new Date().getMinutes(); //Current Minutes
                            let sec = new Date().getSeconds(); //Current Seconds
                            clockVal = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec;
                            console.log(clockVal);
                            dispatch(writePar("DeviceClock", clockVal));
                        }}
                    >
                        <Text>Submit</Text>
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