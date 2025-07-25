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