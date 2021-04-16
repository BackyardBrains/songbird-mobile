import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { writePar } from '../actions/interface';
import { Container, Button, Content, Form, Text, Label, Card, CardItem, Body, Item, Input } from 'native-base';
import styles from '../styles/style';



const SetDurationScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    

    let RecordingDuration = useSelector(state => state.BLEs.parameters.RecordingDuration);
    
    let durationVal = RecordingDuration;
    if (RecordingDuration !== "...") RecordingDuration = parseInt(RecordingDuration);
   
    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                    <Body>
                        <Text>Current Duration: {RecordingDuration} mins</Text>
                    </Body>
                </CardItem>
                </Card>
                <Form>
                    <Item fixedLabel>
                        <Input 
                            placeholder='New Duration'
                            keyboardType='numeric'
                            onChangeText={(value) => { 
                                durationVal = value;
                                console.log(durationVal);
                        }}/>
                    </Item>
                </Form>
                <View style={styles.ButtonSection} >
                    <Button rounded 
                        onPress={ () => {
                            var reg = new RegExp(/^[1-9]\d*(\.\d{1})?$/);
                            if (!reg.test(durationVal)) {
                                alert('Songbirds will ignore any inputs other than number in this section');
                                durationVal = durationVal.replace(/[^0-9.]/g, "");
                            }
                            else{
                                // add zeros to durationval
                                durationVal = durationVal.toString(10).padStart(4);
                                console.log(durationVal);
                                dispatch(writePar("RecordingDuration", durationVal));
                            }
                            
                        }}
                    >
                        <Text>Submit</Text>
                    </Button>
                </View>
            </Content>
      </Container>
    );
};

SetDurationScreen.navigationOptions = () => ({
    title: 'Set Recording Duration'
  });


export default SetDurationScreen;