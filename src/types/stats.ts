export interface StatsKpi {
  sets_count: number
  cards_count: number
  series_count: number
  users_count: number
  cards_with_price: number
  avg_price: number | null
  max_price: number | null
  total_value: number | null
}

export interface ChartPoint {
  label: string
  value: number
}

export interface StatsTopCard {
  id: number
  tcgdex_id: string
  local_id: string
  image_url: string | null
  name: string
  set_id: number
  set_tcgdex_id: string
  set_name: string
  set_logo_url: string | null
  price: number
}

export interface Stats {
  kpi: StatsKpi
  charts: {
    cards_per_rarity: ChartPoint[]
    cards_per_series: ChartPoint[]
    sets_per_year: ChartPoint[]
    price_ranges: ChartPoint[]
  }
  top_cards: StatsTopCard[]
}
