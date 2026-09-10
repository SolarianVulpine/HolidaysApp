# Public Holidays

→ [React Practice Day 1 Challenge](https://reactpractice.dev/exercise/build-a-public-holidays-app/?utm_source=calendar.reactpractice.dev&utm_medium=social&utm_campaign=calendar-v1) ←

<hr>

A small React application for browsing national holidays for the current year. Select a country to load its public holidays from the [OpenHolidays API](https://www.openholidaysapi.org/).

The Netherlands is selected by default. The interface uses a Paper CSS sheet layout and follows the visual reference in [styleref/image.png](styleref/image.png).

## Features

- Country selector populated from the OpenHolidays API
- Public holidays for the current calendar year
- English holiday and country names
- Loading, empty, and request error states
- Responsive paper-style layout

## Getting started

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite development server        |
| `npm run build`   | Type-check and create a production build |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run Oxlint                               |

## Data source

The app uses these OpenHolidays API endpoints:

- `GET /Countries?languageIsoCode=en`
- `GET /PublicHolidays?countryIsoCode={country}&validFrom={year}-01-01&validTo={year}-12-31&languageIsoCode=en`

The API currently does not provide United States (`US`) holiday data, so the country selector only contains countries returned by the service.

## Tech stack

- React 19 with TypeScript
- Vite
- TanStack React Query
- Paper CSS
- Oxlint
