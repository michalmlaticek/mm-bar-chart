import { MmObjectFactory } from 'mm-dashboard-core';
import { IBarChartConfig } from '../interfaces';
export declare class BarChartConfigFactory {
    private objectFactory;
    defaultConfig: IBarChartConfig;
    constructor(objectFactory: MmObjectFactory<IBarChartConfig>);
    init(config?: IBarChartConfig): IBarChartConfig;
}
