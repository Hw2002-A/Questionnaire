import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';
import { AnswerDataService } from '../@service/answer-data.service';
import { HttpService } from '../@http-service/http.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-statistic',
  imports: [
    CommonModule
],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent {
  charts: Chart[] = []; // 放所有 Chart 實例
  quizId!: number;
  questionCountVoList: Array<any> = [];
  quiz: any;
  statisticVo: any;
  constructor(
    private answerDataService: AnswerDataService,
    private http: HttpService,
    private route: ActivatedRoute,) { };
  //new Chart(繪製區域, {type: 類型, data: 圖表數據, options: 圖表選項});

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.http.getApi(`http://localhost:8080/quiz/statistic?quizId=${this.quizId}`)
      .subscribe((res: any) => {
        console.log(res);
        this.statisticVo = res.statisticVo;
        console.log(this.statisticVo);
        this.questionCountVoList = this.statisticVo.questionCountVoList;
        this.quiz = res.quiz;
      });

    setTimeout(() => this.createCharts(), 1000);
  }


  createCharts(): void {
    this.questionCountVoList.forEach(q => {
      const ctx = document.getElementById(`canvasId${q.questionId}`) as HTMLCanvasElement;
      if (!ctx) {

      }
      // 先把 labels 與 data 拿出來
      const labels = q.optionsCountList.map((opt: any) => opt.optionName);
      const dataValues = q.optionsCountList.map((opt: any) => opt.count);

      const chartData = {
        labels: labels,
        datasets: [{
          label: q.name,
          data: dataValues,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgba(54, 235, 211, 1)'
          ],
          hoverOffset: 4,
        }]
      };

      const chart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
      });

      this.charts.push(chart);
    });

  }

}
