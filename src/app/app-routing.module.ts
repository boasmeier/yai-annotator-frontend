import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { DatasetDetailComponent } from './components/dataset-detail/dataset-detail.component';
import { ImageAnnotationComponent } from './components/image-annotation/image-annotation.component';

const routes: Routes = [
    { path: '', redirectTo: '/contact', pathMatch: 'full' },
    { path: 'contact', component: ContactFormComponent },
    { path: 'datasets', component: DatasetsComponent },
    { path: 'datasets/:iddataset', component: DatasetDetailComponent },
    { path: 'images/:idimage', component: ImageAnnotationComponent },
    { path: '**', component: PageNotFoundComponent}
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
