# Fuel Bharat Admin CRM Features

## Overview
The admin panel now includes comprehensive CRM features to manage station owners who register their own stations.

## New Pages

### 1. Station Owners Management (`/owners`)
Manage all station owners (subscribers) who register on Fuel Bharat.

**Features:**
- View all registered station owners with pagination
- Search by name, email, phone, or company
- Filter by status (pending, active, suspended, rejected)
- Filter by KYC status (pending, verified, rejected)
- Approve or reject station owners
- Verify KYC documents
- Suspend or delete accounts
- View station count and support ticket count for each owner

**Columns:**
- Owner Info (name, email, phone)
- Company (name, GST number)
- Status badge (pending/active/suspended/rejected)
- KYC status badge (pending/verified/rejected)
- Station count and ticket count
- Action buttons (Approve, Reject, Suspend, Delete)

### 2. Support Tickets (`/support`)
Manage support tickets raised by station owners.

**Features:**
- View all support tickets with pagination
- Filter by status (open, in_progress, resolved, closed)
- Filter by category (technical, billing, station_issue, general)
- Filter by priority (low, medium, high, urgent)
- View ticket details in a modal
- Update ticket status (open → in_progress → resolved → closed)
- Add public replies (visible to owner)
- Add internal notes (only visible to admins)
- View conversation history

**Ticket Details:**
- Ticket number (auto-generated: FBT-YYYYMMDD-XXXX)
- Subject and description
- Owner information
- Related station (if any)
- Status, priority, category
- Creation date
- All replies and internal notes with timestamps

### 3. Enhanced Dashboard (`/dashboard`)
Updated station management with approval workflow.

**New Features:**
- Filter stations by approval status (pending/approved/rejected)
- View station owner information for each station
- Approve pending stations
- Reject stations with reason
- View approval status badges
- View rejection reasons

**New Columns:**
- Owner (name, email, or "Admin Added" for manually added stations)
- Approval status badge (pending/rejected, approved stations show no badge)
- Approve/Reject action buttons for pending stations

## Navigation

The top navigation now includes:
- **Stations** - Station management with approval workflow
- **Station Owners** - CRM for managing station owners
- **Support Tickets** - Ticket management system
- **Logout** - Sign out

## Workflow

### Station Owner Registration & Approval
1. Station owner signs up via `/api/auth/subscriber/signup`
2. Owner appears in **Station Owners** page with status: `pending`
3. Admin reviews owner details, company info, GST/PAN
4. Admin approves or rejects the owner
5. Approved owners can register stations

### Station Registration & Approval
1. Approved station owner registers a station via mobile/web
2. Station appears in **Dashboard** with approval status: `pending`
3. Admin reviews station details and owner information
4. Admin approves or rejects the station
5. Approved stations become visible to customers on the map
6. Rejected stations show rejection reason to owner

### Support Ticket Workflow
1. Station owner creates support ticket
2. Ticket appears in **Support Tickets** with status: `open`
3. Admin can:
   - Start progress (status → `in_progress`)
   - Add public replies (owner can see)
   - Add internal notes (only admins see)
   - Mark as resolved (status → `resolved`)
   - Close ticket (status → `closed`)
   - Reopen if needed
4. Owner receives notifications for replies and status changes

## API Endpoints Used

### Station Owners
- `GET /api/admin/owners` - List owners with filters
- `PUT /api/admin/owners?id={id}` - Update owner status/KYC
- `DELETE /api/admin/owners?id={id}` - Delete/suspend owner

### Support Tickets
- `GET /api/admin/support` - List tickets with filters
- `PUT /api/admin/support?id={id}` - Update ticket status
- `POST /api/admin/support/reply` - Add reply to ticket

### Stations
- `GET /api/admin/stations` - List stations (now with approvalStatus filter)
- `PUT /api/admin/stations?id={id}` - Update station (now with approval fields)

## Status Badges

### Station Owner Status
- 🟡 **PENDING** - Awaiting admin approval
- 🟢 **ACTIVE** - Approved and active
- 🔴 **SUSPENDED** - Account suspended
- ⚫ **REJECTED** - Application rejected

### KYC Status
- 🟡 **PENDING** - KYC documents under review
- 🟢 **VERIFIED** - KYC approved
- 🔴 **REJECTED** - KYC rejected

### Station Approval Status
- 🟡 **PENDING** - Awaiting admin approval
- ✅ **APPROVED** - Station visible to customers (no badge shown)
- 🔴 **REJECTED** - Station rejected with reason

### Ticket Status
- 🔵 **OPEN** - New ticket
- 🟡 **IN PROGRESS** - Being worked on
- 🟢 **RESOLVED** - Issue resolved
- ⚫ **CLOSED** - Ticket closed

### Ticket Priority
- ⚪ **LOW** - Normal priority
- 🔵 **MEDIUM** - Medium priority
- 🟠 **HIGH** - High priority
- 🔴 **URGENT** - Urgent attention required

## Technical Details

### Frontend Stack
- React 18.3.0 with TypeScript
- React Router v6 for routing
- Axios for API calls
- Tailwind CSS for styling

### Key Files Updated
- `admin-web/src/services/api.ts` - Added CRM API methods
- `admin-web/src/App.tsx` - Added new routes
- `admin-web/src/pages/StationOwners.tsx` - New page
- `admin-web/src/pages/SupportTickets.tsx` - New page
- `admin-web/src/pages/Dashboard.tsx` - Enhanced with approval workflow

### Mobile App (Customer Only)
The mobile app remains customer-focused with:
- Customer authentication (`/api/auth/login`)
- Station search and discovery
- Fuel order creation
- Order history

**Note:** Station owner features are NOT available in mobile app. Station owners must use web portal for management.

## Testing

### Station Owner Management
1. Navigate to `/owners`
2. Use filters to find specific owners
3. Click Approve/Reject on pending owners
4. Verify status updates correctly

### Station Approval
1. Navigate to `/dashboard`
2. Select "Pending Approval" filter
3. Review pending stations
4. Click Approve or Reject
5. For rejection, enter reason
6. Verify status badge updates

### Support Tickets
1. Navigate to `/support`
2. Apply filters to find tickets
3. Click "View Details" on any ticket
4. Try status updates
5. Add public reply
6. Add internal note (check "Internal Note")
7. Verify conversation thread

## Security

All CRM endpoints are protected with JWT authentication:
- Admin token required for all operations
- Token stored in localStorage as `adminToken`
- Automatic redirect to login if unauthorized

## Future Enhancements

Potential improvements:
- Real-time notifications using WebSocket
- Advanced analytics dashboard
- Bulk operations for owners/stations
- Export functionality (CSV/Excel)
- Email notifications for status changes
- Document upload/view for KYC verification
- Advanced search with multiple filters
- Activity timeline for each owner
- Station performance metrics
