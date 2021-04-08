import React from 'react';
import { View } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { writePar, mapSRCodeToVal } from '../actions/interface';
import { Container, Picker, Content, Button, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';


const SetSamplingRateScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let SamplingRate = useSelector(state => state.BLEs.parameters.SamplingRate);
    
    let newVal = "";

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text>Current Sampling Rate: {mapSRCodeToVal[SamplingRate]} kHz</Text>
                    </Body>
                </CardItem>
                </Card>
                <Form>
                    <Item picker>
                        <Picker
                            note
                            mode="dropdown"
                            style={{ width: '100%' }}
                            selectedValue={SamplingRate}
                            onValueChange={(value) => {
      		                    dispatch(writePar('SamplingRate', value));
                            }}
                        >
                            <Picker.Item label="12 kHz" value="5" />
                            <Picker.Item label="24 kHz" value="4" />
                            <Picker.Item label="48 kHz" value="3" />
                            <Picker.Item label="96 kHz" value="2" />
                            <Picker.Item label="192 kHz" value="1" />
                            <Picker.Item label="384 kHz" value="0" />
                        </Picker>
                    </Item>
                </Form>
            </Content>
      </Container>
      //onPress={dispatch(updateSampleRate(rate))}
    );
};

SetSamplingRateScreen.navigationOptions = () => ({
    title: 'Set Device Sampling Rate'
  });


export default SetSamplingRateScreen;