import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MyImage } from '../../models/image';
import { ImageSnippet } from '../../models/imageSnippet';
import { InsertAnnotation } from 'src/app/models/insertAnnotation';
import { Annotation } from 'src/app/models/annotation';
import { InsertPoint } from 'src/app/models/insertPoint';
import { ImageService } from '../../services/image.service';
import { MessageService } from '../../services/message.service';
import { AnnotationService } from 'src/app/services/annotation.service';

@Component({
    selector: 'image-annotation',
    templateUrl: './image-annotation.component.html',
    styleUrls: ['./image-annotation.component.scss']
})
export class ImageAnnotationComponent implements OnInit, AfterViewInit {
    @Input() image!: MyImage[];
    @ViewChild("canvas") canvas!: ElementRef;
    public imageSnippet!: ImageSnippet;
    private context!: CanvasRenderingContext2D;
    private annotating: boolean;
    private scaleFactor: number;
    private startRectX: number;
    private startRectY: number;
    private stopRectX: number;
    private stopRectY: number;
    public newAnnotation!: InsertAnnotation;
    private annotations!: Annotation[];
    private imgTag: HTMLImageElement;


    constructor(
        private route: ActivatedRoute,
        private imageService: ImageService,
        private location: Location,
        private messageService: MessageService
    ) {
        this.annotating = false;
        this.scaleFactor = 1;
        this.startRectX = 0;
        this.startRectY = 0;
        this.stopRectX = 0;
        this.stopRectY = 0;
        this.imgTag = new Image;
    }

    startAnnotating = (e: any) => {
        this.annotating = true;
        this.startRectX = e.offsetX / this.scaleFactor;
        this.startRectY = e.offsetY / this.scaleFactor;
        this.messageService.debug(`Start annotating - OffsetX=${e.offsetX}, OffsetY=${e.offsetY}`);
    }

    finishedAnnotating = (e: any) => {
        this.annotating = false;
        this.stopRectX = e.offsetX / this.scaleFactor;
        this.stopRectY = e.offsetY / this.scaleFactor;
        this.context.lineWidth = 5;
        this.context.lineCap = 'square';
        this.context.strokeStyle = 'red';
        this.context.strokeRect(this.startRectX, this.startRectY, this.stopRectX - this.startRectX, this.stopRectY - this.startRectY);
        this.createAnnotation();
        this.messageService.debug(`Stop annotating - OffsetX=${e.offsetX}, OffsetY=${e.offsetY}`);
    }

    annotate = (e: any) => {
        if (!this.annotating) {
            return;
        }
        this.context.lineWidth = 5;
        this.context.lineCap = 'square';
        this.context.lineTo(e.offsetX / this.scaleFactor, e.offsetY / this.scaleFactor);
        this.context.stroke();
    }

    createAnnotation() {
        const idimage = Number(this.route.snapshot.paramMap.get('idimage'));
        const point1: InsertPoint = new InsertPoint(this.startRectX, this.startRectY);
        const point2: InsertPoint = new InsertPoint(this.stopRectX, this.stopRectY);
        this.newAnnotation = new InsertAnnotation(idimage, 'object', [point1, point2]);
    }

    handleAnnotationsFetchedEvent(event: Annotation[]) {
        this.annotations = event;
        this.drawAnnotations();
        this.messageService.info("Event: received annotationsFetchedEvent");
    }

    drawAnnotations() {
        if(!this.annotations || !this.image) {
            return;
        }
        this.context.clearRect(0, 0, this.image[0].originalDimension.width, this.image[0].originalDimension.height);
        this.context.drawImage(this.imgTag, 0, 0);

        this.annotations.forEach((a: Annotation) => {
            this.context.lineWidth = 5;
            this.context.lineCap = 'square';
            this.context.strokeStyle = 'red';
            this.context.strokeRect(a.points[0].x, a.points[0].y, a.points[1].x - a.points[0].x, a.points[1].y - a.points[0].y);
        })
    }

    ngOnInit(): void {

    }

    goBack(): void {
        this.location.back();
    }

    delete(): void {
        const id = Number(this.route.snapshot.paramMap.get('idimage'));
        this.imageService.deleteImage(id).subscribe(() => {
            this.goBack();
        });
    }

    ngAfterViewInit(): void {
        this.getImage();
        this.canvas.nativeElement.addEventListener('mousedown', this.startAnnotating);
        this.canvas.nativeElement.addEventListener('mouseup', this.finishedAnnotating);
        //this.canvas.nativeElement.addEventListener('mousemove', this.annotate);
    }

    getImage(): void {
        const id = Number(this.route.snapshot.paramMap.get('idimage'));
        this.context = this.canvas.nativeElement.getContext('2d');
        this.imageService.getImage(id).subscribe(image => {
            this.image = image;
            this.getImageFile(id);
        });
    }

    getImageFile(id: number): void {
        this.imageService.getImageFile(id).subscribe(blob => {
            const reader = new FileReader();
            const file: File = new File([blob], this.image[0].name);
            reader.addEventListener('load', (event: any) => {
                this.imageSnippet = new ImageSnippet(event.target.result, file);
                this.imgTag.src = URL.createObjectURL(this.imageSnippet.file);
                this.imgTag.onload = () => {
                    this.scaleFactor = (800 / this.image[0].originalDimension.width);
                    this.canvas.nativeElement.width = this.image[0].originalDimension.width * this.scaleFactor;
                    this.canvas.nativeElement.height = this.image[0].originalDimension.height * this.scaleFactor;

                    this.context.scale(this.scaleFactor, this.scaleFactor);
                    this.context.drawImage(this.imgTag, 0, 0);
                    this.drawAnnotations();
                }
            });
            if (blob) {
                reader.readAsDataURL(blob);
            }
        });
    }
}
