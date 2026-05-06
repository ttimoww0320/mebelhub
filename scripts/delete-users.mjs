import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kuopuvefhsobxiwulzcw.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1b3B1dmVmaHNvYnhpd3VsemN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc4NTIyNSwiZXhwIjoyMDkyMzYxMjI1fQ.nfrYvdllflYUZCzej1AQtlrwaUkX2h6_E6DbaLF4MPE'

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const { data: { users }, error } = await admin.auth.admin.listUsers()

if (error) {
  console.error('Ошибка:', error.message)
  process.exit(1)
}

const KEEP_EMAIL = 'toirovtimurmalik@gmail.com'
const toDelete = users.filter(u => u.email !== KEEP_EMAIL)

if (!toDelete.length) {
  console.log('Нет пользователей для удаления.')
  process.exit(0)
}

console.log(`Удаляю ${toDelete.length} пользователей:`)
for (const user of toDelete) {
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    console.log(`  ✗ ${user.email} — ${error.message}`)
  } else {
    console.log(`  ✓ ${user.email} удалён`)
  }
}

console.log('Готово!')
