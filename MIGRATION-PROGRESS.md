# NextJS to TanStack Start Migration Progress

This file tracks the migration progress of all routes from the NextJS budget app to the TanStack Start budget app.

## Route Migration Status

### Frontend Routes (Pages)

| NextJS Route | TanStack Start Route | Status | Dependencies | Notes |
|-------------|---------------------|---------|-------------|-------|
| `/` (page.tsx) | `/` (index.tsx) | ✅ Completed | - | Empty home page, redirects to app |
| `/app/[year]/[month]` | `/app/$year/$month` | ✅ Fully Complete | MonthlyHeader, MonthlySummaryCard, AddRecordDialog | Main budget tracking page with full server integration |
| `/app/charts` | `/app/charts` | ❌ Not Started | ExpenseTrendsChart, ExpensesVsIncomeChart, IncomeTrendsChart, IncomeByYearChart | Charts dashboard |
| `/app/settings` | `/app/settings` | ❌ Not Started | RegularPaymentsList | Settings and regular payments |
| `/app/import` | `/app/import` | ❌ Not Started | Upload components | CSV import functionality |
| `/sign-in` | `/sign-in` | ❌ Not Started | - | Sign in page (will be empty without auth) |
| `/rate-limited` | `/rate-limited` | ❌ Not Started | - | Rate limiting page |

### API Routes

| NextJS API Route | TanStack Start API Route | Status | Dependencies | Notes |
|-----------------|-------------------------|---------|-------------|-------|
| `/api/categories` | `/api/categories` | ❌ Not Started | category-service.ts | CRUD for categories |
| `/api/categories/expense` | `/api/categories/expense` | ❌ Not Started | category-service.ts | Expense categories only |
| `/api/categories/income` | `/api/categories/income` | ❌ Not Started | category-service.ts | Income categories only |
| `/api/records` | `/api/records` | ❌ Not Started | record-service.ts | CRUD for records |
| `/api/records/calendar/[year]/[month]` | `/api/records/calendar/$year/$month` | ❌ Not Started | record-service.ts | Month summary |
| `/api/records/calendar/[year]/[month]/records` | `/api/records/calendar/$year/$month/records` | ❌ Not Started | record-service.ts | All records for month |
| `/api/records/[id]` | `/api/records/$id` | ❌ Not Started | record-service.ts | Single record operations |
| `/api/records/clear` | `/api/records/clear` | ❌ Not Started | record-service.ts | Clear all records |
| `/api/records/summary` | `/api/records/summary` | ❌ Not Started | record-service.ts | All-time summary |
| `/api/records/comments` | `/api/records/comments` | ❌ Not Started | record-service.ts | Record comments autocomplete |
| `/api/charts/expenses-by-category/[categoryId]` | `/api/charts/expenses-by-category/$categoryId` | ❌ Not Started | charts-service.ts | Category expense trends |
| `/api/charts/expenses-vs-income` | `/api/charts/expenses-vs-income` | ❌ Not Started | charts-service.ts | Monthly expenses vs income |
| `/api/charts/income-trends` | `/api/charts/income-trends` | ❌ Not Started | charts-service.ts | Income trends by category |
| `/api/exchange-rate` | `/api/exchange-rate` | ❌ Not Started | External API call | Currency exchange rate |
| `/api/import` | `/api/import` | ❌ Not Started | CSV parsing, record-service.ts | CSV file import |
| `/api/regular-payments` | `/api/regular-payments` | ❌ Not Started | regular-payment-service.ts | Regular payments management |

### Components

| Component | Status | Dependencies | Notes |
|-----------|--------|-------------|-------|
| UI Components (shadcn) | ✅ Completed | Radix UI components | All UI components copied |
| MonthlyHeader | ✅ Completed | ViewType, month-year-picker, AddRecordDialog | Month navigation and view toggle with add record trigger |
| MonthlySummaryCard | ✅ Completed | CategoryProgressSection, CategoryRecords | Full implementation with server data |
| AddRecordDialog | ✅ Completed | Form components, categories API, exchange rate API | Full form with edit/add/delete support |
| MonthYearPicker | ✅ Completed | Popover, navigation, expenses vs income API | Month/year selection with income display |
| CategoryProgressSection | ✅ Completed | Progress components, hooks | Category spending visualization |
| CategoryRecords | ✅ Completed | Toggle components, server data | Expandable records list with sorting |
| ExpenseTrendsChart | ❌ Not Started | Recharts, charts API | Expense trends visualization |
| ExpensesVsIncomeChart | ❌ Not Started | Recharts, charts API | Income vs expenses chart |
| IncomeTrendsChart | ❌ Not Started | Recharts, charts API | Income trends by category |
| IncomeByYearChart | ❌ Not Started | Recharts, charts API | Yearly income comparison |
| RegularPaymentsList | ❌ Not Started | Table components, regular payments API | Manage regular payments |
| Loading Components | ❌ Not Started | - | Loading indicators |
| Form Components | ❌ Not Started | React Hook Form, Zod | Various form utilities |

