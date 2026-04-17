# 📦 Vol. 49: Persistence & Caching Strategies

Because results on the Sogni Supernet are transient (24-hour availability), a professional integration must implement a robust **Local Persistence Architecture**. This volume explores how to store generations indefinitely using modern web and server technologies.

---

## 🏛️ The Transient Constraint

- **Sogni Workers**: Act as inference nodes, not long-term storage providers.
- **The URLs**: The `resultUrl` provided by the SDK is a temporary signed link. After 24 hours, the link expires and the underlying data is purged from the Supernet cache.

---

## 🛠️ Browser-Side Persistence (IndexedDB)

For consumer-facing apps, the most efficient storage is on the user's local machine.

### Using Dexie.js for Binary Storage
1.  **Download**: Fetch the result as a `Blob`.
2.  **Store**: Save the Blob directly into IndexedDB.
3.  **Retrieve**: Load the Blob and create a local `URL.createObjectURL(blob)`.

```javascript
// Example storage logic
const response = await fetch(resultUrl);
const blob = await response.blob();
await db.generations.add({
  id: projectId,
  data: blob,
  type: 'video/mp4',
  timestamp: Date.now()
});
```

---

## 🛡️ Server-Side Persistence (S3/Cloudflare R2)

If you are building a social platform where users share results, you must move the media to your own persistent cloud storage.

### The "Sogni-to-Bucket" Pipeline:
1.  **Webhook Trigger**: Listen for the Sogni `project_completed` event.
2.  **Serverless Fetch**: Use a Lambda or Edge Function to download the result from the Sogni URL.
3.  **Stream to Bucket**: Immediately pipe the stream to your S3 or R2 bucket.
4.  **Database Update**: Replace the Sogni `resultUrl` in your database with your own persistent CDN URL.

---

## ⚡ Application-Level Caching

To optimize performance and reduce redundant infrastructure costs, implement a **Prompt-Hash Cache**.

### How it works:
1.  **Hash the Prompt**: Generate a SHA-256 hash of the `positivePrompt`, `modelId`, and `seed`.
2.  **Check Cache**: Before calling the Sogni SDK, check if you already have a result for that specific hash in your persistent storage.
3.  **Result**: If it exists, return the cached version instantly, saving the user Spark/SOGNI tokens and time.

---

## 📐 Cold vs. Warm Storage

- **Warm Storage (Recent)**: Keep the last 10 generations in memory or `localStorage` for instant navigation.
- **Cold Storage (Archive)**: Move older results to the user's local file system or a deep-cloud storage tier to keep your application's memory footprint low.

---

**Next Volume**: [Vol. 50: Error Encyclopedia](./VOL_50_ERRORS.md)
