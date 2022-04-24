export type ResponseType<T> = {
  items: T[];
  total: number;
  has_more: boolean;
};
