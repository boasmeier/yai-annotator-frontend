import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Image } from '../../models/image';
import { ImageService } from '../../services/image.service';
import { MessageService } from '../../services/message.service';
import { ImageSnippet } from '../../models/imageSnippet';

@Component({
    selector: 'image-annotation',
    templateUrl: './image-annotation.component.html',
    styleUrls: ['./image-annotation.component.scss']
})
export class ImageAnnotationComponent implements OnInit {
    @Input() image?: Image[];
    imageSnippet?: ImageSnippet;

    constructor(
        private route: ActivatedRoute,
        private imageService: ImageService,
        private location: Location,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.getImage();
    }

    getImage(): void {
        const id = Number(this.route.snapshot.paramMap.get('idimage'));
        this.imageService.getImage(id).subscribe(image => {
            this.image = image;
        });
        this.imageService.getImageFile(id).subscribe(blob => {
            const reader = new FileReader();
            reader.addEventListener('load', (event: any) => {
                this.imageSnippet = event.target.result;
            });
            if(blob) {
                reader.readAsDataURL(blob);
            }
        });
    }

}
