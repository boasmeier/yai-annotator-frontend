import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AbbreviationPipe } from './AbbreviationPipe';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { DatasetDetailComponent } from './components/dataset-detail/dataset-detail.component';
import { ImagesComponent } from './components/images/images.component';
import { ImageAnnotationComponent } from './components/image-annotation/image-annotation.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';

@NgModule({
    declarations: [
        AbbreviationPipe,
        AppComponent,
        PageNotFoundComponent,
        ContactFormComponent,
        DatasetsComponent,
        DatasetDetailComponent,
        ImagesComponent,
        ImageAnnotationComponent,
        ImageUploadComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
