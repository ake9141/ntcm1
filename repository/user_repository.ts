// src/repositories/userRepository.ts
import {  IRepository, IProfile} from "@/models/model"; // Importing the User model and interface
import {SupaService} from "@/service/supa_service";
import { PostgrestFilterBuilder } from "@/service/isupa";
import { createClient } from "@/lib/supabase/server";
import { AuthError} from "@supabase/supabase-js";

const lpage: number = parseInt(process.env.PAGE || "10", 10); // Default page size from environment

// Define a filter interface for type safety
interface IFilter {
  page?: number;
  limit?: number;
  name?: string;
}

// Define the return type for the repository functions
interface IRepositoryResponse<T> {
  success: boolean;
  data?: T | null;
  error?: any;
  count?: number;
}

// Define the User Repository with TypeScript types
class UserRepository implements IRepository<IProfile> {
  private table: string;
  private supaService: SupaService<IProfile>;
  constructor() {
    this.table = "profiles";
    this.supaService = new SupaService<IProfile>("profiles");
  }

  async findAll(parms?:Partial<IProfile>,options?:any){
    const userFilter: PostgrestFilterBuilder<IProfile> = {
      filters: [
        { column: 'full_name', operator: 'ilike', value: parms?.full_name },
      ],
      logicalOperator: 'AND'
    };

    
   
    return await this.supaService.findAll({userFilter,options});
  }

  async find( 
    id: string
  ) {
   
    return await this.supaService.findOne('id',id);
   
  }

  // Find user by Line ID
  async findByLineId( 
    lineId: string
  ) {
   
    return await this.supaService.findOne('line_user_id',lineId);
   
  }



  async insert(parm: Partial<IProfile>) {
 
   const supabase =  await createClient();

  return await supabase.auth.signUp({
        email: parm.email!,
        password: parm.email!,
        options: {
          data: {
            name: parm.full_name,
            
            //picture:parm.picture,
            //line_id:parm.line_id,
          },
        },
      });

     

    
  }

 
  async update(id: number, parm: Partial<IProfile>) {
    return await this.supaService.update(id, parm);
  }

  async register(email: string, line_user_id: string):Promise<{data:IProfile| null,error:AuthError | null}> {
    const supabase = await createClient();
    const {data:{user},error} = await supabase.auth.signInWithPassword({
        email: email,
        password: email,
      });
    if (!error && user){
      const {data,error}= await this.supaService.update(user.id, {line_user_id:line_user_id});
      return {data,error:null}
    } else {
      return {data:null,error:error}
    }
        
  
  }
}

export default UserRepository;
