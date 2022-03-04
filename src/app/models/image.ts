import { Dimension } from './dimension';

export interface Image {
    idimage: number;
    iddataset: number;
    originalDimension: Dimension;
    destination: string;
    name: string;
    mimetype: string;
    size: number;
    status: boolean;
}