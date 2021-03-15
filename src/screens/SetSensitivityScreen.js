
import React from 'react';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import { updateSensitivity } from '../actions';
import { Container, Content,Picker, Form, Card, CardItem, Text, Item } from 'native-base';
import { onChange } from 'react-native-reanimated';

const SetSensitivityScreen = () => {
    const dispatch = useDispatch();
    let device = useSelector(state => state.BLEs.connectedDevice);
    
    let parameters = useSelector(state => state.BLEs.parameters);


    return (
        <Container>
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text>Connected: {device.name}</Text>
                    </CardItem>
                </Card>
                <Form>
                    <Item picker>
                        <Picker
                            note
                            mode="dropdown"
                            style={{ width: '100%' }}
                            selectedValue={parameters.Sensitivity}
                            onValueChange={(value) => {
                                console.log(value);
                                //dispatch(updateSensitivity(value));
                                onChange(parameters.Sensitivity);
                                console.log(parameters.Sensitivity);

                            }}
                        >
                            <Picker.Item label="High" value="High" />
                            <Picker.Item label="Medium" value="Medium" />
                            <Picker.Item label="Low" value="Low" />
                        </Picker>
                    </Item>
                </Form>
            </Content>
      </Container>
    );
};


export default SetSensitivityScreen;