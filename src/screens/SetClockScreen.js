
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
                            clockVal = value;
                        }}/>
                    </Item>
                </Form>
                <Button
                    title="Submit"
                    onPress={ () => {
                        dispatch(changeParameter(thisParameter, clockVal))
                    }}
                >
                </Button>
            </Content>
      </Container>
      //onPress={dispatch(updateClock(clock))}
    );
};


export default SetClockScreen;