
# Strapi CMS for ACCESS-WEB-V9.7

This directory contains the Strapi CMS configuration for the ACCESS-WEB-V9.7 application.

## Setup Instructions

1. Initialize the Strapi application:

```
npx create-strapi-app@latest strapi-cms --quickstart
```

2. Create the `pages` content type with the following fields:
   - title (Text)
   - content (Rich Text)
   - slug (Text, unique)
   - isPublished (Boolean)

3. Set up permissions in Strapi admin:
   - Navigate to Settings > Roles > Public
   - Enable find and findOne operations for the Pages content type
   - For authenticated users, enable all CRUD operations

4. Set the environment variables in your .env file:
```
STRAPI_URL=http://0.0.0.0:1337
```

## Running the CMS

```
cd strapi-cms
npm run develop
```

The Strapi admin will be available at: http://0.0.0.0:1337/admin
