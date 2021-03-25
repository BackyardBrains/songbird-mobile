
import React, {useState} from 'react';
import { View, TouchableOpacity, Button } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { changeParameter } from '../actions';
import { Container, Content, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';

const SetClockScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let parameters = useSelector(state => state.BLEs.parameters);
    const thisParameter = "DeviceClock";
    let clockVal = parameters[thisParameter];
    let anyAlert = false;
    

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text> Clock on last re-render: {parameters.DeviceClock} </Text>
                    </Body>
                </CardItem>
                </Card>
                <Form>
                    <Item fixedLabel>
                        <Label>New Clock</Label>
                        <Input onChangeText={(value) => {
                            var reg = new RegExp(/^\d{1,2}(\:\d{2}){2}$/);
                            if (!reg.test(value)) {
                                if (!anyAlert){
                                    alert('Songbirds will ignore any inputs other than number in this section');
                                    anyAlert = true;
                                }
                                value = value.replace(/[^0-9:]/g, "");
                            }
                            clockVal = value;
                            console.log(clockVal);
                        }}/>
                    </Item>
                </Form>
                <Button
                    title="Submit"
                    onPress={ () => {
                        var reg = new RegExp(/^\d\d{0,1}(\:\d{2}){2}$/);
                        if (!reg.test(clockVal)) {
                            alert('Songbirds will ignore any inputs other than number in this section');
                            clockVal = clockVal.replace(/[^0-9:]/g, "");
                        }
                        else{
                            dispatch(changeParameter(thisParameter, clockVal));
                        }
                    }}
                >
                </Button>
            </Content>
      </Container>
      //onPress={dispatch(updateClock(clock))}
    );
};


export default SetClockScreen;