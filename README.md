# Transport Management System

A modern transport and logistics management system built with Next.js, designed for tracking shipments, managing fleets, and monitoring deliveries.

## Live Demo

The application is deployed on GitHub Pages and can be accessed at:
[https://dostonsuxrobov.github.io/Transport_Managment_System/](https://dostonsuxrobov.github.io/Transport_Managment_System/)

### Demo Credentials
- **Email:** demo@example.com
- **Password:** demo123

## Features

- **Shipment Tracking:** Create, update, and track shipments in real-time
- **Dashboard:** Overview of key metrics and statistics
- **User Authentication:** Secure login and registration system
- **Dark/Light Mode:** Toggle between themes
- **Responsive Design:** Works seamlessly on desktop and mobile devices
- **Static Deployment:** Fully static site using client-side storage (localStorage)

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### How it works:
1. The app is built as a static export using Next.js
2. All data is stored in browser localStorage (no backend required)
3. GitHub Actions automatically builds and deploys on push to main branch
4. The site is served from the `out` directory

### Manual Deployment:
```bash
npm run build  # Build static export
# The output will be in the 'out' directory
```

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
