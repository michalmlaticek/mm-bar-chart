var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ENest, DataFormater } from 'mm-dashboard-core';
import * as D3Scale from 'd3-scale';
import * as D3Select from 'd3-selection';
import * as D3Array from 'd3-array';
import * as D3Axis from 'd3-axis';
var BarChartComponent = (function () {
    function BarChartComponent(dataFormater, element) {
        this.dataFormater = dataFormater;
        this.element = element;
        this.resized = false;
        this.dataChange = new EventEmitter();
        this.tooltipOn = new EventEmitter();
        this.tooltipOff = new EventEmitter();
        console.log("CarChartComponent -> contructor: ", dataFormater, element);
        this.htmlElem = element.nativeElement;
        this.viewInit = false;
    }
    BarChartComponent.prototype.ngOnInit = function () {
    };
    BarChartComponent.prototype.ngAfterViewInit = function () {
        console.log("BarChartComponent -> ngAfterViewInit");
        this.viewInit = true;
        this.d3Svg = D3Select.select(this.htmlElem).select('svg');
        console.log("BarChartComponent -> ngAfterViewInit -> d3Svg: ", this.d3Svg);
        if (this.config.xCol && this.config.yCol && this.data) {
            this.formatData();
            this.draw();
        }
        else {
            console.log("missing one of: [xCol, yCol, data] - ", this.config.xCol, this.config.yCol, this.data);
        }
    };
    BarChartComponent.prototype.ngOnChanges = function (changes) {
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
    };
    BarChartComponent.prototype.formatData = function () {
        this.barData = this.dataFormater.d3aggregateNumber(this.data, [this.config.xCol], this.config.yCol, this.config.aggregation, ENest.entries);
    };
    BarChartComponent.prototype.onDblclick = function (col, value) {
        console.log("BarChartComponent -> doubleclicked");
        var filteredData = this.data.filter(function (r) { return r[col.name] == value; });
        console.log("filtered data: ", filteredData);
        this.dataChange.emit(filteredData);
    };
    BarChartComponent.prototype.draw = function () {
        var _this = this;
        var data = this.barData;
        var config = this.config;
        var width = this.htmlElem.children[0].children[1].clientWidth - config.margin.left - config.margin.right;
        var height = this.htmlElem.children[0].children[1].clientHeight - config.margin.top - config.margin.bottom;
        var parseKey;
        var xScale = D3Scale.scaleBand().rangeRound([0, width]).padding(0.1).domain(data.map(function (d) { return d.key; }));
        var yScale = D3Scale.scaleLinear().rangeRound([height, 0]).domain([0, D3Array.max(data, function (d) { return d.value; })]);
        // Clear old drawing
        console.log("BarChartComponent -> draw -> clearing old elements: ", this.d3Svg);
        this.d3Svg.selectAll("g").remove();
        var d3TopG = this.d3Svg.append('g').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
        d3TopG.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return xScale(d.key); })
            .attr("y", function (d) { return yScale(d.value); })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) { return height - yScale(d.value); })
            .attr("fill", config.color)
            .on("dblclick", function (d) { return _this.onDblclick(_this.config.xCol, d.key); })
            .on("mouseover", function (d) {
            _this.tooltipOn.emit({
                event: D3Select.event,
                values: [
                    { key: d.key, value: d.value }
                ]
            });
        })
            .on("mouseout", function (d) {
            _this.tooltipOff.emit({
                event: D3Select.event,
                values: []
            });
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
    };
    return BarChartComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], BarChartComponent.prototype, "resized", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], BarChartComponent.prototype, "config", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], BarChartComponent.prototype, "data", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], BarChartComponent.prototype, "dataChange", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], BarChartComponent.prototype, "tooltipOn", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], BarChartComponent.prototype, "tooltipOff", void 0);
BarChartComponent = __decorate([
    Component({
        selector: 'mm-bar-chart',
        template: "\n        <article class=\"bar-chart-container\">\n            <h2>{{config.title}}</h2>\n            <svg></svg>\n        </article>\n    ",
        styles: [
            "\n        .bar-chart-container {\n            width: 100%;    \n            height: 100%;\n            display: flex;\n            flex-flow: column;\n        }\n\n        .bar-chart-container svg {\n            width: 100%;\n            flex: 1;\n        }\n\n        "
        ]
    }),
    __metadata("design:paramtypes", [DataFormater,
        ElementRef])
], BarChartComponent);
export { BarChartComponent };
//# sourceMappingURL=C:/_user/Code/dashboard/mm-bar-chart/src/components/widget/bar-chart.component.js.map