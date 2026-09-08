# S3 Image Storage and Slideshow Integration

Images for the homepage slideshow are now stored in AWS S3 and fetched
dynamically from the database instead of being bundled as static assets.

## Architecture

**S3 Configuration:**

- [next.config.js](../next.config.js) — whitelists S3 bucket hostname via
  `images.remotePatterns`, reading the domain from
  `process.env.NEXT_PUBLIC_S3_BASE_URL`.
- [.env.local](../.env.local) — `NEXT_PUBLIC_S3_BASE_URL` (e.g.
  `https://foodies-project-users-image-*.s3.us-east-1.amazonaws.com`).

**Image Slideshow Refactor:**

- [components/images/image-slideshow.js](../components/images/image-slideshow.js)
  — Client Component that:
  - accepts `images = []` prop (array of `{ image, alt }` objects).
  - builds S3 URLs as `${S3_BASE_URL}/${image.image}`.
  - manages slideshow rotation via `setInterval` (10-second cycle).
  - auto-advances and loops through all images.
- [app/page.js](../app/page.js) — Server Component that:
  - calls `await getAllMeals()` to fetch all meals from MongoDB.
  - maps meals to `{ image: meal.image, alt: meal.title }`.
  - passes `images` prop to `<ImageSlideshow>`.

**Data Flow**

```
app/page.js (Server)
  → await getAllMeals()
  → map to { image, alt }
  → <ImageSlideshow images={...} />
    (Client Component)
    → renders <Image src="${S3_BASE_URL}/${image.image}" />
```

## Image Files in S3

The slideshow looks for meal images already uploaded to S3 by the
`saveMeal()` action in [lib/meals.js](../lib/meals.js). Each meal's image
is stored with a key like `<slug>.jpg` (e.g. `burger.jpg`, `curry.jpg`).

If you want specific placeholder images for the slideshow before any user
meals are shared, upload them to S3 root with descriptive filenames and
ensure they're in the meal list returned by `getAllMeals()`.

## Benefits vs. static imports

- **Dynamic**: the slideshow reflects the latest meals in the database.
- **Scalable**: avoids bundling dozens of images in the build.
- **Consistent**: uses the same S3 storage as user-uploaded meal images.
- **CDN**: S3 can be fronted with CloudFront for global caching.

## Performance notes

- First slide loads with `loading="eager"` to help LCP.
- Other slides use `loading="lazy"` since they're hidden until rotation.
- Images have explicit `width`/`height` (1280×720) to prevent layout shift.
