import React  from 'react';
import { View, LogBox } from 'react-native';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { writePar, mapSRCodeToVal } from '../actions/interface';
import { Container, Picker, Content, Button, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';


const SetSamplingRateScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
   
    
    let SamplingRate = useSelector(state => state.BLEs.parameters.SamplingRate);
   
    let DisplaySR = mapSRCodeToVal[SamplingRate] + " kHz";
    
    let DisplayValue = mapSRCodeToVal[DisplaySR];

    return (
        <Container>
            <Content>
                <Card >
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{ flexDirection: 'column', 
                                        height: '50%', 
                                        justifyContent: 'center'}}>
                            <Text>Current Sampling Rate:</Text>
                        </View>
                        <Form style={{ width: '100%', 
                                        justifyContent: 'flex-start', 
                                        marginLeft: 10 }}>
                            <Picker
                                style={{ width: '100%', 
                                        justifyContent: 'flex-start', 
                                        marginLeft: 10 }}
                                selectedValue={DisplayValue}
                                placeholder={DisplaySR}
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
    );
};

SetSamplingRateScreen.navigationOptions = () => ({
    title: 'Set Device Sampling Rate'
  });


export default SetSamplingRateScreen;