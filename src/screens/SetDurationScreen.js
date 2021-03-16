import React from 'react';
import { Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { changeParameter } from '../actions';
import { Container, Content, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';


const SetDurationScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let parameters = useSelector(state => state.BLEs.parameters);
    const thisParameter = "RecordingDuration";
    let durationVal = parameters[thisParameter];

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text>Current Duration: {parameters.RecordingDuration} hours</Text>
                    </Body>
                </CardItem>
                </Card>
                <Form>
                    <Item fixedLabel>
                        <Label>New Duration</Label>
                        <Input 
                            keyboardType = 'numeric'
                            onChangeText={(value) => {
                                durationVal = value;
                        }}/>
                    </Item>
                </Form>
                <Button
                    title="Submit"
                    onPress={ () => {
                        dispatch(changeParameter(thisParameter, durationVal))
                    }}
                >
                </Button>
            </Content>
      </Container>
    );
};


export default SetDurationScreen;