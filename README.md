# Smart Vehicle & Fuel Management System (SVFMS)

A comprehensive vehicle and fuel management system for sugar mills built with Next.js, Supabase, and Vercel.

## Features

### Dashboard (Admin)
- ✅ Claims queue with filters and bulk actions
- ✅ Vehicle management and tracking
- ✅ Fraud detection and risk scoring
- ✅ Analytics and reporting
- ✅ Maintenance tracking
- ✅ Zone management (geofencing)

### Mobile App (Coming Soon)
- Fuel claim submission with OCR
- Camera capture with GPS + timestamp
- Offline queue support
- Maintenance request flow

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: Vercel
- **Mobile**: React Native (planned)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd svfms-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials and API keys.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_KEY` - Service role key (server-side only)
- `GOOGLE_VISION_API_KEY` - For OCR processing
- `MAPBOX_API_KEY` - For map visualizations

## Database Schema

The system uses Supabase (PostgreSQL) with the following main tables:

- `employees` - Employee accounts and quotas
- `vehicles` - Fleet information
- `claims` - Fuel claims with OCR data
- `images` - Uploaded photos with fraud detection metadata
- `maintenance_logs` - Vehicle maintenance tracking
- `odometer_logs` - Mileage tracking
- `zones` - Geofencing zones
- `audit_logs` - System audit trail

See `project outline.txt` for detailed schema.

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Setup

1. Create a new Supabase project
2. Run database migrations (see SQL files in `/supabase/migrations`)
3. Enable Row Level Security (RLS)
4. Configure Storage buckets for images
5. Set up database triggers for fraud detection

## Features Roadmap

### Phase 1 (MVP) - Current
- ✅ Dashboard authentication
- ✅ Claims queue with filters
- ✅ Vehicle management
- ✅ Basic analytics

### Phase 2 (Next)
- 🔄 OCR integration for fuel receipts
- 🔄 Fraud detection (pHash, EXIF validation)
- 🔄 Maintenance module
- 🔄 Zone management with maps
- 🔄 Export functionality (CSV, PDF)

### Phase 3 (Future)
- ML-based anomaly detection
- ERP integration
- Predictive maintenance
- Advanced analytics with BI

## Security

- Row-Level Security (RLS) enforced on all tables
- Signed upload tokens for storage
- JWT-based authentication via Supabase
- Audit logs for all critical operations
- Fraud detection with multiple validation layers

## Contributing

Contributions are welcome! Please read the project outline for architectural decisions and coding standards.

## License

Proprietary - All rights reserved

## Support

For issues and questions, please contact the development team.

