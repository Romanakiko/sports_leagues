import {Component, effect, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {LeaguesService} from '../leagues/leagues.service';
import {Badge, League} from '../leagues/leagues';
import {LeagueBadge} from '../league-badge/league-badge';
import {Observable, of} from 'rxjs';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-leagues-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    LeagueBadge,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './leagues-table.html',
  styleUrl: './leagues-table.scss'
})

export class LeaguesTable {
  dataSource = new MatTableDataSource<League>([]);
  leaguesService = inject(LeaguesService);
  columnsToDisplay = ['strLeague', 'strSport', 'strLeagueAlternate'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: League | null | undefined = null;

  constructor() {
    effect(() => {
      this.dataSource.data = this.leaguesService.leagues();
    });
  }

  isExpanded(element: League) {
    return this.expandedElement === element;
  }

  toggle(element: League) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  getBadge(id: string): Observable<Badge[]> {
    if(this.expandedElement?.idLeague === id) {
      return this.leaguesService.getBadgesByLeagueId(id);
    }
    else return of([]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applySportsFilter(sport: string) {
    this.leaguesService.sportsFilter.set(sport);
  }
}
