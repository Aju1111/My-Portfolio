/**
 * Projects shown in the Projects app, on the iPhone home screen and in Spotlight.
 * Edit this list to add, remove or change projects — app.js builds every page from it.
 *
 *   demo / source : optional links. When both are empty the page shows "Request a demo".
 *   screens       : the two iPhone previews. They are illustrative mock-ups, not real client data.
 */
window.PROJECTS = [
  {
    id: 'crm',
    name: 'CRM Mobile App',
    short: 'CRM',
    date: 'Aug 2026',
    tagline: 'Leads, deals and customers in your pocket',
    summary: 'Leads, deals, contacts & tasks',
    icon: 'g-users',
    gradient: 'linear-gradient(160deg,#7DB4FF,#4338CA)',
    description: 'Mobile CRM platform that simplifies lead, deal, contact, task, call and customer relationship management.',
    features: [
      'Cross-platform CRM with modules for leads, deals, tasks, contacts, organizations, calls and notes',
      'Frappe/ERPNext REST APIs integrated with Dio and session-based authentication',
      'Secure storage, KPI dashboards and reusable MVVM components',
    ],
    tech: ['Flutter', 'Dart', 'Frappe/ERPNext', 'Dio', 'MVVM', 'Secure Storage'],
    info: [['Category', 'CRM', 'Sales'], ['Built with', 'Flutter', 'Dart'], ['Backend', 'Frappe', 'ERPNext'], ['Architecture', 'MVVM', 'Dio']],
    screens: [
      {
        hello: 'Good morning 👋', title: 'CRM', avatar: ['M', '#4338CA'],
        stats: [['42', 'Leads'], ['18', 'Deals'], ['9', 'Tasks']],
        section: "Today's tasks",
        rows: [
          { dot: '#0A84FF', t: 'Call · Acme Traders', s: '10:30 AM', badge: 'Call' },
          { dot: '#FF9F0A', t: 'Follow-up · Nova Retail', s: '12:00 PM', badge: 'Task' },
          { dot: '#30D158', t: 'Demo · Blue Bay', s: '3:00 PM', badge: 'Meeting', ok: true },
        ],
        tabs: ['Home', 'Leads', 'Deals', 'More'], tab: 0,
      },
      {
        large: 'Leads', search: 'Search leads',
        chips: ['All', 'New', 'Qualified'],
        rows: [
          { av: ['R', '#FF9F0A'], t: 'Rahul Menon', s: 'Acme Traders', badge: 'New' },
          { av: ['S', '#5E5CE6'], t: 'Sara Ali', s: 'Nova Retail', badge: 'Qualified', ok: true },
          { av: ['A', '#30B0C7'], t: 'Arjun K', s: 'Blue Bay Hotels', badge: 'Contacted' },
        ],
        tabs: ['Home', 'Leads', 'Deals', 'More'], tab: 1,
      },
    ],
  },
  {
    id: 'khayatti',
    name: 'Khayatti Tailoring ERP',
    short: 'Khayatti',
    date: 'Jun 2026',
    tagline: 'Run a tailoring business from one app',
    summary: 'Staff, attendance & daily shop operations',
    icon: 'g-shirt',
    gradient: 'linear-gradient(160deg,#C4A5FF,#6D28D9)',
    description: 'Tailoring business management platform that handles staff, attendance, tasks and daily shop operations.',
    features: [
      'Multi-tenant tailoring ERP built with Flutter, GetX and REST APIs',
      'Staff, attendance, task and daily operations management',
      'JWT authentication, secure token storage and role-based workflows',
      'Notifications and admin HR dashboards',
    ],
    tech: ['Flutter', 'GetX', 'REST APIs', 'JWT', 'Secure Storage', 'Notifications'],
    info: [['Category', 'Tailoring', 'ERP'], ['Built with', 'Flutter', 'Dart'], ['State', 'GetX', 'Routing'], ['Auth', 'JWT', 'Role-based']],
    screens: [
      {
        hello: 'Admin', title: 'Khayatti', avatar: ['K', '#6D28D9'],
        stats: [['12', 'Staff'], ['10', 'Present'], ['24', 'Tasks']],
        section: "Today's tasks",
        rows: [
          { dot: '#6D28D9', t: 'Kandura stitching', s: 'Order #1042', badge: 'In progress' },
          { dot: '#FF9F0A', t: 'Measurements', s: 'Walk-in customer', badge: 'Pending' },
          { dot: '#30D158', t: 'Abaya alteration', s: 'Order #1038', badge: 'Done', ok: true },
        ],
        tabs: ['Home', 'Staff', 'Tasks', 'More'], tab: 0,
      },
      {
        large: 'Attendance', muted: 'Today',
        rows: [
          { av: ['A', '#30D158'], t: 'Ali', s: 'Tailor · 08:58', badge: 'Present', ok: true },
          { av: ['F', '#30D158'], t: 'Faisal', s: 'Cutter · 09:02', badge: 'Present', ok: true },
          { av: ['I', '#FF9F0A'], t: 'Imran', s: 'Helper · 09:24', badge: 'Late' },
        ],
        btn: 'Mark Attendance',
        tabs: ['Home', 'Staff', 'Tasks', 'More'], tab: 1,
      },
    ],
  },
  {
    id: 'ibs-erp',
    name: 'IBS ERP – ALD App',
    short: 'IBS ERP',
    date: 'Apr 2026',
    tagline: 'HR and logistics, in one app',
    summary: 'Attendance, leave, expenses & delivery',
    icon: 'g-faceid',
    gradient: 'linear-gradient(160deg,#5BE49B,#16A34A)',
    description: 'HR and logistics management platform that streamlines attendance, leave, expenses, salary processing and delivery operations.',
    features: [
      'HR and logistics modules built with Flutter and Frappe/ERPNext — leave, expense, salary, delivery trips and dashboards',
      'Face-verified GPS check-in with geofencing',
      'Hive-based offline storage with automatic synchronization for attendance',
    ],
    tech: ['Flutter', 'Frappe/ERPNext', 'Face Verification', 'Geofencing', 'Hive', 'Offline Sync'],
    info: [['Category', 'HR', 'Logistics'], ['Built with', 'Flutter', 'Dart'], ['Backend', 'Frappe', 'ERPNext'], ['Offline', 'Hive', 'Auto-sync']],
    screens: [
      {
        center: true, title: 'Check In', scan: true, muted: 'Verifying face…',
        rows: [{ dot: '#30D158', t: 'Office zone', s: 'Inside geofence', badge: '12 m', ok: true }],
        btn: 'Check In', green: true,
        tabs: ['Home', 'Leave', 'Expense', 'More'], tab: 0,
      },
      {
        large: 'Leave', muted: 'Balance',
        stats: [['18', 'Annual'], ['6', 'Sick'], ['4', 'Casual']],
        section: 'Requests',
        rows: [
          { av: ['A', '#30D158'], t: 'Annual leave', s: '12 – 14 Oct', badge: 'Approved', ok: true },
          { av: ['S', '#FF9F0A'], t: 'Sick leave', s: '2 Oct', badge: 'Pending' },
        ],
        note: 'Saved offline · syncs when online',
        tabs: ['Home', 'Leave', 'Expense', 'More'], tab: 1,
      },
    ],
  },
  {
    id: 'garage',
    name: 'Garage Mobile App',
    short: 'Garage',
    date: 'Jan 2026',
    tagline: 'From vehicle intake to delivery',
    summary: 'Job cards, inspections & gate passes',
    icon: 'g-car',
    gradient: 'linear-gradient(160deg,#94A3B8,#1E293B)',
    description: 'Workshop management platform that streamlines vehicle intake, estimates, job cards, inspections, work orders and delivery.',
    features: [
      'Vehicle intake, estimates, job cards, work orders, quality checks, washing and vehicle delivery',
      'Frappe/ERPNext APIs with QR code generation and scanning',
      'Vehicle damage inspection with photo capture',
      'Digital signatures and gate pass workflows',
    ],
    tech: ['Flutter', 'Frappe/ERPNext', 'QR Codes', 'Camera', 'Digital Signatures'],
    info: [['Category', 'Automotive', 'Workshop'], ['Built with', 'Flutter', 'Dart'], ['Backend', 'Frappe', 'ERPNext'], ['Scanning', 'QR', 'Gate pass']],
    screens: [
      {
        large: 'Job Cards', search: 'Search vehicle or plate',
        chips: ['All', 'In service', 'Ready'],
        rows: [
          { logo: ['T', '#0A84FF'], t: 'Toyota Camry', s: 'DXB A 12345', badge: 'In service' },
          { logo: ['N', '#FF9F0A'], t: 'Nissan Patrol', s: 'DXB K 4421', badge: 'Washing' },
          { logo: ['H', '#30D158'], t: 'Honda Civic', s: 'SHJ 3 7781', badge: 'Ready', ok: true },
        ],
        tabs: ['Jobs', 'Intake', 'Scan', 'More'], tab: 0,
      },
      {
        center: true, title: 'Gate Pass', qr: true, muted: 'DXB A 12345 · Toyota Camry',
        rows: [
          { dot: '#30D158', t: 'Quality check', s: 'All items passed', badge: 'Passed', ok: true },
          { dot: '#30D158', t: 'Customer signature', s: 'Captured', badge: 'Signed', ok: true },
        ],
        btn: 'Deliver Vehicle',
        tabs: ['Jobs', 'Intake', 'Scan', 'More'], tab: 2,
      },
    ],
  },
  {
    id: 'salon',
    name: 'Salon App',
    short: 'Salon',
    date: 'Nov 2025',
    tagline: 'Salon POS and management',
    summary: 'Appointments, billing & inventory',
    icon: 'g-scissors',
    gradient: 'linear-gradient(160deg,#FF8AC4,#E2287A)',
    description: 'Salon management and POS platform that handles appointments, billing, inventory, staff attendance and daily operations.',
    features: [
      'Salon POS with appointment booking, invoicing, inventory and reporting',
      'Multi-branch support',
      'Role-based workflows for admin, manager and staff',
      'Face recognition attendance and Hive-based offline billing',
    ],
    tech: ['Flutter', 'POS', 'Face Recognition', 'Hive', 'Multi-branch'],
    info: [['Category', 'Salon', 'POS'], ['Built with', 'Flutter', 'Dart'], ['Offline', 'Hive', 'Billing'], ['Attendance', 'Face', 'Recognition']],
    screens: [
      {
        hello: 'Good morning 👋', title: 'Salon', avatar: ['S', '#E2287A'],
        stats: [['24', 'Today'], ['8', 'Staff'], ['3', 'Branches']],
        section: 'Appointments',
        rows: [
          { dot: '#E2287A', t: 'Hair Cut', s: '10:30 AM · Aisha', badge: 'Confirmed', ok: true },
          { dot: '#0A84FF', t: 'Facial', s: '11:00 AM · Nisha', badge: 'Pending' },
          { dot: '#30D158', t: 'Manicure', s: '2:00 PM · Rahul', badge: 'Confirmed', ok: true },
        ],
        tabs: ['Home', 'Book', 'POS', 'More'], tab: 0,
      },
      {
        large: 'Invoice', muted: 'Walk-in · Branch 1',
        rows: [
          { av: ['H', '#E2287A'], t: 'Hair Cut', s: 'Aisha', badge: '₹400' },
          { av: ['F', '#0A84FF'], t: 'Facial', s: 'Nisha', badge: '₹900' },
          { av: ['M', '#30D158'], t: 'Manicure', s: 'Rahul', badge: '₹550' },
        ],
        note: 'Offline billing · syncs automatically',
        btn: 'Charge ₹1,850',
        tabs: ['Home', 'Book', 'POS', 'More'], tab: 2,
      },
    ],
  },
  {
    id: 'foodiaq',
    name: 'FoodiaQ',
    short: 'FoodiaQ',
    date: 'Sep 2025',
    tagline: 'Order meals, subscribe and track delivery',
    summary: 'Food ordering, subscriptions & tracking',
    icon: 'g-food',
    gradient: 'linear-gradient(160deg,#FDBA74,#EA580C)',
    description: 'Food ordering and subscription platform that simplifies meal ordering, online payments, delivery tracking and location-based services.',
    features: [
      'Search and filtering with restaurant and chef listings',
      'Order management and subscription-based meal services',
      'Razorpay payments and Google Maps integration',
      'Location-based services, delivery tracking and real-time order status',
    ],
    tech: ['Flutter', 'Razorpay', 'Google Maps', 'Location Services', 'Real-time Tracking'],
    info: [['Category', 'Food', 'Delivery'], ['Built with', 'Flutter', 'Dart'], ['Payments', 'Razorpay', 'Integrated'], ['Maps', 'Google', 'Live tracking']],
    screens: [
      {
        hello: 'Deliver to', title: 'Home', avatar: ['F', '#EA580C'],
        search: 'Search dishes or chefs',
        chips: ['All', 'Biryani', 'Healthy'],
        rows: [
          { logo: ['M', '#EA580C'], t: 'Malabar Kitchen', s: '4.6 ★ · 25 min', badge: 'Open', ok: true },
          { logo: ['C', '#E2287A'], t: "Chef Rina's Meals", s: 'Weekly plan', badge: 'Subscribe' },
          { logo: ['G', '#30D158'], t: 'Green Bowl', s: '4.4 ★ · 30 min', badge: 'Open', ok: true },
        ],
        tabs: ['Home', 'Orders', 'Plans', 'Profile'], tab: 0,
      },
      {
        large: 'Order #2481', map: true,
        rows: [
          { dot: '#30D158', t: 'Out for delivery', s: 'Arriving in 12 min', badge: 'Live', ok: true },
          { dot: '#0A84FF', t: 'Payment', s: 'Razorpay', badge: 'Paid', ok: true },
        ],
        tabs: ['Home', 'Orders', 'Plans', 'Profile'], tab: 1,
      },
    ],
  },
];
