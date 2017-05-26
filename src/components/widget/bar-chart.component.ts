import { Component, Input, Output, OnInit, OnChanges, AfterViewInit, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { EAggregation, ENest, EColType, IColumn, IBaseWidget, DataFormater, ITooltipConfig } from 'mm-dashboard-core';
import { IBarChartConfig } from '../../interfaces';

import * as D3Scale from 'd3-scale';
import * as D3Path from 'd3-path';
import * as D3Select from 'd3-selection';
import * as D3Shape from 'd3-shape';
import * as D3Array from 'd3-array';
import * as D3Collection from 'd3-collection';
import * as D3Axis from 'd3-axis';
import * as D3Transition from 'd3-transition';
import * as D3Time from 'd3-time';
import * as D3TimeFormat from 'd3-time-format';


@Component({
    selector: 'mm-bar-chart',
    template: `
        <article class="bar-chart-container">
            <h2>{{config.title}}</h2>
            <svg></svg>
        </article>
    `,
    styles: [
        `
        .bar-chart-container {
            width: 100%;    
            height: 100%;
            display: flex;
            flex-flow: column;
        }

        .bar-chart-container svg {
            width: 100%;
            flex: 1;
        }

        `
    ]
})
export class BarChartComponent implements IBaseWidget, OnInit, OnChanges, AfterViewInit {

    @Input() resized: boolean = false;
    @Input() config: IBarChartConfig;
    @Input() data: Array<any>;
    @Output() dataChange: EventEmitter<any[]> = new EventEmitter();
    @Output() tooltipOn: EventEmitter<ITooltipConfig> = new EventEmitter();
    @Output() tooltipOff: EventEmitter<ITooltipConfig> = new EventEmitter();

    htmlElem: HTMLElement;
    barData: Array<any>; // formated data
    d3Svg: any;
    viewInit: boolean;

    constructor(
        private dataFormater: DataFormater,
        private element: ElementRef
    ) {
        console.log("CarChartComponent -> contructor: ", dataFormater, element);
        this.htmlElem = element.nativeElement;
        this.viewInit = false;
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        console.log("BarChartComponent -> ngAfterViewInit");
        this.viewInit = true;
        this.d3Svg = D3Select.select(this.htmlElem).select('svg');
        console.log("BarChartComponent -> ngAfterViewInit -> d3Svg: ", this.d3Svg);
        if (this.config.xCol && this.config.yCol && this.data) {
            this.formatData();
            this.draw();
        } else {
            console.log("missing one of: [xCol, yCol, data] - ", this.config.xCol, this.config.yCol, this.data);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log("BarChartComponent -> ngOnChanges:", changes, this.viewInit);
        if (changes && this.viewInit && this.data && this.config && this.config.xCol && this.config.yCol) {
            if (changes["data"]
                || (changes["config"]
                    && (changes["config"].currentValue["xCol"] != changes["config"].previousValue["xCol"]
                        || changes["config"].currentValue["yCol"] != changes["config"].previousValue["yCol"]
                        || changes["config"].currentValue["aggregation"] != changes["config"].previousValue["aggregation"]))) {
                console.log("BarChartComponent -> ngOnChanges -> reformating data");
                this.formatData();
            }

            console.log("BarChartComponent -> ngOnChanges -> redrawing");
            this.resized = false;
            this.draw();
        }
    }

    formatData() {
        this.barData = this.dataFormater.d3aggregateNumber(
            this.data,
            [this.config.xCol],
            this.config.yCol,
            this.config.aggregation,
            ENest.entries);
    }

    onDblclick(col: IColumn, value: any) {
        console.log("BarChartComponent -> doubleclicked");
        let filteredData = this.data.filter(r => r[col.name] == value);
        console.log("filtered data: ", filteredData);
        this.dataChange.emit(filteredData);
    }

    draw() {
        let data = this.barData;
        let config = this.config;
        let width = this.htmlElem.children[0].children[1].clientWidth - config.margin.left - config.margin.right;
        let height = this.htmlElem.children[0].children[1].clientHeight - config.margin.top - config.margin.bottom;
        let parseKey;
        let xScale = D3Scale.scaleBand().rangeRound([0, width]).padding(0.1).domain(data.map(d => d.key));
        let yScale = D3Scale.scaleLinear().rangeRound([height, 0]).domain([0, D3Array.max(data, d => d.value)]);

        // Clear old drawing
        console.log("BarChartComponent -> draw -> clearing old elements: ", this.d3Svg);
        this.d3Svg.selectAll("g").remove();

        let d3TopG = this.d3Svg.append('g').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

        d3TopG.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => { return xScale(d.key) })
            .attr("y", d => { return yScale(d.value) })
            .attr("width", xScale.bandwidth())
            .attr("height", d => { return height - yScale(d.value) })
            .attr("fill", config.color)
            .on("dblclick", d => this.onDblclick(this.config.xCol, d.key))
            .on("mouseover", d => {
                this.tooltipOn.emit({
                    event: D3Select.event,
                    values: [
                        { key: d.key, value: d.value }
                    ]
                })
            })
            .on("mouseout", d => {
                this.tooltipOff.emit({
                    event: D3Select.event,
                    values: []
                })
            });


        if (config.showXAxis) {
            // add the x Axis
            d3TopG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(D3Axis.axisBottom(xScale));
        }

        if (config.showYAxis) {
            // add the y Axis
            d3TopG.append("g")
                .call(D3Axis.axisLeft(yScale));
        }
    }


}