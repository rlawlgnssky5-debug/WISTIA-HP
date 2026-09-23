export default function handler(request, response) {
  response.status(200).json({
    service: "wistia",
    status: "ok",
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY)
  })
}
