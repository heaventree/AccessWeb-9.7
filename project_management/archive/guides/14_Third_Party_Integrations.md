
# Third-Party Integrations

## Stripe (Billing)
- Stripe Connect multi-tenant setup
- Features:
  - Subscription plans
  - Usage billing
  - Admin-level user charges

## Email (IMAP/SMTP)
- NodeMailer for outgoing
- IMAP for listening/responding to support tickets
- Webhooks to process replies into thread

## Hosting Automation (20i API)
- Create hosting account on user registration
- Use Heaventree reseller key via `.env`

## Workflow Platforms
- Zapier, Make.com, Boost.space
- Trigger form submissions, send to Airtable/Sheets
- OAuth token stored per user/tenant

## Analytics & Insights
- PostHog for funnel tracking
- Optional: Plausible or Fathom for privacy-first installs

## File Sync
- Dropbox, OneDrive via SDK
- Allow template sync, snapshot export, auto backup
