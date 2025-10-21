import {inject, Injectable, resource, signal, computed} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map, Observable, of, shareReplay, switchMap, tap} from 'rxjs';
import {Badge, BadgesResponse, League, LeaguesResponse} from './leagues';
import {toSignal} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class LeaguesService {
  private http = inject(HttpClient);
  private error = signal<string | null>(null);
  public _isLoading = signal(false);
  isLoading = computed<boolean>(() => this._isLoading());
  leagues = computed<League[]>(() => this._filteredSports.value() ?? []);
  sports = computed<string[]>(() => this._sports.value());
  sportsFilter = signal<string>('');
  private badgeList = new Map<string, Badge[]>();

  private _leagues = toSignal(
    this.http.get<LeaguesResponse>('/api/all_leagues.php').pipe(
      tap(() => this._isLoading.set(true)),
      tap({
        next: (response) => {
          this._isLoading.set(false);
          this.error.set(null);
        },
        error: (err) => {
          this._isLoading.set(false);
          this.error.set('Error fetching data');
        }
      }),
      map(response => response.leagues),
      shareReplay(1)
    ),
    { initialValue: [] as League[] }
  );


  private _sports = resource<string[], League[]>({
  params: this._leagues,
  defaultValue: [],
  loader: async (param) => {
    let sportsList = new Set<string>();
    param.params.forEach(sport => sportsList.add(sport.strSport))
    return Array.from(sportsList.values())
  }
});

  private _filteredSports = resource<League[], { sportsFilter: string, leagues: League[] }>({
    params: () => ({
      sportsFilter: this.sportsFilter(),
      leagues: this._leagues()
    }),
    defaultValue: [],
    loader: async (param) => {
      return param.params.leagues.filter(league => league.strSport.includes(param.params.sportsFilter));
    }
  });

  getBadgesByLeagueId(id: string): Observable<Badge[]> {
    if (this.badgeList.has(id)) {
      return of(this.badgeList.get(id) as Badge[]);
    }

    const url = `/api/search_all_seasons.php?badge=1&id=${id}`;

    return this.http.get<BadgesResponse>(url).pipe(
      tap(() => {this._isLoading.set(true)}),
      tap(response => {
        this.badgeList.set(id, response.seasons);
      }),
      tap(() => {this._isLoading.set(false)}),
      switchMap(response => of(response.seasons))
    );
  }
}
