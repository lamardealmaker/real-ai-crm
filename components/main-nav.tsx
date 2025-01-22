'use client'

import Link from 'next/link'

interface NavItem {
  title: string
  href: string
}

interface MainNavProps {
  items: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">
          Repair Ticket System
        </span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  )
} 