# Green Nest Cafe website

This is the public site plus a password-protected owner dashboard at **/admin**. The owner can update the menu (prices, items, labels, signature drinks), hours, photos, story, reviews and contact info from a phone. Edits go live without a redeploy, and nobody needs a Netlify or GitHub account to make them.

It runs on the same system as the MAKINCAKECo. site. Netlify Functions render the page and run the dashboard API, and Netlify Blobs stores her saved content and photos.

## What the site does on its own

- **Open now.** It shows "Open now until 5 PM" or "Closed now. Opens tomorrow at 7:30 AM" from the hours she sets, using Central time.
- **Today's hours.** Today's row is highlighted in the hours table.
- **Signature drinks.** Any menu item with Signature checked gets a small drink illustration. The glass colors come from the ingredients in its name and description, such as matcha, hojicha, ube, strawberry and mango.
- **Map and directions.** It embeds a Google map and adds Google Maps and Apple Maps direction buttons.
- **Photos.** The first photo shows beside the story. The Photos section appears once there are two or more photos.
- **Reviews.** The Google rating and link always show. Quotes she adds herself appear next to them.
- **Search results.** It adds coffee-shop structured data with opening hours, so Google can show them.

## Setup (one time)

```bash
cd ~/Downloads/greennestcafe
npm install
npx netlify-cli login
npx netlify-cli deploy --prod --site-name greennestcafe
npx netlify-cli env:set ADMIN_PASSWORD "pick-a-password"
npx netlify-cli deploy --prod
```

If the `greennestcafe` name is taken, pick another one and update `SITE_URL` in `lib/render.mjs`. If they own greennestcafe.com, add it under Domain management in Netlify and update `SITE_URL` to match.

## Check these with the owner before launch

- **Greek and Cobb salads.** The old site used the rice bowl descriptions for both salads, so I left those descriptions blank.
- **Italian sandwich.** The old site said "banana pickles". I changed it to "banana peppers".
- **Roaster.** "Espresso from Eiland Coffee Roasters" comes from an article written when the cafe opened. Confirm they still use Eiland.
- **YUBU.** The old site mentioned YUBU dishes, but they aren't on the menu. Add them in the dashboard if they're still served.
- **Reviews.** I couldn't confirm the old site's quotes were real, so I removed them. Paste in real ones word for word under **Reviews**.
- **Order ahead.** If they take orders online, add the link under **Contact & Info** and an "Order ahead" button appears.
- **Photos.** Upload a few photos. The first one shows next to the story.

## Passwords

She can change her own password under **Help → Change your password**. `ADMIN_PASSWORD` always works as your master key.
