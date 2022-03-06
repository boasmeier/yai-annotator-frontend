import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Annotation } from 'src/app/models/annotation';

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

    constructor(private annotationService: AnnotationService,
        private messageService: MessageService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.getAnnotations();
    }

    getAnnotations(): void {
        const idimage = Number(this.route.snapshot.paramMap.get('idimage'));
        this.annotationService.getAnnotations().subscribe(annotations => {
            this.annotations = annotations.filter(a => a.idimage == idimage);
        });
    }

    save(id: number): void {
        console.log(id);
        const annotation = this.annotations[id];
        console.log(annotation);
        this.annotationService.updateAnnotation(annotation)
                .subscribe();
    }

}
