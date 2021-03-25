import React, {useState} from 'react';
import { View, TouchableOpacity, Button } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { updateSampleRate } from '../actions';
import { Container, Content, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';


const SetSamplingRateScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let parameters = useSelector(state => state.BLEs.parameters);
    const [rate, setRate] = useState(parameters.SamplingRate);

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text>Current Sampling Rate: {parameters.SamplingRate} kHz</Text>
                    </Body>
                </CardItem>
                </Card>
                <Form>
                    <Item fixedLabel>
                        <Label>New Sampling Rate</Label>
                        <Input 
                            keyboardType = 'numeric'
                            onChangeText={(value) => {
                                var reg = new RegExp(/^[1-9]\d*(\.\d{1,2})?$/);
                                if (reg.test(value)) {
                                    setRate(value);
                                }
                                else{
                                    alert('Songbirds will ignore any inputs other than number in this section');
                                    value = value.replace(/[^0-9.]/g, "");
                                }
                                console.log(rate);
                        }}/>
                    </Item>
                </Form>
                <Button
                    title="Submit">
                </Button>
            </Content>
      </Container>
      //onPress={dispatch(updateSampleRate(rate))}
    );
};


export default SetSamplingRateScreen;