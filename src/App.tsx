import React, {useState} from 'react';
import './App.css';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import io from 'socket.io-client';
import {ISensorData} from './interfaces/ISensorData';
import SensorTypeEnum from './enums/SensorTypeEnum';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ISensorReading} from './interfaces/ISensorReading';

function App() {
    const endpoint = 'http://localhost:4000';

    const [socket, setSocket] = useState({} as any);
    const [registeredId, setRegisteredId] = useState('');
    const [listOfSensorDataReading, setListOfSensorDataReading] = useState([] as ISensorReading[]);
    const [connected, setConnected] = useState(false);

    const [sensorData, setSensorData] = useState({
        name: '',
        ip_address: '',
        ip_port: 0,
        type: null,
    } as ISensorData);

    const [sensorDataReading, setSensorDataReading] = useState({
        sensor_id: '',
        reading: '',
        datetime: 0,
        sensor_type: SensorTypeEnum.LIGHT,
    } as ISensorReading);

    // socket

    const connect = () => {
        const socket = io(endpoint);
        socket.connect();
        setSocket(socket);
        setConnected(true);
    };

    const disconnect = () => {
        if (socket.disconnect) {
            socket.disconnect();
        }
        setSocket({});
        setRegisteredId('');
        setConnected(false);
    };

    const registerNewSensor = () => {
        if (connected) {
            socket.on('newSensorDone', (args: any) => {
                setRegisteredId(args.id);
            });

            console.log('newSensor', sensorData);

            socket.emit('newSensor', sensorData);
            console.log('data sent to server through socket');
        }
    };

    const saveNewSensorData = () => {
        if (connected) {
            socket.on('newSensorReadingDone', (args: any) => {
                setListOfSensorDataReading(args.list);
            });
            sensorDataReading.datetime = (new Date()).getTime();

            const sensorType = sensorData.type;

            // @ts-ignore
            sensorDataReading.sensor_type = parseInt(sensorType);
            sensorDataReading.sensor_id = registeredId;

            console.log('newSensorReading', sensorDataReading);

            socket.emit('newSensorReading', sensorDataReading);
            console.log('data sent to server through socket');
        }
    };

    // form

    const changeValueRegisterForm = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const okey = key as keyof typeof sensorData;
        const newSensorData = {...sensorData};
        // @ts-ignore
        newSensorData[okey] = event.target.value;
        setSensorData(newSensorData);
    };

    const changeValueDataForm = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const okey = key as keyof typeof sensorDataReading;
        const newSensorDataReading = {...sensorDataReading};
        // @ts-ignore
        newSensorDataReading[okey] = event.target.value;
        setSensorDataReading(newSensorDataReading);
    };

    // render

    const optionEnumTypes = Object.entries(SensorTypeEnum).filter((type) => {
        return typeof type[1] === 'number';
    }).map((type, index) => {
        return <option value={type[1]} key={index}>{type[0]}</option>;
    });

    return (
        <div className="App">
            <Container fluid className="mt-5">
                <Row>
                    <Col md={3}></Col>
                    <Col md={6}>
                        <Form>
                            <Form.Group className="mb-3" controlId="formSensorName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Sensor name:"
                                    defaultValue={''}
                                    onChange={(event) => changeValueRegisterForm('name', event)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formSensorIp">
                                <Form.Label>Ip address</Form.Label>
                                <Form.Control
                                    type="text" placeholder="Sensor ip address:"
                                    defaultValue={''}
                                    onChange={(event) => changeValueRegisterForm('ip_address', event)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formSensorIpPort">
                                <Form.Label>Ip port</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Sensor ip port:"
                                    defaultValue={''}
                                    onChange={(event) => changeValueRegisterForm('ip_port', event)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formSensorType">
                                <Form.Label>Sensor type</Form.Label>
                                <Form.Select
                                    aria-label="Sensor type"
                                    onChange={(event) => changeValueRegisterForm('type', event)}
                                >
                                    <option>Select sensor type</option>
                                    {
                                        optionEnumTypes
                                    }
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={3}></Col>
                </Row>
                <Row className="mt-5">
                    <Col md={3}></Col>
                    <Col md={6}>
                        <Button onClick={connect}>
                            CONNECT SOCKET
                        </Button>
                        <Button onClick={disconnect}>
                            DISCONNECT SOCKET
                        </Button>
                    </Col>
                    <Col md={3}></Col>
                </Row>
                <Row className="mt-2">
                    <Col md={3}></Col>
                    <Col md={6}>
                        <Button onClick={registerNewSensor} disabled={!connected && registeredId === ''}>
                            REGISTER NEW SENSOR
                        </Button>
                    </Col>
                    <Col md={3}></Col>
                </Row>
            </Container>

            {
                registeredId !== '' &&
                <div className="mt-5">
                    <h3> Registered id: {registeredId}</h3>
                </div>
            }

            <div className="mt-5">
                Socket {connected ? 'connected' : 'disconnected'}
            </div>

            {
                connected && registeredId !== '' &&
                <Container fluid className="mt-5">
                    <Row className="mt-2">
                        <Col md={3}></Col>
                        <Col md={6}>
                            <Form>
                                <Form.Group className="mb-3" controlId="formSensorDataReading">
                                    <Form.Label>Reading</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Reading:"
                                        defaultValue={''}
                                        onChange={(event) => changeValueDataForm('reading', event)}
                                    />
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                    <Row className="mt-2">
                        <Col md={3}></Col>
                        <Col md={6}>
                            <Button onClick={saveNewSensorData}>
                                SAVE NEW SENSOR READING
                            </Button>
                        </Col>
                        <Col md={3}></Col>
                    </Row>

                    {
                        listOfSensorDataReading.length &&
                        listOfSensorDataReading.map((reading, index) => {
                            return (
                                <Row key={index}>

                                    <Col key={index}>
                                        <h2>{reading.reading + '-' + new Date(reading.datetime)}</h2>
                                    </Col>
                                </Row>
                            );
                        })
                    }
                </Container>
            }
        </div>
    );
}

export default App;
