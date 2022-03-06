import { Point } from './point';

export interface Annotation {
    idannotation: number;
    idimage: number;
    object: string;
    points: Point[];
    timestamp: string;
}