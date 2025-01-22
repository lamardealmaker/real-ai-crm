export type Role = 'tenant' | 'property_manager' | 'vendor'

export type Profile = {
  id: string
  user_id: string
  full_name: string | null
  email: string
  role: Role
  created_at: string
  updated_at: string
}

export type Property = {
  id: string
  name: string
  address: string
  created_at: string
  updated_at: string
}

export type Unit = {
  id: string
  property_id: string
  unit_number: string
  tenant_id: string | null
  created_at: string
  updated_at: string
  // Relations
  property?: Property
}

export type TicketStatus = 'submitted' | 'scheduled' | 'repaired' | 'complete'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export type Ticket = {
  id: string
  title: string
  description: string
  created_by: string // tenant_id
  assigned_to: string | null // vendor_id
  property_id: string
  unit_id: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
  updated_at: string
  scheduled_for: string | null
  completed_at: string | null
  // Relations
  property?: Property
  unit?: Unit
  created_by_profile?: Profile
  assigned_to_profile?: Profile
}

export type Comment = {
  id: string
  ticket_id: string
  author_id: string
  content: string
  created_at: string
  updated_at: string
}

// Helper type for database responses
export type DbResult<T> = {
  data: T | null
  error: Error | null
}

// Helper types for relationships
export type TicketWithRelations = Ticket & {
  created_by_profile: Profile
  assigned_to_profile?: Profile
  property: Property
  unit: Unit
  comments?: Comment[]
}

export type ProfileWithProperties = Profile & {
  managed_properties?: Property[]
  assigned_tickets?: Ticket[]
  units?: Unit[]
} 