import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Image } from '../../models/image';
import { ImageService } from '../../services/image.service';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'images',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
    images: Image[] = [];
    selectedImage?: Image;

    constructor(private imageService: ImageService,
        private messageService: MessageService, private route: ActivatedRoute,) {
    }

    onSelect(image: Image): void {
        this.selectedImage = image;
        this.messageService.info(`DatasetDetailComponent: Selected image id=${image.idimage}`);
    }

    ngOnInit(): void {
        this.getImages();
    }

    getImages(): void {
        const iddataset = Number(this.route.snapshot.paramMap.get('iddataset'));
        this.imageService.getImages().subscribe(images => {
            this.images = images.filter(i => i.iddataset == iddataset);
        });
    }

    delete(image: Image): void {
        this.images = this.images.filter(d => d !== image);
        this.imageService.deleteImage(image.idimage).subscribe();
    }
}
