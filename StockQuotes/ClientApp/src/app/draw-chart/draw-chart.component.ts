import { Component, ViewChild, OnInit} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventBusService } from '../services/event-bus.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke
} from 'ng-apexcharts';
import { StockService } from '../services/stock.service';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
}

@Component({
  selector: 'app-draw-chart',
  templateUrl: './draw-chart.component.html',
  styleUrls: ['./draw-chart.component.css']
})
export class DrawChartComponent implements OnInit {
  symbol: string;
  @ViewChild('chart', { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  candles: Candle[];

  constructor(private stockService: StockService,
    private eventBusService: EventBusService
    ,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.eventBusService.symbolChanged.subscribe(symbol => {
      this.symbol = symbol;
      this.spinner.show();
      this.stockService.getQuotes(this.symbol).subscribe(data => {
        this.candles = data.map(quote => Object.assign({}, quote, {
          x: new Date(quote[0]),
          y: [quote[1], quote[2], quote[3], quote[4]]
        }));
        this.loadData(this.candles, this.symbol);
        this.spinner.hide();
      });
    });
  }

  loadData(candles: Candle[], symbol: string) {
    this.chartOptions = {
      series: [
        {
          name: 'candle',
          data: candles
        }
      ],
      chart: {
        type: 'line',
        zoom: {
          enabled: true
        },
        height: '550'
      },
      stroke: {
        curve: 'smooth',
        width: 1
      },
      title: {
        text: symbol,
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };
  }
}

export interface Candle {
  x: Date;
  y: number[];
}
