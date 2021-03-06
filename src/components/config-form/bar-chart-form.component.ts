import { Component, SimpleChanges, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EColType, EAggregation, IBaseWidgetForm } from 'mm-dashboard-core';
import { IBarChartConfig } from '../../interfaces';
import { BarChartConfigFactory } from '../../services';

@Component({
    selector: 'mm-bar-chart-form',
    template: `
    <div class="mm-chart-form" [formGroup]="form">
        <p>
            <label>Chart Name</label>
            <input type="text" formControlName="title">
        </p>
        <p>
            <label>Selected Color</label>
            <mm-single-color-selector [color]="config.color" (colorChange)="onColorChange($event)"></mm-single-color-selector>
		    <input type="text" formControlName="color" [style.display]="'none'">
        </p>
        <p formGroupName="xCol">
            <label>Column X</label>
            <input dnd-droppable (onDropSuccess)="xTransferSuccess($event)" type="text" formControlName="label">
            <input type="text" formControlName="name" [style.display]="'none'">
            <input type="text" formControlName="type" [style.display]="'none'">
        </p>
        <p formGroupName="yCol">
            <label>Column Y</label>
            <input dnd-droppable (onDropSuccess)="yTransferSuccess($event)" type="text" formControlName="label">
            <input type="text" formControlName="name" [style.display]="'none'">
            <input type="text" formControlName="type" [style.display]="'none'">
        </p>
        <p>
            <label>Show X Axis</label>
            <input type="checkbox" formControlName="showXAxis">
        </p>
        <p>
            <label>X Axis</label>
            <input type="text" formControlName="xAxisName">
        </p>
        <p>
            <label>Show Y Axis</label>
            <input type="checkbox" formControlName="showYAxis">
        </p>
        <p>
            <label>Y Axis</label>
            <input type="text" formControlName="yAxisName">
        </p>
        <p>
            <label>Aggregation type</label>
            <select formControlName="aggregation">
                <option *ngFor="let agg of aggregations | EKeys" [ngValue]="agg.key">{{agg.value}}</option>
            </select>
        </p>
    </div>
    `,
    styles: [
        `
        
        `
    ]

})
export class BarChartFormComponent implements OnInit, OnChanges, IBaseWidgetForm {
    @Input() config: IBarChartConfig;
    @Output() configChange: EventEmitter<IBarChartConfig> = new EventEmitter<IBarChartConfig>();

    form: FormGroup;
    colTypes: any;
    aggregations: any;

    constructor(private formBuilder: FormBuilder,
        private configFactory: BarChartConfigFactory) {
        this.colTypes = EColType;
        this.aggregations = EAggregation;
    }

    ngOnInit() {
        this.initFormAndListen();
    }

    ngOnChanges(changes?: SimpleChanges) {
        console.log("BarChartFormComponent->ngOnChanges: ", changes);
        if (changes) {
            this.initFormAndListen();
        }
    }

    initFormAndListen() {
        this.form = this.initForm(this.config);

        this.form.valueChanges.subscribe(
            (config: IBarChartConfig) => {
                this.configChange.emit(this.configFactory.init(config));
            }
        );
    }

    initForm(conf: IBarChartConfig): FormGroup {
        conf = this.configFactory.init(conf);
        let fg = this.formBuilder.group({
            title: [conf.title],
            color: [conf.color],
            showXAxis: [conf.showXAxis],
            showYAxis: [conf.showYAxis],
            xAxisName: [conf.xAxisName],
            yAxisName: [conf.yAxisName],
            aggregation: [conf.aggregation],
            xCol: this.formBuilder.group({
                label: [conf.xCol.label],
                name: [conf.xCol.name],
                type: [conf.xCol.type]
            }),
            yCol: this.formBuilder.group({
                label: [conf.yCol.label],
                name: [conf.yCol.name],
                type: [conf.yCol.type]
            })
        });
        return fg;
    }

    xTransferSuccess(event) {
        console.log("setting x col name", event);
        this.form.controls['xCol'].patchValue(event.dragData);
    }

    yTransferSuccess(event) {
        console.log("setting y col name", event);
        this.form.controls['yCol'].patchValue(event.dragData);
    }

    onColorChange(color) {
        console.log("color changed to: ", color);
        this.form.controls['color'].patchValue(color);
    }


}