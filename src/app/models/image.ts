import { Dimension } from './dimension';

export interface MyImage {
    idimage: number;
    iddataset: number;
    originalDimension: Dimension;
    destination: string;
    name: string;
    mimetype: string;
    size: number;
    status: boolean;
}