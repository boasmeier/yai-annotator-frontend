import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Image } from '../../models/image';
import { ImageService } from '../../services/image.service';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'images',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements AfterViewInit {
    images: Image[] = [];
    selectedImage?: Image;
    imageUploadActive: boolean;

    displayedColumns: string[] = ['idimage', 'name', 'mimetype', 'status'];

    dataSource: MatTableDataSource<Image> = new MatTableDataSource<Image>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private imageService: ImageService,
        private messageService: MessageService, private route: ActivatedRoute,) {
            this.imageUploadActive = false;
    }

    onSelect(image: Image): void {
        this.selectedImage = image;
        this.messageService.info(`DatasetDetailComponent: Selected image id=${image.idimage}`);
    }

    ngAfterViewInit(): void {
        this.getImages();
    }

    getImages(): void {
        const iddataset = Number(this.route.snapshot.paramMap.get('iddataset'));
        this.imageService.getImages().subscribe(images => {
            this.images = images.filter(i => i.iddataset == iddataset);
            this.dataSource = new MatTableDataSource<Image>(this.images);
            this.dataSource.paginator = this.paginator;
        });
    }

    delete(image: Image): void {
        this.images = this.images.filter(d => d !== image);
        this.imageService.deleteImage(image.idimage).subscribe();
    }

    handleImageUploadEvent(event: string) {
        this.getImages();
        this.messageService.info(event);
    }

    toggleImageUpload() {
        this.imageUploadActive = !this.imageUploadActive;
    }
}
