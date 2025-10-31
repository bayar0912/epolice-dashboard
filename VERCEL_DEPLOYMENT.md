# Vercel Environment Variables Guide

# 1. Database Configuration
DATABASE_URL="mysql://username:password@host:port/database_name"

# Example for PlanetScale (recommended for Vercel)
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/epolice_db?sslaccept=strict"

# 2. Application Settings
JWT_SECRET="your-secure-jwt-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-app-name.vercel.app"

# 3. Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# 4. Other settings
NODE_ENV="production"