import {createHandler} from './handler.mjs'
const secret=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}').default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
if(!secret)throw new Error('Server inventory credentials are unavailable')
Deno.serve(createHandler({secret,url:Deno.env.get('SUPABASE_URL')}))
