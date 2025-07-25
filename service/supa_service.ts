import { NextRequest, NextResponse } from "next/server";
import {  PaginationType, ValuesType } from "@/models/model";
import { PostgrestFilterBuilder } from "@/service/isupa";
import {createClient}  from "@/lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
type filtersProp = { key: string; value: any }[];

export interface ISupaResponse<T> {
  data: T; // The type of data you're inserting, or null if no data was returned
  error: PostgrestError | null; // Error object, or null if no error occurred
  status: number; // The HTTP status code of the response
  statusText: string;
  count: number; // The HTTP status text of the response
}

export function getPage(req: NextRequest): PaginationType {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  return {
    page: page,
    limit: limit,
  };
}

function getValues(req: NextRequest, filters: string[]): ValuesType {
  const searchParams = req.nextUrl.searchParams;

  const values: ValuesType = [];
  filters.map((key) => {
    const value = searchParams.get(key);
    if (value) {
      values.push({ key, value: value });
    }
  });

  return values;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // Returns the value corresponding to the key
}
type PropertyType<T, K extends keyof T> = T[K];


export function getParms<T>(req: NextRequest, filters: string[]): Partial<T> {
  const searchParams = req.nextUrl.searchParams;
   
  const obj: Partial<T> = {};
 
  filters.map((key) => {
   
    const value = searchParams.get(key);
    if (value) {
     // type CarMake = PropertyType<IOrders, 'user_id'>; 
      
    //  const name = getProperty(obj, key as any); // string
    // console.log(name)
     
      obj[key as keyof T] = value as any;
    }
  });

  return obj;
}

export function getParm(req: NextRequest, key: string) {
  const searchParams = req.nextUrl.searchParams;
  const value = searchParams.get(key);
  return value ? String(value) : null;
}

function applyFilters<T>(query: any, filterBuilder: PostgrestFilterBuilder<T>) {
  /* sample
  filters: [
      { column: 'name', operator: 'like', value: '%john%' },
      { column: 'age', operator: 'gt', value: 25 },
      { column: 'email', operator: 'is', value: null },
      { column: 'id', operator: 'in', value: [1, 2, 3] }
    ],
    logicalOperator: 'AND'|'OR'

  */

  if (filterBuilder.logicalOperator === "OR") {
    // Handle 'OR' logic by grouping filters in the `.or()` method
    const orConditions = filterBuilder.filters
      .map((filter) => {
        return `${String(filter.column)}.${filter.operator}.${filter.value}`;
      })
      .join(",");

    // Apply the OR condition
    query = query.or(orConditions);
  } else {
    filterBuilder.filters.forEach((filter) => {
      if (filter?.value) {
        switch (filter.operator) {
          case "textSearch":
            query = query.textSearch(filter.column, filter.value, {
              type: "websearch",
              config: "simple",
            });
            break;
          case "eq":
            query = query.eq(filter.column, filter.value);
            break;
          case "neq":
            query = query.neq(filter.column, filter.value);
            break;
          case "lt":
            query = query.lt(filter.column, filter.value);
            break;
          case "lte":
            query = query.lte(filter.column, filter.value);
            break;
          case "gt":
            query = query.gt(filter.column, filter.value);
            break;
          case "gte":
            query = query.gte(filter.column, filter.value);
            break;
          case "like":
            query = query.like(filter.column, filter.value);
            break;
          case "ilike":
            console.log(`ilike ${String(filter.column)} ${filter.value} `);

            query = query.ilike(filter.column, `%${filter.value}%`);
            break;
          case "is":
            query = query.is(filter.column, filter.value);
            break;
          case "in":
            query = query.in(filter.column, filter.value);
            break;
        }
      }
    });
  }
  return query;
}

interface findProbs {
  userFilter?: any;
  options?: any;
}

export class SupaService<TData> {
  private table: string;
  

  constructor(table: string) {
    this.table = table;
    
  }

  async findAll({ userFilter, options }: findProbs) {
    const supabase = await createClient();
    //const filters = getFilter(req, fkeys);
    const select = options?.select ?? "*";


    const query = supabase.from(this.table).select(select, { count: "exact" }) 
 

    if (options?.pagination) {
      const { page, limit } = options.pagination;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query.range(from, to).limit(limit);
    }

    if (options?.sort) {
      console.log(options)
      const scolumn = options?.sort.column ?? 'id'
      const asc = options?.sort.ascending ?? true
      query.order(scolumn, { ascending: asc});
    }

    const { data, count, error, status, statusText } =
      await applyFilters<TData>(query, userFilter);
    const values = data as TData[];

    return { data: values, count: count ?? 0, error, status, statusText };
  }

  async findOne<S>(key: string, id: S): Promise<ISupaResponse<TData>> {
    const supabase = await createClient();
   
    const { data, count, error, status, statusText } = await supabase
      .from(this.table)
      .select()
      .eq(key, id)
      .maybeSingle();
    const value = data as TData;
    return { data: value, count: 0, error, status, statusText };
  }

  async insert(parm: Partial<TData>) {
    const supabase = await createClient();
    const { data, count, error, status, statusText } = await supabase
      .from(this.table)
      .upsert(parm)
      .select()
      .single();
    const value = data as TData;
    return { data: value, count: count ?? 0, error, status, statusText };
  }

  async update<S>(id: S, parm: Partial<TData>) {
    const supabase = await createClient();
    console.log(parm);
    const { data, count, error, status, statusText } = await supabase
      .from(this.table)
      .update(parm)
      .eq("id", id)
      .select()
      .single();
    const value = data as TData;
    return { data: value, count: count ?? 0, error, status, statusText };
  }
}

export default SupaService;
