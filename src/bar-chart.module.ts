import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardCoreModule } from 'mm-dashboard-core';
import { DndModule } from 'ng2-dnd';

import { BarChartConfigFactory } from './services';
import { BarChartComponent } from './components/widget/bar-chart.component';
import { BarChartFormComponent } from './components/config-form/bar-chart-form.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DndModule.forRoot(),
        DashboardCoreModule.forChild()
    ],
    declarations: [BarChartComponent, BarChartFormComponent],
    exports: [BarChartComponent, BarChartFormComponent],
    entryComponents: [BarChartComponent, BarChartFormComponent],
    // providers: [LineChartConfigFactory]
})
export class BarChartModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: BarChartModule,
            providers: [
                { provide: BarChartConfigFactory, useClass: BarChartConfigFactory }
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        // widget service will need to be provided in the root module
        return {
            ngModule: BarChartModule,
            providers: [
                { provide: BarChartConfigFactory, useClass: BarChartConfigFactory }
            ]
        };
    }
}