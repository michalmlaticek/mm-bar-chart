var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardCoreModule } from 'mm-dashboard-core';
import { DndModule } from 'ng2-dnd';
import { BarChartConfigFactory } from './services';
import { BarChartComponent } from './components/widget/bar-chart.component';
import { BarChartFormComponent } from './components/config-form/bar-chart-form.component';
var BarChartModule = BarChartModule_1 = (function () {
    function BarChartModule() {
    }
    BarChartModule.forRoot = function () {
        return {
            ngModule: BarChartModule_1,
            providers: [
                { provide: BarChartConfigFactory, useClass: BarChartConfigFactory }
            ]
        };
    };
    BarChartModule.forChild = function () {
        // widget service will need to be provided in the root module
        return {
            ngModule: BarChartModule_1,
            providers: [
                { provide: BarChartConfigFactory, useClass: BarChartConfigFactory }
            ]
        };
    };
    return BarChartModule;
}());
BarChartModule = BarChartModule_1 = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            DndModule.forRoot(),
            DashboardCoreModule.forChild()
        ],
        declarations: [BarChartComponent, BarChartFormComponent],
        exports: [BarChartComponent, BarChartFormComponent],
        entryComponents: [BarChartComponent, BarChartFormComponent],
    })
], BarChartModule);
export { BarChartModule };
var BarChartModule_1;
//# sourceMappingURL=C:/_user/Code/dashboard/mm-bar-chart/src/bar-chart.module.js.map