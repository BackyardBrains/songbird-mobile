
import React from 'react';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { changeParameter, updateSound } from '../actions';
import { Container, Content,Picker, Form, Card, CardItem, Text } from 'native-base';
import { onChange } from 'react-native-reanimated';

const SetSoundScreen = () => {

    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let parameters = useSelector(state => state.BLEs.parameters);
    const thisParameter = "SoundLevel"

    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                </Card>
                <Form>
                    <Picker
                        note
                        mode="dropdown"
                        style={{ width: 120 }}
                        selectedValue={parameters.SoundLevel}
                        onValueChange={(value) => {
                            console.log(value);
                            dispatch(changeParameter(thisParameter, value));
                            onChange(parameters.SoundLevel);
                            console.log(parameters.SoundLevel);

                        }}
                    >
                        <Picker.Item label="High" value="High" />
                        <Picker.Item label="Medium" value="Medium" />
                        <Picker.Item label="Low" value="Low" />
                    </Picker>
                </Form>
            </Content>
      </Container>
    );
};


export default SetSoundScreen;