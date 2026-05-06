export type UserRole = 'customer' | 'craftsman'

export interface Profile {
  id: string
  email: string
  full_name: string
  phone: string | null
  role: UserRole
  avatar_url: string | null
  // craftsman only
  bio: string | null
  rating: number | null
  reviews_count: number
  created_at: string
  telegram_chat_id: number | null
  telegram_token: string | null
  verified: boolean
  verification_status: 'none' | 'pending' | 'verified' | 'rejected'
  verification_doc_url: string | null
}

export interface Order {
  id: string
  customer_id: string
  title: string
  description: string
  furniture_type: string
  style: string | null
  width_cm: number | null
  height_cm: number | null
  depth_cm: number | null
  budget_min: number | null
  budget_max: number | null
  material: string | null
  color: string | null
  images: string[]
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  deadline: string | null
  created_at: string
  customer?: Profile
  offers?: Offer[]
}

export interface Offer {
  id: string
  order_id: string
  craftsman_id: string
  price: number
  delivery_days: number
  comment: string | null
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  craftsman?: Profile
}
