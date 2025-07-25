
interface CustomStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}const customStorageObject: CustomStorage = {
  getItem: (key: string): string | null => {
   
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
   
    localStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
};





export type SupabaseQueryOperator = 'textSearch'|'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'like' | 'ilike' | 'is' | 'in';

// Define the filter structure
export interface SupabaseFilter<T> {
  column: keyof T;
  operator: SupabaseQueryOperator;
  value: any;
}

// Logical operator for combining multiple filters
export type LogicalOperator = 'AND' | 'OR';

// The PostgrestFilterBuilder structure
export interface PostgrestFilterBuilder<T> {
  filters: Array<SupabaseFilter<T>>;
  logicalOperator?: LogicalOperator;
}