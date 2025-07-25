import { ISupaResponse } from "@/service/supa_service";
import { NextRequest, NextResponse } from "next/server";

export interface IProfile {
  id: string; // uuid (auth.users.id)
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  address?: string | null;
  line_user_id?: string | null; // unique
  is_neta_member: boolean; // default false
  neta_membership_id?: string | null; // unique
  ppda_consent_given: boolean; // default false
  ppda_consent_timestamp?: string | null; // ISO string from timestamptz
  ppda_consent_version_id?: string | null; // uuid
  created_at: string; // ISO string
  updated_at: string; // ISO string
}


export interface IKey<S>{
  id:S
}

export interface IResponse<T> {
  data: T;
  count: number;
}



export type PaginationType = {
  page:number,
  limit:number
}

export type ValuesType = { key: string; value: any }[];

export interface IRepository<T> {
  findAll(parms:Partial<T>,options?:any): Promise<ISupaResponse<T[]>>;
  update(id: number, parm: Partial<T>):Promise<ISupaResponse<T>>;
}

export type TableMeta<S> = {
  updateData: (
    rowIndex: number,
    id: S,
    columnId: string,
    value: unknown
  ) => void,
  insertData: (
   newData:any
  ) => void;
};
