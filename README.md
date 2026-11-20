# Renta.ph

Renta.ph is a free marketplace for the Philippines. Customers find services, rent cars and apartments, and order products. Providers post listings and answer requests.

- **Website:** https://rentaph.github.io/
- **Hosting:** GitHub Pages, from the `main` branch root
- **Sign-in and data:** Firebase Authentication (Google or email) and Cloud Firestore

## Files

| File | What it is |
| --- | --- |
| `index.html`, `style.css`, `app.js` | The app |
| `config.js` | Firebase web settings. These are public by design. |
| `firestore.rules` | Database security rules. Paste them into Firebase → Firestore → Rules. |
| `manifest.json`, `icon-*.png` | Lets people add Renta.ph to their home screen like an app |

## Data

| Collection | Contents | Who can read | Who can write |
| --- | --- | --- | --- |
| `providers/{uid}` | Business name, mobile number, and the free business page (category, about, location, hours, payments, Messenger, promo, page link `slug`, `listed`) | Everyone | That provider |
| `listings/{id}` | Title, category, price, area and details | Everyone | The owner. Admins can delete. |
| `photos/{listingId}` | Compressed listing photos, plus `biz-{uid}` for a business logo | Everyone | The owner. Admins can delete. |
| `inquiries/{id}` | Bookings and inquiries | The customer and the provider only | The customer creates and cancels. The provider accepts, declines, replies and completes. |
| `users/{uid}/private/saved` | Saved listings | That person | That person |
| `admins/{uid}` | Admin list | That person | Firebase console only |

## Make someone an admin

1. Firebase console → **Authentication** → **Users**, then copy the person's **User UID**.
2. **Firestore Database** → **Start collection** `admins` → Document ID = that UID → add any field, for example `role: "admin"`.

An admin sees a **Remove (admin)** button on other people's listings.

## Free business pages

Every business can publish a page for free, forever: no subscription, listing fee or commission.

- Directory: the **Businesses** chip in the app (`app.html#explore-biz`)
- A business page: `app.html#b/{slug}`, for example `app.html#b/juans-bakes-bacolod-ab12`
- Owners create or edit it under **My listings → Create my free page**
- **Message business** opens a normal Inbox conversation (`inquiries` with `itemId` = `biz-{uid}`)

After changing `firestore.rules`, paste them into Firebase → Firestore → Rules and publish.
