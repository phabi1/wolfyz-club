import { Component } from '@angular/core';
import { TotalWidget } from '../../../../ui/dashboard/widgets/total-widget/total-widget';

@Component({
  selector: 'app-total-lesson',
  imports: [TotalWidget],
  templateUrl: './total-lesson.html',
  styleUrls: ['./total-lesson.css'],
})
export class TotalLesson {}
