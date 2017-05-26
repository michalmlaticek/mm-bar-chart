import { SimpleChanges, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IBaseWidgetForm } from 'mm-dashboard-core';
import { IBarChartConfig } from '../../interfaces';
import { BarChartConfigFactory } from '../../services';
export declare class BarChartFormComponent implements OnInit, OnChanges, IBaseWidgetForm {
    private formBuilder;
    private configFactory;
    config: IBarChartConfig;
    configChange: EventEmitter<IBarChartConfig>;
    form: FormGroup;
    colTypes: any;
    aggregations: any;
    constructor(formBuilder: FormBuilder, configFactory: BarChartConfigFactory);
    ngOnInit(): void;
    ngOnChanges(changes?: SimpleChanges): void;
    initFormAndListen(): void;
    initForm(conf: IBarChartConfig): FormGroup;
    xTransferSuccess(event: any): void;
    yTransferSuccess(event: any): void;
    onColorChange(color: any): void;
}
