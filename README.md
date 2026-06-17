# Peter Harvard International Schools — Official Website

> **Live Site:** [peterharvardschools.cloud](https://peterharvardschools.cloud)
> **Portal:** [portal.peterharvardschools.cloud](https://portal.peterharvardschools.cloud)
> **Stack:** React · Vite · Tailwind CSS · Supabase · Resend · Framer Motion

---

## Overview

Full-stack school website for **Peter Harvard International Schools (PHIS)**, Kubwa, Abuja. Built and maintained by [Anointed Agunloye](https://anobyte.online) / Anobyte.

---

## Features

### Public Pages
- **Home** — Hero slideshow, about preview, why PHIS, school life gallery, stats counter, blog preview, newsletter signup, CTA
- **About** — School story, founder profile (Dr. Peter Oyedotun Agunloye), milestones, mission & vision, core values, team
- **Gallery** — Filterable image grid with lightbox viewer (images managed from dashboard)
- **Blog** — Searchable & filterable posts with category tags
- **Admissions** — Multi-step application form with passport photo upload, preview & submit
- **Contact** — Contact form (saved to Supabase), embedded Google Map
- **Portal** — Student/staff portal link
- **Unsubscribe** — Token-based one-click newsletter unsubscribe (`/unsubscribe?token=...`)

### Admin Dashboard (`/login` → `/dashboard`)
| Tab | Description |
|-----|-------------|
| Overview | Stats cards + recent posts + quick nav |
| Admissions | View, edit, update status, download PDF, delete applications |
| Gallery | Bulk upload with compression, categorise, delete |
| Blog Posts | Create, edit, publish, delete posts with cover images |
| Ticker | Manage scrolling announcement bar (reorder, edit, delete) |
| Messages | Read contact form submissions, mark read, reply via email |
| Newsletter | Compose & send to all subscribers, view send history, manage subscribers |
| Change Password | Update admin account password |

### Newsletter System
- Subscribers stored in Supabase (`newsletter_subscribers`)
- Emails sent via **Resend** through a Supabase Edge Function (`send-newsletter`)
- Professional HTML email template with:
  - PHIS branding (logo, red/green colours)
  - Plain-text fallback
  - `List-Unsubscribe` header (one-click unsubscribe)
  - Unsubscribe footer link with unique token per subscriber
- Send history tracked in `newsletter_sends`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend / DB | Supabase (PostgreSQL + RLS) |
| Storage | Supabase Storage (`phis-media` bucket) |
| Email | Resend API |
| Edge Functions | Supabase Deno Edge Functions |
| PDF Export | jsPDF |
| Routing | React Router v6 |
| Hosting | (Vercel / Netlify — configure as needed) |

---

## Project Structure

```
src/
├── components/
│   ├── Footer.jsx          # Footer with newsletter signup
│   ├── Navbar.jsx          # Responsive top nav + info bar
│   ├── PageLoader.jsx
│   ├── PageTransition.jsx
│   ├── ScrollToTop.jsx
│   └── TickerBar.jsx
├── lib/
│   ├── auth.jsx            # Supabase auth context
│   └── supabase.js         # Supabase client
├── pages/
│   ├── About.jsx
│   ├── AdminLogin.jsx
│   ├── Admission.jsx
│   ├── Blog.jsx
│   ├── BlogPost.jsx
│   ├── Contact.jsx
│   ├── Dashboard.jsx       # Full admin panel
│   ├── Developer.jsx
│   ├── Gallery.jsx
│   ├── Home.jsx
│   ├── NotFound.jsx
│   ├── Portal.jsx
│   └── Unsubscribe.jsx     # Newsletter unsubscribe page
├── App.jsx
├── index.css
└── main.jsx

supabase/
├── functions/
│   └── send-newsletter/    # Deno edge function (Resend)
└── migrations/             # SQL migrations
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Environment Variables


For the Edge Function, set in Supabase dashboard → Edge Functions → Secrets:
```
RESEND_API_KEY=<your_resend_key>
```

---

## Admin Access

| Field | Value |
|-------|-------|
| URL | `/login` |
| Email | `admin@phis.local` |
| Password | *(contact developer)* |

---

## Email / Anti-Spam Setup

To ensure newsletters land in inbox:

1. **SPF** — Add to DNS: `v=spf1 include:resend.com ~all`
2. **DKIM** — Verify domain in Resend dashboard
3. **DMARC** — Add to DNS: `v=DMARC1; p=quarantine; rua=mailto:admin@anobytes.online`
4. **Sender** — `Peter Harvard International Schools <newsletter@anobyte.online>`
5. **Unsubscribe** — Handled automatically via token in every email

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `gallery` | Gallery images |
| `blog_posts` | Blog/news posts |
| `admissions` | Admission applications |
| `messages` | Contact form submissions |
| `ticker_items` | Scrolling announcement bar |
| `newsletter_subscribers` | Email subscribers (with unsubscribe token) |
| `newsletter_sends` | Send history log |

---

## Developer

Built by **Anointed Agunloye**
[anobyte.online](https://anobyte.online)

---

*© 2025 Peter Harvard International Schools. All rights reserved.*
