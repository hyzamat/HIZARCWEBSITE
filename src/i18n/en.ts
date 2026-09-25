/**
 * ──────────────────────────────────────────────────────────────
 *  ENGLISH TEXT — every word shown on the site.
 *  The Arabic version is in ar.ts, in exactly the same order:
 *  when you change a line here, change the matching line there.
 * ──────────────────────────────────────────────────────────────
 */

export const en = {
  meta: {
    title: 'HIZARC | IT Company in Dubai — Software, Websites, Games & Cyber Security',
    description:
      'HIZARC is a Dubai-based IT company building custom web applications, software, websites and games — plus IT support, infrastructure design, cyber security and online marketing across the UAE & GCC.',
  },

  common: {
    skip: 'Skip to content',
    logoHome: 'HIZARC — back to top',
    backToTop: 'Back to top',
    reachOut: 'Reach out',
    startProject: 'Start your project',
    whatsapp: 'WhatsApp',
    email: 'Email',
    call: (number: string) => `Call ${number}`,
    /** Pre-typed WhatsApp messages */
    waHello: 'Hi HIZARC, I would like to discuss a project.',
    waQuestion: 'Hi HIZARC, I have a question.',
    language: 'Language',
  },

  nav: {
    main: 'Main',
    mobile: 'Mobile',
    menu: 'Menu',
    open: 'Open menu',
    close: 'Close menu',
    links: { story: 'How we work', services: 'Services', why: 'Why HIZARC', dubai: 'Dubai', faq: 'FAQ' },
    about: 'About',
    contact: 'Contact',
  },

  dock: {
    callUs: 'Call us',
    quote: 'Get a free quote',
    whatsapp: 'Chat on WhatsApp',
    call: 'Call HIZARC',
    whatsappDesktop: 'Chat with HIZARC on WhatsApp',
    chat: 'Chat with us',
  },

  hero: {
    label: 'Introduction',
    place: 'Dubai, UAE',
    kind: 'IT & Software Company',
    title: 'Engineering the digital future from Dubai.',
    /** words of the title drawn in the blue gradient */
    highlight: 'digital future',
    lead: 'HIZARC designs, builds and secures the technology behind ambitious businesses — custom software, web apps, websites, games and IT infrastructure, delivered from Dubai to the world.',
    cta: 'Start a project',
    how: 'See how we work',
    highlights: [
      { value: '24/7', label: 'IT support' },
      { value: 'EN · AR', label: 'Bilingual team' },
      { value: '8-in-1', label: 'Tech partner' },
    ],
    scroll: 'Scroll',
    scrollLabel: 'Scroll to see how we work',
  },

  story: {
    heading: 'How we work — the HIZARC story',
    acts: ['The challenge', 'Meet HIZARC', 'We build', 'Launch', 'Delighted'],
    step: (n: number, total: number) => `Step ${n} of ${total}`,
    skip: 'Skip story',
    jump: (label: string) => `Jump to: ${label}`,
    keepScrolling: 'Keep scrolling to see what happens',
    chapters: [
      {
        title: 'Growing fast. Held back by old systems.',
        body: 'Spreadsheets, disconnected tools and manual work slow the team down — and customers start to notice.',
      },
      {
        title: 'Then they meet HIZARC.',
        body: 'We listen first — mapping every workflow to find where time and money leak away, then agree a clear plan and a fixed quote.',
      },
      {
        title: 'A web application built around their business.',
        body: 'Custom dashboards, automation and integrations — designed, engineered and tested in weekly sprints they can see.',
      },
      {
        title: 'Live — fast, secure and on every screen.',
        body: 'A smooth go-live, team training and 24/7 monitoring. The busywork now runs itself.',
      },
      {
        title: 'And the client? Delighted.',
        body: 'Less busywork, real-time insight and a technology partner that stays with them. Your story could be next.',
      },
    ],
    /** words inside the story illustration */
    scene: {
      sheet: [
        ['Client', 'Qty', 'Total', 'Paid?'],
        ['Al Noor', '12', '4,210', '??'],
        ['Marina Co', '#REF!', '—', 'no'],
        ['Deira Ltd', '7', 'ERR', '??'],
        ['JLT Group', '3', '=SUM(', 'yes?'],
      ],
      notResponding: 'Not responding',
      invoiceDown: 'Invoice system stopped working',
      wait: 'Wait',
      close: 'Close',
      inbox: 'Inbox',
      emails: ['Where is my order?', 'Invoice missing — urgent', 'Re: re: re: quote'],
      note: ['Call Ahmed back!!', 'Invoice #0421 ???'],
      missed: ['3 missed', 'calls'],
      orders: 'Orders',
      betterWay: 'There has to be a better way…',
      drowning: "We're drowning in spreadsheets.",
      mapIt: "Let's map it — and automate it.",
      plan: 'Project plan',
      planSteps: ['Workflow audit', 'Roadmap & fixed AED quote', 'Kick-off this week'],
      building: 'Building',
      live: 'Live',
      dashboard: 'Dashboard',
      revenue: 'Revenue AED',
      automated: 'Automated',
      sales: 'Sales this month',
      feed: ['Invoice #1042 · paid automatically', 'Order #3318 · synced to stock'],
      buildingApp: 'Building your app',
      today: 'Today',
      todayTotal: 'AED 12.4K',
      tasks: 'Tasks',
      late: '0 late',
      cloud: 'Cloud',
      secure: 'Secure',
      toasts: ['Invoice #1043 sent automatically', 'New order synced to your dashboard'],
      delivered: 'Project delivered',
      wow: 'This changes everything!',
    },
  },

  about: {
    eyebrow: 'About HIZARC',
    statement:
      'HIZARC is a Dubai-based technology partner. We blend strategy, design and engineering to build software, websites and games — and the secure infrastructure that keeps them running. One team for every layer of your digital business.',
    /** words of the statement drawn in blue (write them exactly as they appear, punctuation included) */
    emphasis: ['technology', 'partner.', 'software,', 'websites', 'games', 'secure', 'infrastructure', 'One', 'team'],
  },

  marquee: {
    label: 'Technologies we work with',
    title: 'Built with world-class technology',
  },

  services: {
    eyebrow: 'What we do',
    title: 'Everything your business needs to win online.',
    highlight: 'win online.',
    description:
      'Eight specialist services, one accountable team. Start with one — or let us take care of your entire technology stack.',
    discuss: (short: string) => `Discuss ${short.toLowerCase()} with us`,
    /** starts the enquiry message when a visitor taps "Discuss … with us" */
    interested: (title: string) => `Hi HIZARC, I'm interested in ${title}. `,
    items: {
      'web-apps': {
        title: 'Custom Web Applications',
        short: 'Web Apps',
        description:
          'Portals, dashboards, booking engines and SaaS platforms — engineered around the way your business actually works.',
        capabilities: ['SaaS & client portals', 'ERP / CRM dashboards', 'API & payment integrations', 'Cloud-native & scalable'],
      },
      software: {
        title: 'Software Development',
        short: 'Software',
        description:
          'Bespoke mobile, desktop and enterprise software that automates operations and removes the busywork from your day.',
        capabilities: ['iOS & Android apps', 'Business automation', 'Enterprise & desktop software', 'Upgrades & maintenance'],
      },
      websites: {
        title: 'Websites & E-commerce',
        short: 'Websites',
        description:
          'Lightning-fast, bilingual websites and online stores — designed to impress on every screen and built to convert.',
        capabilities: ['Corporate & landing sites', 'E-commerce stores', 'Arabic / English (RTL)', 'SEO-ready CMS'],
      },
      'it-support': {
        title: 'IT Services & Support',
        short: 'IT Support',
        description:
          'Managed IT, helpdesk and on-site engineers that keep your team productive and your systems online — around the clock.',
        capabilities: ['24/7 helpdesk', 'AMC & on-site support', 'Microsoft 365 & Workspace', 'Device & network management'],
      },
      marketing: {
        title: 'Online Marketing',
        short: 'Marketing',
        description:
          'Data-driven SEO, paid ads and social campaigns that turn attention into enquiries — and enquiries into revenue.',
        capabilities: ['SEO & local SEO', 'Google & Meta Ads', 'Social media management', 'Analytics & reporting'],
      },
      games: {
        title: 'Custom Game Development',
        short: 'Games',
        description:
          'Immersive 2D, 3D and AR/VR experiences — from addictive mobile games to branded, gamified campaigns.',
        capabilities: ['Unity & Unreal Engine', 'Mobile, PC & WebGL', 'AR / VR experiences', 'Gamification for brands'],
      },
      infrastructure: {
        title: 'Infrastructure Design',
        short: 'Infrastructure',
        description:
          'Network, server and cloud architecture designed for speed, uptime and growth — documented, secure and future-proof.',
        capabilities: ['Network & Wi-Fi design', 'Cloud migration (AWS / Azure)', 'Servers & data centres', 'Backup & disaster recovery'],
      },
      security: {
        title: 'Cyber Security',
        short: 'Security',
        description:
          'Proactive protection for your data, people and reputation — so threats are stopped long before they become incidents.',
        capabilities: ['Penetration testing (VAPT)', 'Firewall & endpoint security', '24/7 threat monitoring', 'ISO 27001 readiness'],
      },
    },
    /** words inside the service illustrations */
    visuals: {
      bookings: 'Bookings',
      clients: 'Clients',
      revenue: 'Revenue',
      bookingConfirmed: 'Booking confirmed',
      paymentReceived: 'Payment received',
      payment: 'AED 2,450',
      operations: 'Operations',
      jobs: [
        ['Invoice #1042', 'Done'],
        ['Stock sync', 'Auto'],
        ['Payroll run', 'Done'],
        ['Daily report', 'Queued'],
      ],
      today: 'Today',
      tasks: 'Tasks',
      automation: 'Automation',
      flow: ['New order', 'Invoice sent', 'Done ✓'],
      newSeason: 'New season',
      shopNow: 'Shop now',
      price: (amount: number) => `AED ${amount}`,
      speed: 'Speed',
      helpdesk: 'Helpdesk',
      tickets: [
        ['Printer offline', 'Resolved'],
        ['New laptop setup', 'In progress'],
        ['Email access', 'Resolved'],
      ],
      supportTeam: 'Support team',
      onlineNow: 'Online now',
      support: 'support',
      uptime: 'Uptime this month',
      leads: 'Website leads',
      sponsored: 'Sponsored · yourbrand.ae',
      adTitle: 'Your Brand | Official Site',
      ads: 'Ads',
      score: 'SCORE 2450',
      level: 'LV 3',
      cloud: 'Cloud',
      coreSwitch: 'Core switch',
      servers: 'Servers',
      backup: 'Backup',
      wifi: 'Office Wi-Fi',
      latency: 'Latency 4 ms',
      backedUp: 'Backed up',
      threats: 'Threats blocked today',
      threatLog: [
        ['Suspicious login', 'Blocked'],
        ['Phishing email', 'Quarantined'],
        ['Port scan', 'Blocked'],
      ],
      monitoring: '24/7 monitoring',
    },
  },

  why: {
    eyebrow: 'Why HIZARC',
    title: 'One partner. Every layer of your technology.',
    highlight: 'Every layer',
    description:
      'Stop juggling freelancers and five different vendors. We bring strategy, engineering, infrastructure, security and growth together under one roof.',
    /** the big numbers themselves are in src/data/content.ts */
    stats: [
      { prefix: '', suffix: '/7', label: 'Support & monitoring' },
      { prefix: '<', suffix: 'hr', label: 'Critical response time' },
      { prefix: '', suffix: '%', label: 'Custom-built, zero templates' },
      { prefix: '', suffix: '', label: 'Services under one roof' },
    ],
    reasons: {
      partner: {
        title: 'One partner, every layer',
        text: 'Software, web, games, infrastructure, security and marketing — one accountable team instead of five vendors.',
      },
      speed: {
        title: 'Speed without shortcuts',
        text: 'Modern stacks and agile delivery get you to market fast, without compromising code quality.',
      },
      secure: {
        title: 'Secure by design',
        text: 'Security is built in from day one — not bolted on after launch.',
      },
      local: {
        title: 'Local team, global standards',
        text: 'Dubai-based, bilingual and on-site when you need us — delivering to international best practice.',
      },
    },
    show: (title: string) => `Show “${title}”`,
    industriesTitle: 'Industries we serve',
    industries: {
      realEstate: 'Real Estate',
      hospitality: 'Hospitality & Tourism',
      retail: 'Retail & E-commerce',
      logistics: 'Logistics & Trade',
      healthcare: 'Healthcare',
      finance: 'Finance & Fintech',
      education: 'Education',
      startups: 'Startups & SMEs',
    },
  },

  dubai: {
    eyebrow: 'Based in Dubai',
    title: 'Rooted in Dubai. Built for the world.',
    highlight: 'Dubai.',
    /** the small line under the title, shown in the other language */
    accent: { text: 'من دبي إلى العالم', lang: 'ar', dir: 'rtl' },
    lead: "From the region's most ambitious city, we partner with businesses across the UAE, the GCC and beyond — with the responsiveness of a local team and the standards of a global one.",
    time: 'Dubai time · GST',
    checking: 'Checking office hours…',
    open: 'Our team is online right now',
    closed: 'Office closed — we reply next business day',
    coordinatesLabel: 'Coordinates',
    coordinates: '25.2048° N, 55.2708° E',
    hoursLabel: 'Office hours',
    serving: 'Serving',
    regions: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'Bahrain', 'Kuwait', 'Worldwide'],
    skyline: 'Illustrated Dubai skyline',
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions, answered.',
    highlight: 'answered.',
    description: "Can't find what you're looking for? Our team is one message away.",
    ask: 'Ask us on WhatsApp →',
    items: [
      {
        q: 'How much does a website, app or software project cost?',
        a: 'Every project is scoped individually, so you only pay for what you need. Share your requirements through the form and we will send a clear, itemised proposal in AED with fixed milestones — no hidden costs.',
      },
      {
        q: 'How long does a typical project take?',
        a: 'A business website usually takes 2–4 weeks. Custom web applications, software and games typically take 6–16 weeks depending on scope. We work in weekly sprints, so you see progress from week one.',
      },
      {
        q: 'Do you build bilingual Arabic & English websites?',
        a: 'Yes. We design and develop fully bilingual experiences with proper right-to-left (RTL) layouts, Arabic typography and SEO for both languages.',
      },
      {
        q: 'Do you offer ongoing IT support or an AMC?',
        a: 'Absolutely. We offer monthly support plans and Annual Maintenance Contracts covering helpdesk, on-site visits, monitoring, backups, updates and security — tailored to the size of your team.',
      },
      {
        q: 'Do you work with clients outside Dubai?',
        a: 'Yes. We support businesses across all seven emirates, the wider GCC and internationally — remotely, or on-site where the project needs it.',
      },
      {
        q: 'Will I own the source code and designs?',
        a: 'Yes. Once the project is delivered and paid, the source code, designs and intellectual property are fully yours.',
      },
    ],
  },

  contact: {
    eyebrow: 'Reach out',
    title: "Let's Talk",
    highlight: 'Talk',
    description: 'Have a project in mind? Send us a quick message — our team replies within one business day.',
    call: 'Call',
    email: 'Email',
    whatsapp: 'WhatsApp',
    whatsappText: 'Chat with us on WhatsApp',
    office: 'Office',
  },

  form: {
    label: 'Enquiry form',
    name: 'Your name',
    namePlaceholder: 'Your Name',
    email: 'Your email',
    emailPlaceholder: 'Your Email',
    phone: 'Contact number (optional)',
    phonePlaceholder: 'Contact Number',
    message: 'Your message',
    messagePlaceholder: 'Your Message',
    errors: {
      name: 'Please tell us your name.',
      email: 'Please enter a valid email address.',
      message: 'Please add a short message.',
    },
    failed: 'Something went wrong. Please try again, or reach us on',
    sending: 'Sending…',
    send: 'Send Message',
    opensEmail: 'Opens your email app, ready to send.',
    replyTime: 'We reply within one business day.',
    thanks: (name: string) => `Thank you${name ? `, ${name}` : ''}!`,
    sentEmail: 'Your email app should now be open with your message — just press send.',
    sent: 'Your message is with our team. We’ll get back to you within one business day.',
    urgent: 'Urgent? WhatsApp us',
    another: 'Send another message',
    embedTitle: 'HIZARC enquiry form',
    openInTab: 'Open the form in a new tab',
    linkIntro: 'Fill in our short enquiry form and our team will get back to you within one business day.',
    openForm: 'Open enquiry form',
  },

  footer: {
    blurb:
      'Custom software, web applications, websites, games, infrastructure, cyber security, IT support and online marketing — engineered in Dubai for businesses across the UAE, GCC and beyond.',
    social: (network: string) => `HIZARC on ${network}`,
    services: 'Services',
    company: 'Company',
    touch: 'Get in touch',
    rights: (year: number, name: string) => `© ${year} ${name}. All rights reserved.`,
    proudly: 'Proudly based in Dubai, UAE',
  },
}

export type Dict = typeof en
