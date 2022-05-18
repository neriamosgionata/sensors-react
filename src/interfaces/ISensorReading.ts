import SensorTypeEnum from '../enums/SensorTypeEnum';

export interface ISensorReading {
    sensor_id: string,
    reading: string,
    datetime: number,
    sensor_type: SensorTypeEnum | null,
}
