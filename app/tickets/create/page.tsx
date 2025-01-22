'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSupabase } from '@/hooks/use-supabase'
import type { Unit } from '@/types/db'

const ticketFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please provide a detailed description'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
})

type TicketFormValues = z.infer<typeof ticketFormSchema>

export default function CreateTicket() {
  const [tenantUnit, setTenantUnit] = useState<Unit | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = useSupabase()

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
    },
  })

  useEffect(() => {
    const fetchTenantUnit = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get the tenant's unit
      const { data: unit } = await supabase
        .from('units')
        .select(`
          *,
          property:properties(*)
        `)
        .eq('tenant_id', user.id)
        .single()

      if (unit) {
        setTenantUnit(unit)
      } else {
        toast.error('No unit assigned to your account. Please contact property management.')
        router.push('/dashboard/tenant')
      }

      setLoading(false)
    }

    fetchTenantUnit()
  }, [supabase, router])

  const onSubmit = async (data: TicketFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !tenantUnit) {
        toast.error('You must be logged in and have an assigned unit to create a ticket')
        return
      }

      const { error } = await supabase
        .from('tickets')
        .insert({
          ...data,
          created_by: user.id,
          property_id: tenantUnit.property_id,
          unit_id: tenantUnit.id,
          status: 'submitted',
        })

      if (error) throw error

      toast.success('Your repair ticket has been submitted')
      router.push('/dashboard/tenant')
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Failed to create ticket. Please try again.')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!tenantUnit) {
    return <div>No unit assigned to your account. Please contact property management.</div>
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Submit a Repair Ticket</h2>
          <p className="text-muted-foreground">
            Please provide details about the issue that needs to be repaired.
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            Unit: {tenantUnit.unit_number} at {tenantUnit.property?.name}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the issue" {...field} />
                  </FormControl>
                  <FormDescription>
                    Keep it short and descriptive
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed information about the issue"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any relevant details that will help us understand and address the issue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select based on the urgency of the repair needed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit Ticket
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
} 