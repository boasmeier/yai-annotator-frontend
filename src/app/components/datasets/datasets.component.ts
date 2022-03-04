import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Dataset } from '../../models/dataset';
import { DatasetService } from '../../services/dataset.service';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'datasets',
    templateUrl: './datasets.component.html',
    styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit {
    datasets: Dataset[] = [];
    selectedDataset?: Dataset;
    dataSource: MatTableDataSource<Dataset>;

    constructor(private datasetService: DatasetService, private messageService: MessageService) {
    }

    onSelect(dataset: Dataset): void {
        this.selectedDataset = dataset;
        this.messageService.info(`DatasetComponent: Selected dataset id=${dataset.iddataset}`);
    }

    ngOnInit(): void {
        this.getDatasets();
    }

    getDatasets(): void {
        this.datasetService.getDatasets().subscribe(datasets => {
            this.datasets = datasets;
            this.dataSource = new MatTableDataSource<Dataset>(datasets);
        });
    }

    delete(dataset: Dataset): void {
        this.datasets = this.datasets.filter(d => d !== dataset);
        this.datasetService.deleteDataset(dataset.iddataset).subscribe();
    }
}
