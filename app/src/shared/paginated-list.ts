export interface PaginatedResult<TItem> {
  total: number;
  items: TItem[];
}
