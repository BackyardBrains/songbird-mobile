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
                                var reg = new RegExp(/^[1-9]\d*(\.\d{1})?$/);
                                if (!reg.test(value)) {
                                    if (!anyAlert){
                                        alert('Songbirds will ignore any inputs other than number in this section');
                                        anyAlert = true;
                                    }
                                    value = value.replace(/[^0-9.]/g, "");
                                }
                                durationVal = value;
                                console.log(durationVal);
                        }}/>
                    </Item>
                </Form>
                <Button
                    title="Submit"
                    onPress={ () => {
                        var reg = new RegExp(/^[1-9]\d*(\.\d{1})?$/);
                        if (!reg.test(durationVal)) {
                            alert('Songbirds will ignore any inputs other than number in this section');
                            durationVal = durationVal.replace(/[^0-9.]/g, "");
                        }
                        else{
                            dispatch(changeParameter(thisParameter, durationVal));
                        }
                        
                    }}
                >
                </Button>
            </Content>
      </Container>
    );
};


export default SetDurationScreen;