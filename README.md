# Dodovard refreshed website

Use the contents of this folder on your existing website host. No build step is required.

This version starts from the ZIP supplied on 31 October 2026.

## Changes

- Plain white Everything plantain introduction. The photo carousel, controls and slideshow code are removed.
- Regular Smash Plantain Burger: ₦7,500.
- Smash Plantain Double Cheeseburger: ₦13,800.
- Double Decker Smash Plantain Burger: ₦14,500.
- The menu starts with Plantain boats, Burgers, Pancakes, Loaded fries and Sauces. Sides, Fries and Extras appear next, immediately before Drinks. Meal sides, extras and syrups have plus/minus quantity controls.
- Maple syrup and Strawberry syrup are both free with pancakes, including quantities selected in the Syrups section. Purchased separately, they retain the supplied menu price of ₦900.
- Pepper choices: Regular pepper, No added pepper, Extra pepper (+₦1,250 per portion). Pancakes show these under Egg seasoning when eggs are included or added.
- Pickup details are shared after order confirmation. Pickup has no delivery fee; the address is not published on the website or included in order-request messages.
- Zone labels: L0, L1, L2, L3, L4, L5. The supplied area lists and rates remain unchanged; L5 requires a custom quote before payment.
- Address recognition, Photon address search and the OpenStreetMap preview are retained.
- Tuesday and Thursday: same-day orders only, 1 p.m.–5:30 p.m. WAT. Other days: same-day orders close at 4:30 p.m. WAT. Pre-orders close at 6 p.m. the evening before. Closed Sundays.
- No About Us portrait, chicken skewers, chocolate syrup or Greek dressing. Ketchup remains last in the sauce list.
- One Proceed button attempts the order email and opens WhatsApp automatically, with a thank-you message first. Customers must still tap Send in WhatsApp. No additional Continue to WhatsApp button appears on the website.

## Plantain dish requirement

Every order must include at least one plantain boat, burger, pancake dish or loaded plantain fries. Drinks, sides, regular fries, extras and sauces can be added, but cannot be checked out on their own. Both cart checkout buttons and final order submission enforce this rule.

## Email notifications

Recipient: dodovardng@gmail.com. Checkout posts to the same-site `/api/order-notification` endpoint. It uses the owner's approved existing Resend connection through `https://www.abiryva.com/api/dodovard-order`; that service retains the private email credential. No email credential is included in this repository or sent to a customer's browser.

The mail service fixes the recipient, validates order fields, limits submission rates, deduplicates order references and returns a provider message ID. Checkout reports success only with that receipt. If sending fails, customers receive a clear instruction to tap Send in WhatsApp; the site does not claim their purchase was completed.

The FormSubmit connection was replaced after diagnostic submissions were denied by the provider. Production verification on 4 November 2026 used clearly marked TEST ONLY requests through both the notification endpoint and the live checkout. The provider returned message receipts, and the mailbox owner confirmed the test notification arrived at dodovardng@gmail.com.

## Map search

The area names in the rate card determine the fee. No distance-based prices or invented zone boundaries are used. Photon is a public demo service without an availability guarantee; manual area selection and prices still work if map search is unavailable. A busier store can configure a dedicated service using geocoderUrl in order-config.js.

Photon: https://github.com/komoot/photon
Map attribution: https://www.openstreetmap.org/copyright

## Verification

177 automated checks cover areas, rates, date/time cutoffs, burger prices, pickup, email payloads, automatic WhatsApp navigation, duplicate-click protection and network failure. Browser checks include an iPhone 14 Pro-sized viewport, free syrups, sides, extra pepper, pickup totals, map results, unavailable Tuesday/Thursday pre-orders and a reachable Proceed button.

## Phone home-screen icons

Both pages declare the Dodovard Apple touch icon, favicons and web app manifest. Icons use the existing logo on opaque black; the Android maskable variant keeps the artwork inside the safe area. Relative paths support hosting at the site root or under a subdirectory. The home-screen shortcut opens in the browser, preserving the existing checkout and WhatsApp flow.

After the updated site is live, remove any old blank shortcut, reopen the website in the phone browser and add it to the Home Screen again.
