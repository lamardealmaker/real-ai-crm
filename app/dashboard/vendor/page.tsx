'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/hooks/use-supabase'
import type { Ticket } from '@/types/db'

export default function VendorDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchTickets = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: tickets } = await supabase
        .from('tickets')
        .select(`
          *,
          property:properties(name),
          unit:units(unit_number),
          created_by_profile:profiles!created_by(full_name)
        `)
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false })

      setTickets(tickets || [])
      setLoading(false)
    }

    fetchTickets()
  }, [supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  const activeTickets = tickets.filter(t => t.status !== 'complete')
  const scheduledTickets = tickets.filter(t => t.status === 'scheduled')
  const completedTickets = tickets.filter(t => t.status === 'complete')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeTickets.filter(t => t.priority === 'urgent').length}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4">
        <h3 className="text-xl font-semibold">Active Jobs</h3>
        {activeTickets.map((ticket) => (
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
                {ticket.scheduled_for && (
                  <span className="text-sm text-muted-foreground">
                    Scheduled for: {new Date(ticket.scheduled_for).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 