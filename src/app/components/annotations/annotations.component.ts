import { Component, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Annotation } from 'src/app/models/annotation';
import { InsertAnnotation } from 'src/app/models/insertAnnotation';
import { AnnotationService } from '../../services/annotation.service';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'annotations',
    templateUrl: './annotations.component.html',
    styleUrls: ['./annotations.component.scss']
})
export class AnnotationsComponent implements OnInit {
    annotations: Annotation[] = [];
    selectedAnnotation?: Annotation;
    @Input() newAnnotation!: InsertAnnotation;
    @Output() annotationsFetchedEvent: EventEmitter<Annotation[]> = new EventEmitter<Annotation[]>();

    constructor(private annotationService: AnnotationService,
        private messageService: MessageService, private route: ActivatedRoute) { }

    ngOnChanges(changes: { [property: string]: SimpleChange }) {
        if (changes['newAnnotation'] && changes['newAnnotation'].previousValue != changes['newAnnotation'].currentValue) {
            this.add(changes['newAnnotation'].currentValue);
        }
    }

    add(annotation: InsertAnnotation): void {
        this.annotationService.addAnnotation(annotation)
            .subscribe(annotation => {
                this.getAnnotations();
            });
    }

    ngOnInit(): void {
        this.getAnnotations();
    }

    getAnnotations(): void {
        const idimage = Number(this.route.snapshot.paramMap.get('idimage'));
        this.annotationService.getAnnotations().subscribe(annotations => {
            this.annotations = annotations.filter(a => a.idimage == idimage);
            this.annotationsFetchedEvent.emit(this.annotations);
        });
    }

    save(id: number): void {
        const annotation = this.annotations[id];
        this.annotationService.updateAnnotation(annotation)
            .subscribe(() => {
                this.annotationsFetchedEvent.emit(this.annotations);
            });
    }

    delete(id: number): void {
        const annotation = this.annotations[id];
        this.annotationService.deleteAnnotation(annotation.idannotation).subscribe(() => {
            this.getAnnotations();
        });
    }

}
