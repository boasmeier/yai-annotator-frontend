import { Dimension } from './dimension';

export interface Dataset {
    iddataset: number;
    name: string;
    description: string;
    dimension: Dimension;
    size: number;
}