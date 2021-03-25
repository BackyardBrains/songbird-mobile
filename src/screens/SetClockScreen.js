
import React, {useState} from 'react';
import { View, TouchableOpacity, Button } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { updateClock } from '../actions';
import { Container, Content, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';

const SetClockScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let parameters = useSelector(state => state.BLEs.parameters);
    const [clock, setClock] = useState(parameters.DeviceClock);

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text>Current Clock: {parameters.DeviceClock} </Text>
                    </Body>
                </CardItem>
                </Card>
                <Form>
                    <Item fixedLabel>
                        <Label>New Clock</Label>
                        <Input onChangeText={(value) => {
                            var reg = new RegExp(/^\d\d{0,1}(\:\d{2}){2}$/);
                            if (reg.test(value)) {
                                setClock(value);
                            }
                            else{
                                alert('Songbirds will ignore any inputs other than number in this section');
                                value = value.replace(/[^0-9:]/g, "");
                            }
                            console.log(clock);
                        }}/>
                    </Item>
                </Form>
                <Button
                    title="Submit">
                </Button>
            </Content>
      </Container>
      //onPress={dispatch(updateClock(clock))}
    );
};


export default SetClockScreen;