### Services/Utilities

| Service | Status | Dependencies | Notes |
|---------|--------|-------------|-------|
| Database Schema | ✅ Completed | Drizzle ORM | Database schema migrated |
| Utils (cn, formatters, etc.) | ✅ Completed | - | Core utility functions |
| Query Keys | ✅ Completed | - | React Query key factory |
| Routes Constants | ✅ Completed | - | Route and API endpoint constants |
| Constants | ✅ Completed | - | App constants |
| category-service.ts | ✅ Completed | Database, Drizzle queries | Category CRUD operations |
| record-service.ts | ✅ Completed | Database, Drizzle queries | Record CRUD operations with expenses vs income |
| React Query Provider | ✅ Completed | - | QueryClient setup in root layout |
| Server Functions (createServerFn) | ✅ Completed | TanStack Start | All server functions including expenses vs income |
| Category/Icon Hooks | ✅ Completed | - | Category colors and icon utilities |
| Month Navigation Hook | ✅ Completed | - | Previous/next month calculation |
| charts-service.ts | ❌ Not Started | Database, Drizzle queries | Chart data aggregation |
| regular-payment-service.ts | ❌ Not Started | Database, Drizzle queries | Regular payments management |
| React Query hooks | ✅ Completed | Services, query keys | Full data fetching and mutation hooks including expenses vs income |

## Migration Strategy

1. **Phase 1**: Set up core infrastructure (✅ Completed)
   - Database schema and configuration
   - Core utilities and constants
   - Route definitions

2. **Phase 2**: Service layer
   - Migrate all service files that handle database operations
   - Create React Query hooks for data fetching

3. **Phase 3**: Component migration 
   - Start with basic components and work up to complex ones
   - Migrate in order of dependency (lowest dependencies first)

4. **Phase 4**: Route migration
   - Start with simplest routes and work toward complex ones
   - Test each route thoroughly before moving to next

5. **Phase 5**: API route migration
   - Migrate API routes to TanStack Start server functions
   - Ensure all endpoints work with new architecture

## Current Focus

**Recently Completed**: 
- ✅ **Monthly Budget Page Migration (Phase 1)** - Core route structure with working components
  - Home page redirects to current month budget page  
  - App layout with mobile bottom navigation (History/Charts/Settings)
  - MonthlyHeader component with view toggle and month picker
  - Basic MonthlySummaryCard placeholder component
  - Basic AddRecordDialog placeholder component
  - React Query setup with QueryClient provider
  - Service layer for categories and records (database operations)
  - Core React Query hooks for data fetching

**Current Status**: ✅ **Monthly Budget Route Fully Complete**
The monthly budget page (`/app/$year/$month`) is now fully functional with:
- ✅ Navigation between months/years with income display
- ✅ View toggle between expenses/income
- ✅ Complete UI structure matching original design
- ✅ Full server integration with all APIs
- ✅ Add/Edit/Delete records functionality
- ✅ Currency conversion (PLN ↔ USD)
- ✅ Category selection with icons
- ✅ Comment autocomplete
- ✅ Real-time data updates

**All TODOs in monthly components resolved**:
- ✅ AddRecordDialog trigger implemented in MonthlyHeader
- ✅ Monthly income data query implemented in MonthYearPicker
- ✅ Expenses vs income API created and integrated

**Next Steps**: Choose between:
1. **Charts Page** - Migrate `/app/charts` with visualization components  
2. **Settings Page** - Migrate `/app/settings` with regular payments functionality
3. **Import Page** - Migrate `/app/import` with CSV upload functionality

**Ready for Testing**: The monthly budget route is production-ready!

## Notes

- Skipping authentication/authorization (Clerk integration) as requested
- All database operations will use the migrated Drizzle schema
- Components will be updated to use TanStack Router instead of Next.js router