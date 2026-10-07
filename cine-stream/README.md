# Cine-Stream

A movie database application built with Next.js 15 (App Router). I migrated this project from standard React to Next.js to implement Server-Side Rendering (SSR) and improve SEO.

## What's inside
* **Server Components:** TMDB API data is fetched directly on the server without using `useEffect`.
* **Client Components:** Interactivity like the "Add to Favorites" button is kept separate using `"use client"`.
* **Dynamic Routing:** Movie detail pages use file-based routing (`/movie/[id]`).
* **SEO Metadata:** Used `generateMetadata` to dynamically change the page title and description for every single movie.

## Tech Stack
* Next.js 15
* React
* Plain CSS
* TMDB API

## How to run locally

1. Clone the repo:
   ```bash
   git clone [https://github.com/Hemant-Ballia/cine-stream.git](https://github.com/Hemant-Ballia/cine-stream.git)