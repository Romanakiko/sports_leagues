import {Component} from '@angular/core';
import {LeaguesTable} from './leagues-table/leagues-table';

@Component({
  selector: 'app-root',
  imports: [LeaguesTable],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
