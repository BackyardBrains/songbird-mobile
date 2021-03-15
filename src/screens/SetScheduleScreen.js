
import React, {useState} from 'react';
import { View, TouchableOpacity, Button } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { updateSchedule } from '../actions';
import { Container, Content, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';

const SetScheduleScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let parameters = useSelector(state => state.BLEs.parameters);
    const [start, setStart] = useState(parameters.ScheduleStart);
    const [end, setEnd] = useState(parameters.ScheduleEnd);

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
                            setStart(value);
                            console.log(start);
                        }}/>
                    </Item>
                    <Item fixedLabel>
                        <Label>New End</Label>
                        <Input onChangeText={(value) => {
                            setEnd(value);
                            console.log(end);
                        }}/>
                    </Item>
                </Form>
                <Button
                    title="Submit">
                </Button>
            </Content>
      </Container>
      //onPress={dispatch(updateSchedule(start, end))}
    );
};


export default SetScheduleScreen;