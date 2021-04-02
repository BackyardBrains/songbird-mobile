import React, {useState} from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { changeParameter } from '../actions';
import { Container, Content, Form, Button, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';

const SetClockScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let DeviceClock = useSelector(state => state.BLEs.parameters.DeviceClock);
    let clockVal = DeviceClock;

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
                <Form>
                    <Item fixedLabel>
                        <Label>New Time</Label>
                        <Input onChangeText={(value) => {
                            clockVal = value;
                            console.log(clockVal);
                        }}/>
                    </Item>
                </Form>
                <View style={styles.ButtonSection} >
                    <Button rounded 
                        onPress={ () => {
                            var reg = new RegExp(/^\d\d{0,1}(\:\d{2}){1}$/);
                            if (!reg.test(clockVal)){
                                alert('Songbirds will ignore any inputs other than time in this section');
                            }
                            else{
                                dispatch(writePar("DeviceClock", clockVal));
                            }
                        }}
                    >
                        <Text>Submit</Text>
                    </Button>
                </View>
            </Content>
      </Container>
      //onPress={dispatch(updateClock(clock))}
    );
};


SetClockScreen.navigationOptions = () => ({
    title: 'Set Device Clock'
  });

export default SetClockScreen;