var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EColType, EAggregation } from 'mm-dashboard-core';
import { BarChartConfigFactory } from '../../services';
var BarChartFormComponent = (function () {
    function BarChartFormComponent(formBuilder, configFactory) {
        this.formBuilder = formBuilder;
        this.configFactory = configFactory;
        this.configChange = new EventEmitter();
        this.colTypes = EColType;
        this.aggregations = EAggregation;
    }
    BarChartFormComponent.prototype.ngOnInit = function () {
        this.initFormAndListen();
    };
    BarChartFormComponent.prototype.ngOnChanges = function (changes) {
        console.log("BarChartFormComponent->ngOnChanges: ", changes);
        if (changes) {
            this.initFormAndListen();
        }
    };
    BarChartFormComponent.prototype.initFormAndListen = function () {
        var _this = this;
        this.form = this.initForm(this.config);
        this.form.valueChanges.subscribe(function (config) {
            _this.configChange.emit(_this.configFactory.init(config));
        });
    };
    BarChartFormComponent.prototype.initForm = function (conf) {
        conf = this.configFactory.init(conf);
        var fg = this.formBuilder.group({
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
    };
    BarChartFormComponent.prototype.xTransferSuccess = function (event) {
        console.log("setting x col name", event);
        this.form.controls['xCol'].patchValue(event.dragData);
    };
    BarChartFormComponent.prototype.yTransferSuccess = function (event) {
        console.log("setting y col name", event);
        this.form.controls['yCol'].patchValue(event.dragData);
    };
    BarChartFormComponent.prototype.onColorChange = function (color) {
        console.log("color changed to: ", color);
        this.form.controls['color'].patchValue(color);
    };
    return BarChartFormComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], BarChartFormComponent.prototype, "config", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], BarChartFormComponent.prototype, "configChange", void 0);
BarChartFormComponent = __decorate([
    Component({
        selector: 'mm-bar-chart-form',
        template: "\n    <div class=\"mm-chart-form\" [formGroup]=\"form\">\n        <p>\n            <label>Chart Name</label>\n            <input type=\"text\" formControlName=\"title\">\n        </p>\n        <p>\n            <label>Selected Color</label>\n            <mm-single-color-selector [color]=\"config.color\" (colorChange)=\"onColorChange($event)\"></mm-single-color-selector>\n\t\t    <input type=\"text\" formControlName=\"color\" [style.display]=\"'none'\">\n        </p>\n        <p formGroupName=\"xCol\">\n            <label>Column X</label>\n            <input dnd-droppable (onDropSuccess)=\"xTransferSuccess($event)\" type=\"text\" formControlName=\"label\">\n            <input type=\"text\" formControlName=\"name\" [style.display]=\"'none'\">\n            <input type=\"text\" formControlName=\"type\" [style.display]=\"'none'\">\n        </p>\n        <p formGroupName=\"yCol\">\n            <label>Column Y</label>\n            <input dnd-droppable (onDropSuccess)=\"yTransferSuccess($event)\" type=\"text\" formControlName=\"label\">\n            <input type=\"text\" formControlName=\"name\" [style.display]=\"'none'\">\n            <input type=\"text\" formControlName=\"type\" [style.display]=\"'none'\">\n        </p>\n        <p>\n            <label>Show X Axis</label>\n            <input type=\"checkbox\" formControlName=\"showXAxis\">\n        </p>\n        <p>\n            <label>X Axis</label>\n            <input type=\"text\" formControlName=\"xAxisName\">\n        </p>\n        <p>\n            <label>Show Y Axis</label>\n            <input type=\"checkbox\" formControlName=\"showYAxis\">\n        </p>\n        <p>\n            <label>Y Axis</label>\n            <input type=\"text\" formControlName=\"yAxisName\">\n        </p>\n        <p>\n            <label>Aggregation type</label>\n            <select formControlName=\"aggregation\">\n                <option *ngFor=\"let agg of aggregations | EKeys\" [ngValue]=\"agg.key\">{{agg.value}}</option>\n            </select>\n        </p>\n    </div>\n    ",
        styles: [
            "\n        \n        "
        ]
    }),
    __metadata("design:paramtypes", [FormBuilder,
        BarChartConfigFactory])
], BarChartFormComponent);
export { BarChartFormComponent };
//# sourceMappingURL=C:/_user/Code/dashboard/mm-bar-chart/src/components/config-form/bar-chart-form.component.js.map