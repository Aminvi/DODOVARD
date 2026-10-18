# Dodovard image update — 18 October 2026

Updated assets are saved within the website ZIP at these paths:

| Source image | Website item | Saved path inside DODOVARD/ |
|---|---|---|
| IMG_8600.PNG | Gizzard Stuffed Plantain Boat | dodovard_food_images/menu/gizzard-boat-v2.png |
| IMG_8601.PNG | Extra Syrup (maple) | dodovard_food_images/sauces/maple-syrup-v2.png |
| IMG_8602.PNG | Extra Syrup (strawberry) | dodovard_food_images/sauces/strawberry-syrup-v2.png |
| IMG_8604.PNG | Chicken Stuffed Plantain Boat | dodovard_food_images/menu/chicken-boat-v2.png |
| IMG_8605.PNG | Grilled Chicken | dodovard_food_images/menu/grilled-chicken-v2.png |
| IMG_8606.PNG | Grilled Turkey | dodovard_food_images/menu/grilled-turkey-v2.png |
| IMG_8607.heic | Last kitchen carousel slide (original slide 9) | dodovard_food_images/carousel/IMG_8607.jpg |

The two syrup images already had genuine transparency and were copied unchanged. Four food photos had baked-in checkerboard backgrounds removed using built-in ImageGen, with transparent output enabled. Their plates, sauce containers and garnish are retained. The HEIC was converted to browser-compatible JPEG with its full background retained. All kitchen carousel photographs display with a mild 12% brightness increase. The previously removed seventh slide stays removed, so there are eight slides.

## ImageGen prompt set

The following prompt was used once for each food photo, replacing SUBJECT with the matching description below:

> Use case: background-extraction. Edit target: the supplied photograph of SUBJECT. Remove ONLY the light grey and white checkerboard background OUTSIDE the black plate. This checkerboard is baked into the photo, so replace it with real alpha transparency. Preserve the whole black plate, every food detail, sauce containers, garnish, geometry, camera angle, colors and lighting exactly as photographed. Do not redraw, restyle, add, or remove any food or plate. Keep the entire plate and any food extending over its edge intact with clean natural antialiased edges. Output one centered standalone transparent PNG product cutout with a little clear margin, no checkerboard, no white background, no cast shadow outside the plate, no new text.

Subjects:
- Gizzard: horizontal gizzard stuffed plantain boat on a round black plate with a Stunna’s sauce tub.
- Chicken boat: diagonal chicken stuffed plantain boat on a round black plate with a small bowl of red sauce.
- Grilled chicken: glazed grilled chicken leg quarter on a round black plate.
- Grilled turkey: two glazed grilled turkey pieces with parsley on a round black plate.

## Verification

All six product assets have real alpha transparency. All image references resolve to local files, and the website JavaScript passes its syntax check. The new carousel photo retains an opaque background. The app blocked automated browser inspection on this turn, so the final page layout could not be rechecked in the live browser.
