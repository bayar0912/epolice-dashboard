# Police Monitoring Dashboard (Цагдаагын хяналтын дашбоард)

A comprehensive, real-time police monitoring and management system built with Next.js, TypeScript, and Tailwind CSS. This application provides complete crime statistics, emergency response tracking, resource management, and data registration capabilities for law enforcement agencies.

## 🚀 Features

### 📊 Comprehensive Dashboard
- **Real-time Statistics**: Live crime statistics, incident counts, and response metrics
- **Interactive Navigation**: Sidebar navigation with dedicated sections for different functionalities
- **Multi-view Interface**: Switch between dashboard, calls, cases, reports, officers, map, and database views

### 📞 Emergency Call Management
- **Real-time Call Tracking**: Monitor incoming emergency calls with priority levels
- **Officer Assignment**: Track which officers are handling specific incidents
- **Call Registration**: Add new emergency calls with detailed information
- **Hourly Analytics**: Visualize call patterns throughout the day

### �️ Geographic Visualization
- **Interactive District Map**: Visual representation of crime distribution across districts
- **Heat Map Functionality**: Color-coded areas based on incident frequency
- **Location-based Statistics**: Detailed statistics for each district
- **Real-time Incident Plotting**: Live updates of incident locations

### 📋 Data Management System
- **Comprehensive Database**: Complete record management for all incidents
- **Advanced Search & Filter**: Multi-criteria search and filtering capabilities
- **CRUD Operations**: Create, Read, Update, Delete functionality for all records
- **Data Export**: Export data for reporting and analysis
- **Pagination & Sorting**: Efficient data browsing with pagination and sorting options

### � Officer Management
- **Officer Tracking**: Monitor officer status, location, and current assignments
- **Workload Distribution**: Visual representation of case loads per officer
- **Availability Status**: Real-time status updates (active, on break, off-duty)
- **Performance Metrics**: Track officer response times and case resolution rates

### 📈 Advanced Analytics & Reporting
- **Crime Type Analysis**: Detailed breakdown of different crime categories
- **Trend Analysis**: Monthly and yearly trend visualizations
- **Comparative Reports**: Compare current vs. previous period statistics
- **Resolution Rates**: Track case resolution percentages
- **Resource Utilization**: Monitor equipment and personnel utilization

### � Incident Registration System
- **Multi-step Forms**: Comprehensive incident reporting forms
- **Priority Assignment**: Automatic priority classification
- **Real-time Validation**: Form validation with real-time feedback
- **Automatic Assignment**: Smart officer assignment based on location and availability
- **Follow-up Tracking**: Track incident status from report to resolution

## 🛠 Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Programming Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **Charts & Visualization**: Recharts library
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Form Handling**: Controlled components with validation
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm, yarn, or pnpm package manager
- Modern web browser

### Installation & Setup

1. **Clone and Setup**:
```bash
git clone <repository-url>
cd epolice-dashboard
npm install
```

2. **Development Server (Локал)**:
```bash
npm run dev
```

3. **Development Server (Сүлжээгээр хандах)**:
```bash
npm run dev:network
```

4. **Windows дээр хялбар эхлүүлэх**:
```bash
# PowerShell
.\start-network.ps1

# Command Prompt
start-network.bat
```

5. **Production Build**:
```bash
npm run build
npm run start:network
```

6. **Access Application**:
- **Локал хандалт**: http://localhost:3000
- **Сүлжээгээр хандалт**: http://172.16.88.202:3000
- **Гар утсаар хандалт**: http://172.16.88.202:3000 (ижил WiFi-д байх ёстой)

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard
├── components/
│   ├── MapComponent.tsx     # Interactive map
│   └── DataTable.tsx        # Data management table
└── types/
    └── [type definitions]   # TypeScript interfaces
```

## 🎛 Dashboard Sections

### 1. **Ерөнхий мэдээлэл (Overview)**
- Key performance indicators
- Statistics cards with trend analysis
- Crime distribution charts
- Monthly trend analysis

### 2. **Дуудлага хариуцах (Call Management)**
- Real-time emergency call monitoring
- Hourly call statistics
- Priority-based call classification
- New call registration form

### 3. **Гомдол мэдээлэл (Case Management)**
- Case classification and tracking
- Department-wise case distribution
- Case status monitoring
- Resolution tracking

### 4. **Гэмт хэргийн мэдээлэл (Crime Reports)**
- Detailed crime analytics
- Crime type distribution
- Resolution rate analysis
- Comparative reporting

### 5. **Гаврын хуучин (Officer Management)**
- Officer status tracking
- Workload distribution
- Location assignments
- Performance monitoring

### 6. **Гомдол хуучин (Geographic View)**
- Interactive district map
- Crime heat mapping
- Location-based statistics
- Incident plotting

### 7. **Өгөгдлийн сан (Database)**
- Complete data management
- Advanced search and filtering
- CRUD operations
- Data export functionality

## 📊 Data Models

### Emergency Calls
```typescript
interface EmergencyCall {
  id: number
  type: string
  location: string
  priority: 'high' | 'medium' | 'low'
  time: string
  officer: string
}
```

### Officer Information
```typescript
interface Officer {
  name: string
  badge: string
  status: 'active' | 'break' | 'off-duty'
  location: string
  cases: number
}
```

### Crime Data
```typescript
interface CrimeData {
  name: string
  current: number
  previous: number
  comparison: number
}
```

## 🎨 Design System

- **Color Scheme**: Professional blue/gray palette
- **Typography**: Inter font family
- **Components**: Consistent design patterns
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 compliant

## 📱 Features Overview

### Real-time Capabilities
- Live time display
- Real-time statistics updates
- Instant form submissions
- Dynamic data filtering

### User Interface
- Intuitive sidebar navigation
- Contextual action buttons
- Modal dialogs for forms
- Responsive grid layouts
- Professional color coding

### Data Visualization
- Bar charts for crime comparisons
- Pie charts for distribution analysis
- Line charts for trend analysis
- Area charts for cumulative data
- Interactive tooltips

## 🔧 Development

### Adding New Features
1. Create components in `src/components/`
2. Add new views in the main dashboard
3. Update navigation menu items
4. Add proper TypeScript types

### Code Style Guidelines
- Use TypeScript with strict typing
- Follow Next.js 14 App Router conventions
- Implement responsive design with Tailwind
- Use meaningful component/variable names
- Add comprehensive comments

### Testing
```bash
npm run lint      # ESLint checking
npm run build     # Build verification
```

## 🌐 Localization

The application is designed for Mongolian law enforcement:
- **Language**: Mongolian (Cyrillic script)
- **Date/Time**: Mongolian locale formatting
- **Regional Data**: Mongolia-specific administrative divisions
- **Cultural Context**: Adapted for Mongolian law enforcement practices

## 🚀 Deployment

### Environment Setup
1. Configure environment variables
2. Set up production database connections
3. Configure authentication systems
4. Set up monitoring and logging

### Production Considerations
- Enable production optimizations
- Set up proper error handling
- Configure security measures
- Implement backup procedures

## 📞 Support & Contribution

### Contributing
1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit pull request with documentation

### Support
- Create issues for bugs or feature requests
- Check documentation for common questions
- Contact development team for urgent issues

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Developed for Modern Law Enforcement**: A comprehensive solution for police monitoring and management in the digital age.
