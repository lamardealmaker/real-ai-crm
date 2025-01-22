'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/hooks/use-supabase'
import type { Ticket, Property } from '@/types/db'

export default function ManagerDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch properties managed by this manager
      const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('manager_id', user.id)

      // Fetch all tickets for these properties
      if (properties?.length) {
        const propertyIds = properties.map(p => p.id)
        const { data: tickets } = await supabase
          .from('tickets')
          .select(`
            *,
            property:properties(name),
            unit:units(unit_number),
            created_by_profile:profiles!created_by(full_name),
            assigned_to_profile:profiles!assigned_to(full_name)
          `)
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false })

        setTickets(tickets || [])
        setProperties(properties)
      }

      setLoading(false)
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Property Manager Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter(t => !t.assigned_to).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter(t => t.priority === 'urgent' && t.status !== 'complete').length}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4">
        <h3 className="text-xl font-semibold">Recent Tickets</h3>
        {tickets.slice(0, 5).map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <CardTitle>{ticket.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {ticket.property?.name} - Unit {ticket.unit?.unit_number}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{ticket.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                  ticket.status === 'complete' ? 'bg-green-100 text-green-800' :
                  ticket.status === 'repaired' ? 'bg-blue-100 text-blue-800' :
                  ticket.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                  ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {ticket.assigned_to_profile?.full_name ? 
                    `Assigned to: ${ticket.assigned_to_profile.full_name}` : 
                    'Unassigned'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 