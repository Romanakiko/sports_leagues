import {Component, input} from '@angular/core';
import {Badge} from '../leagues/leagues';

@Component({
  selector: 'app-league-badge',
  imports: [],
  templateUrl: './league-badge.html',
  styleUrl: './league-badge.scss'
})
export class LeagueBadge {
  badgeInfo = input<Badge | null>(null)
}
