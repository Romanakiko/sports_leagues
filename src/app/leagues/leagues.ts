export interface League {
  "idLeague": string,
  "strLeague": string,
  "strSport": string,
  "strLeagueAlternate": string
}

export interface Badge {
  "strSeason": string,
  "strBadge": string
}

export interface LeaguesResponse {
  leagues: League[];
}
export interface BadgesResponse {
  seasons: Badge[];
}
