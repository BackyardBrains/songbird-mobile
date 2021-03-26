
import React, {useState} from 'react';
import { View, TouchableOpacity, Button } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { changeParameter } from '../actions';
import { Container, Content, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';

const SetScheduleScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let parameters = useSelector(state => state.BLEs.parameters);
    const scheduleStart = "ScheduleStart";
    const scheduleEnd = "ScheduleEnd";
    let scheduleStartVal = parameters[scheduleStart];
    let scheduleEndVal = parameters[scheduleEnd];

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text>Current Schedule: {parameters.ScheduleStart} - {parameters.ScheduleEnd} </Text>
                    </Body>
                </CardItem>
                </Card>
                <Form>
                    <Item fixedLabel>
                        <Label>New Start</Label>
                        <Input onChangeText={(value) => {
                            console.log(value);
                            scheduleStartVal = value;
                        }}/>
                    </Item>
                    <Item fixedLabel>
                        <Label>New End</Label>
                        <Input onChangeText={(value) => {
                            scheduleEndVal = value;
                        }}/>
                    </Item>
                </Form>
                <Button
                    title="Submit"
                    onPress={ () => {
                        dispatch(changeParameter(scheduleStart, 
                                                scheduleStartVal, 
                                                scheduleEnd, 
                                                scheduleEndVal));
                    }}
                >
                </Button>
            </Content>
      </Container>
      //onPress={dispatch(updateSchedule(start, end))}
    );
};


export default SetScheduleScreen;