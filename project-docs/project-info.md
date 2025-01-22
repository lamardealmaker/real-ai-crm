# Building a Simple Repair Ticket MVP for Real Estate

Below is a concise outline of a minimal viable product (MVP) for a property repair ticket system. The goal is to make it straightforward for tenants to submit repair requests and for property managers and vendors to track and resolve those requests efficiently.

## Core Roles & Workflow

### Tenant
- Submits new repair tickets.
- Views ticket status (Submitted → Scheduled → Repaired → Complete).

### Property Manager
- Receives all new tickets.
- Assigns tickets to vendors.
- Updates ticket status (can move from Scheduled → Repaired, and is the only one who can set it to Complete).
- Manages vendors (add/edit/remove vendor accounts).

### Vendor
- Sees only the tickets assigned to them.
- Can add comments or updates (e.g., schedule a visit).
- Marks the ticket as Repaired once the work is done, which notifies the Property Manager.

## Ticket Life Cycle

1. **Submitted**: Tenant creates a ticket describing the repair issue.
2. **Scheduled**: Property Manager assigns the ticket to a vendor and schedules the repair.
3. **Repaired**: The vendor completes the repair and marks the ticket as Repaired.
4. **Complete**: The Property Manager confirms the repair is satisfactory and closes the ticket.

## Data Model

### Ticket
- ID: Unique identifier.
- Title / Description: Summary of the repair issue.
- Created By: Tenant reference.
- Assigned To: Vendor reference (or null if not yet assigned).
- Status: [Submitted, Scheduled, Repaired, Complete].
- Timestamps: Creation date, status update dates.
- Comments: Threaded messages from Tenant, Vendor, and Property Manager.

### User
- Role: Tenant, Property Manager, Vendor.
- Name, Contact Details.
- Authentication Credentials.

### Property (optional for MVP if one manager oversees multiple properties)
- Name/Address: Where the repair is needed.
- Associated Tenants/Vendors (optional relationships).

## Key Features

### Tenant Portal
- Create Tickets: Simple form with fields (description, property/unit).
- View Tickets: Show list of submitted tickets and status changes in real-time.
- Add Comments: (e.g., clarifications on the issue).

### Property Manager Dashboard
- View All Tickets: Filter by status, date, or assigned vendor.
- Assign Tickets: Pick a vendor to handle a new or open ticket.
- Update Status: Move tickets through the lifecycle; only the manager can mark as Complete.
- Vendor Management: Add or remove vendors, manage user permissions.

### Vendor Interface
- View Assigned Tickets: See only tickets assigned to them, along with Tenant's details and issue description.
- Post Updates: Comment on progress, schedule visits, request further info.
- Mark Repaired: Once the job is done, notify the Property Manager.

## Technical Approach (MVP Level)

### API-First Design
- Endpoints for creating tickets, assigning vendors, and updating statuses.
- Security: Basic role-based access checks (Tenant, Manager, Vendor).

### Database Schema
- Tickets Table: Fields for ID, status, descriptions, timestamps, references to tenant/vendor.
- Users Table: Role, contact info, basic profile data.
- Comments Table: Threaded discussions linked to Tickets.

### Minimal UI
- Tenant Form: One-page creation + listing of tickets.
- Manager Dashboard: Basic view with filtering and assignment.
- Vendor Dashboard: Table of assigned tickets with update function.

## Success Criteria for the MVP

1. Easy Ticket Creation: Tenants should quickly submit issues with minimal friction.
2. Clear Role Separation: Each user type sees only what they need to see.
3. Straightforward Status Updates: A simple, linear ticket flow from Submitted → Scheduled → Repaired → Complete.
4. Minimal Administration Overhead: Property Managers can add new vendors and handle assignments without complexity.
5. Reliable Notifications: Automatic alerts when a ticket is created, assigned, or updated (optional email/SMS).

In this MVP, everything needed for basic repair tracking is covered:
- Tenants create tickets.
- Managers view, assign, and finalize.
- Vendors communicate progress and mark repairs done.

From here, future enhancements could include more sophisticated scheduling, mobile apps, or analytics dashboards, but the above provides the simplest starting point where all essential functions "just work." 