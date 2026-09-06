import { Component } from '@angular/core';
import { Card } from "../../../ui/dashboard/widgets/card/card";

@Component({
  selector: 'app-dashboard-widget-welcome',
  imports: [Card],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css'],
})
export class Welcome {}
