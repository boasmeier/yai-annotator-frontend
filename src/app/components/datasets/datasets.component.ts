import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Dataset } from '../../models/dataset';
import { InsertDataset } from '../../models/insertDataset';
import { DatasetService } from '../../services/dataset.service';
import { MessageService } from '../../services/message.service';
import { InsertDimension } from 'src/app/models/insertDimension';

@Component({
    selector: 'datasets',
    templateUrl: './datasets.component.html',
    styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements AfterViewInit {
    datasets: Dataset[] = [];
    displayedColumns: string[] = ['iddataset', 'name', 'description', 'dimension'];
    selectedDataset?: Dataset;
    insertFormActive: Boolean = false;
    datasetForm: FormGroup;
    submitted = false;
    submittedAndValid = false;

    dataSource: MatTableDataSource<Dataset> = new MatTableDataSource<Dataset>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private datasetService: DatasetService, private messageService: MessageService, private formBuilder: FormBuilder) {
        this.datasetForm = this.getForm();
    }

    ngAfterViewInit() {
        this.getDatasets();
    }

    getForm() {
        return this.formBuilder.group({
            name: ['', [
                Validators.required,
                Validators.pattern("^[^0-9`~!@#$%^&*()_+={}|:;“’<,>.?๐฿]*$")]
            ],
            description: ['', [Validators.max(20)]],
            width: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            height: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
        });
    }

    onSubmit(data: any) {
        this.submitted = true;

        // stop here if form is invalid
        if (this.datasetForm.invalid) {
            return;
        }

        this.submittedAndValid = true;
        this.submitted = false;
        this.datasetForm = this.getForm();
        const inserDataset = this.parseFormData(data);
        console.log('Submit: ', inserDataset);
        this.add(inserDataset);
        this.toggleInsertForm();
        setTimeout(() => this.submittedAndValid = false, 5000);
        return;
    }

    parseFormData(data: any) {
        const insertDataset = new InsertDataset(
            data.name,
            data.description,
            new InsertDimension(data.width, data.height)
        );
        return insertDataset;
    }

    onSelect(dataset: Dataset): void {
        this.selectedDataset = dataset;
        this.messageService.info(`DatasetComponent: Selected dataset id=${dataset.iddataset}`);
    }

    getDatasets(): void {
        this.datasetService.getDatasets().subscribe(datasets => {
            this.datasets = datasets;
            this.dataSource = new MatTableDataSource<Dataset>(datasets);
            this.dataSource.paginator = this.paginator;
        });
    }

    delete(dataset: Dataset): void {
        this.datasets = this.datasets.filter(d => d !== dataset);
        this.datasetService.deleteDataset(dataset.iddataset).subscribe();
    }

    toggleInsertForm() {
        this.insertFormActive = !this.insertFormActive;
    }

    add(dataset: InsertDataset): void {
        dataset.name = dataset.name.trim();
        dataset.description = dataset.description.trim();
        this.datasetService.addDataset(dataset)
            .subscribe(dataset => {
                this.getDatasets();
            });
    }
}
