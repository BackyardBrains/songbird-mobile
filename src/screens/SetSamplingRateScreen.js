import React, { useEffect } from 'react';
import { View, LogBox } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { writePar, mapSRCodeToVal } from '../actions/interface';
import { Container, Picker, Content, Button, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';


const SetSamplingRateScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])
    
    let SamplingRate = useSelector(state => state.BLEs.parameters.SamplingRate);
    
    let DisplaySR = mapSRCodeToVal[SamplingRate] + " kHz";

    return (
        <Container>
            <Content>
                <Card >
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body style={{ flexDirection: 'row'}}>
                        <View style={{ flexDirection: 'column', height: '85%', justifyContent: 'center'}}><Text>Current Sampling Rate:</Text></View>
                        <Form style={{alignItems: 'stretch'}}>
                    
                        <Picker
                            note
                            placeholder={DisplaySR}
                            mode="dropdown"
                            style={{ width: '100%', justifyContent: 'flex-start', marginLeft: 10 }}
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
                    
                </Form>
                    </Body>
                </CardItem>
                </Card>
                
            </Content>
      </Container>
      //onPress={dispatch(updateSampleRate(rate))}
    );
};

SetSamplingRateScreen.navigationOptions = () => ({
    title: 'Set Device Sampling Rate'
  });


export default SetSamplingRateScreen;