
# Provisioning & Automated Setup

## User Onboarding
- On user signup:
  - Create Stripe customer + workspace
  - Call 20i API to provision hosting
  - Setup default templates + form schema

## Automation Scripts
- `onSignup()` worker queues job:
```ts
await stripe.createCustomer(email)
await supabase.createWorkspace(id)
await create20iHosting(username)
```

## Default Config Generator
- Fills:
  - Logo, color, domain
  - WCAG-safe palette
  - Admin starter form

## Restore & Clone Scripts
- Restore snapshot via `.snapshot.json`
- Clone tenant structure (templates, groups, roles) into new org

## Cron Jobs
- Daily cleanup of orphaned records
- Weekly backup of active forms
- Monthly email reports to admin

## White-Label Ready
- Provision domains + themes by org ID
- Connect SMTP + branding per workspace
