import SensorTypeEnum from '../enums/SensorTypeEnum';

export interface ISensorData {
    name: string;
    ip_address: string;
    ip_port: number;
    type: SensorTypeEnum | null;
}
