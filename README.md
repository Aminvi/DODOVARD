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
- Pickup: 13 Lidipe Street, Agege, Lagos. Pickup has no delivery fee.
- Zone labels: L0, L1, L2, L3, L4, L5. The supplied area lists and rates remain unchanged; L5 requires a custom quote before payment.
- Address recognition, Photon address search and the OpenStreetMap preview are retained.
- Tuesday and Thursday accept same-day fulfilment only, from 1pm until 5:30pm, Lagos time. These dates cannot be pre-booked. Other days retain the ZIP’s 4:28pm same-day cutoff, 6pm previous-evening preorder cutoff and Sunday closure.
- No About Us portrait, chicken skewers, chocolate syrup or Greek dressing. Ketchup remains last in the sauce list.
- One Proceed button attempts the order email and opens WhatsApp automatically, with a thank-you message first. Customers must still tap Send in WhatsApp. No additional Continue to WhatsApp button appears on the website.

## Plantain dish requirement

Every order must include at least one plantain boat, burger, pancake dish or loaded plantain fries. Drinks, sides, regular fries, extras and sauces can be added, but cannot be checked out on their own. Both cart checkout buttons and final order submission enforce this rule.

## Email notifications

Recipient: dodovardng@gmail.com. The website uses FormSubmit. There is no email password or secret API key in the website.

After uploading to the final website address, make one clearly marked TEST ONLY request. Check dodovardng@gmail.com (including spam) for the FormSubmit activation email and activate the form if requested. Then confirm that a second test arrives before relying on live order notifications.

The browser handoff to WhatsApp was verified with a clearly labelled test request; the WhatsApp message was not sent and no real order or payment was made. Inbox delivery has not been verified. A direct automated endpoint test was blocked by the provider with HTTP 403. If the email request fails, Proceed still opens WhatsApp so the order can be sent directly.

Documentation: https://formsubmit.co/documentation

## Map search

The area names in the rate card determine the fee. No distance-based prices or invented zone boundaries are used. Photon is a public demo service without an availability guarantee; manual area selection and prices still work if map search is unavailable. A busier store can configure a dedicated service using geocoderUrl in order-config.js.

Photon: https://github.com/komoot/photon
Map attribution: https://www.openstreetmap.org/copyright

## Verification

177 automated checks cover areas, rates, date/time cutoffs, burger prices, pickup, email payloads, automatic WhatsApp navigation, duplicate-click protection and network failure. Browser checks include an iPhone 14 Pro-sized viewport, free syrups, sides, extra pepper, pickup totals, map results, unavailable Tuesday/Thursday pre-orders and a reachable Proceed button.

## Phone home-screen icons

Both pages declare the Dodovard Apple touch icon, favicons and web app manifest. Icons use the existing logo on opaque black; the Android maskable variant keeps the artwork inside the safe area. Relative paths support hosting at the site root or under a subdirectory. The home-screen shortcut opens in the browser, preserving the existing checkout and WhatsApp flow.

After the updated site is live, remove any old blank shortcut, reopen the website in the phone browser and add it to the Home Screen again.
