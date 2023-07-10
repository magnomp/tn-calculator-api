export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

interface OrderByField<T> {
  field: keyof T;
  direction: OrderDirection;
}

export type OrderBy<T> = OrderByField<T>[];
