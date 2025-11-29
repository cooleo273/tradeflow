# Uploads & Payment Proofs

This project expects payment proofs to be accessible via a public URL (or a path) that the frontend can fetch.

Common backend setups:
- The API stores the file in `uploads/` and returns a relative path (e.g. `/uploads/proof-...jpg`) as `proofUrl`.
- The API returns an absolute URL (e.g. `http://localhost:3001/uploads/proof-...jpg`) as `proofUrl`.

Frontend handling:
- The `PaymentsPanel` component builds a safe absolute URL using the `proofBaseUrl` prop (which is `API_BASE_URL` from `lib/config.ts`) and the `proofUrl` returned by the API.
- The helper `buildProofUrl` handles all cases: absolute URLs, relative paths (with or without leading slash), and ensures no double slashes.

If your files are accessible but images don't show in the Admin dashboard, check the following:
1. Check the `proofUrl` value returned by `GET /payments`.
   - If it's null/empty, the backend didn't store it. Inspect upload logic.
   - If it's _relative_ (`uploads/...` or `/uploads/...`) the frontend will concatenate with `NEXT_PUBLIC_API_BASE_URL`.
   - If it's _absolute_ (starting with `http`), the frontend will use it as-is.

2. Check the network response in the browser DevTools → Network for your image URL.
   - Check response status and content-type `image/*`.
   - If you see 404, confirm file exists on server and that ServeStatic alias maps to same folder.

3. If the front-end still returns 404 but `curl http://localhost:3001/uploads/yourfile` returns 200, check that the frontend uses full URL and not a relative URL.
   - `img src={payment.proofUrl}` is correct if `proofUrl` is absolute.
   - `img src={`${API_BASE_URL}${payment.proofUrl}`}` is correct if `proofUrl` is `uploads/...` or `/uploads/...`.

4. In production (serverless / Vercel), prefer using a cloud storage (S3/R2) for uploads and ensure `proofUrl` includes full public URL.

5. If you use Next.js `<Image />` with remote images: add `images.domains` or `images.remotePatterns` in `next.config.mjs`. Otherwise use standard `<img>` and `unoptimized: true`.

---

If you want, I can add S3 upload support and change the upload helper to write uploads to S3 and return its public URL instead of a local path. This yields reliable public URLs and works in serverless environments.