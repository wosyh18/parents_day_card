# Project Context

## Project Name

Parent's Day Digital Card Service

## Project Goal

Build a mobile-first web service where users can create and share a Parent's Day digital card.

Users can decorate the front side of the card with a background, photo, and stickers.  
When the card is clicked, it flips to the back side, where the user can write a letter and attach a voice message.

Recipients can open the shared card, see an envelope opening animation, flip the card, read the letter, play the voice message, leave a reaction, save the card, and create their own card.

## Tech Stack

- Framework: Vue 3
- Build Tool: Vite
- Language: TypeScript
- Vue Style: Composition API
- Styling: Tailwind CSS
- State Management: Pinia
- Routing: Vue Router
- Image Export: html2canvas
- Voice Recording: Web MediaRecorder API
- Sharing: Kakao JavaScript SDK later
- MVP Storage: Pinia + localStorage

## Important Reality Check

For MVP, card data can be saved in localStorage.

However, localStorage only works on the same browser and same device.
A real KakaoTalk shared link cannot load localStorage data from the sender's device.

Therefore:

- MVP: localStorage is acceptable for local demo.
- Real sharing: card data, uploaded photos, and audio files must be saved to a backend or cloud storage.
- Later integration can use Supabase, Firebase, or a custom backend.

Also:

- Image export saves only the visual card image.
- Audio cannot be included inside an exported image.
- If the card includes audio, link sharing is required for the full experience.
- For MVP, audio should be stored as a Data URL if persistence is needed.
- Do not assume a Blob URL will survive after page reload.

## Main Features

### 1. Interactive Card

- Create an InteractiveCard.vue component.
- The card must have a 3D flip effect.
- Use CSS transform and a reactive isFlipped state.
- Do not rely only on Vue <transition>, because both front and back sides should remain in the DOM.
- The front side shows:
  - selected background
  - uploaded photo
  - decorative stickers
- The back side shows:
  - letter text
  - audio player UI
- Clicking the card flips between front and back.

### 2. Card Front Customization

- Users can select one of 8 background presets.
- Background presets can be CSS gradients or image URLs.
- Users can upload a photo from their device.
- The uploaded photo should be converted to base64/Data URL for MVP.
- Users can add stickers such as carnations, hearts, ribbons, and flowers.
- Selected background, uploaded photo, and sticker data must be stored in Pinia.
- For MVP, sticker placement can be fixed or simple absolute positions.
- Complex drag-and-drop editing is out of scope for MVP.

### 3. Letter Editing

- Users can write a letter in a textarea.
- The letter content is stored in Pinia.
- The letter is rendered on the back side of the card.
- Use a warm handwritten-style visual if possible.
- The letter must remain editable.

### 4. AI Message Recommendation

- Users can click a button to get AI message recommendations.
- MVP uses 3 predefined Parent's Day message templates.
- Each message should be 3 to 5 lines.
- When a recommendation is clicked, it fills the letter textarea.
- Real AI API integration is out of scope for MVP.
- Store mock AI messages in src/data/aiMessages.ts.

### 5. Voice Message

- Users can record a voice message using the MediaRecorder API.
- Create a VoiceRecorder.vue component.
- The component should provide:
  - Record button
  - Stop button
  - Play button
  - Recording timer
  - Re-record button
- After recording, convert the audio Blob to a Data URL if it needs to be saved.
- Store the audio Data URL in Pinia.
- The back side of the card should show a styled audio player.
- If the browser does not support MediaRecorder, show a friendly warning message.

### 6. Image Save

- Use html2canvas to export the card as an image.
- Users should be able to save the visual card.
- Since the card has front and back sides, provide a way to save:
  - current visible side
  - front side
  - back side
- Audio is not included in image export.

### 7. Recipient View

- Create a route: /card/:id
- When the recipient opens the card:
  - show an envelope opening animation
  - show the interactive card
  - allow flipping
  - allow audio playback
  - show reaction buttons
  - show "Create My Own Card" button
- For MVP, card data can be loaded from localStorage.
- Clearly structure code so that localStorage can later be replaced with a backend.

### 8. Reactions

- Recipients can leave reactions.
- Reaction examples:
  - heart
  - touched
  - thanks
  - smile
- When a reaction is clicked, show a small confetti effect.
- MVP can store reactions locally.
- Real reaction tracking requires backend storage.

## MVP Scope

Implement these features first:

- Home page
- Card creation page
- Vue Router setup
- Pinia store setup
- 8 background presets
- Photo upload and preview
- Sticker picker
- Letter editor
- Mock AI message recommendation
- Interactive front/back card flip
- Voice recording and audio playback
- Image export
- localStorage card save
- /card/:id recipient page
- Envelope opening animation
- Reaction buttons
- Create My Own Card button

## Out of Scope for MVP

Do not implement these in the first version:

- Real AI API
- Login
- Database
- Supabase/Firebase integration
- Real cross-device sharing
- Real KakaoTalk SDK sharing
- Video editing templates
- Complex drag-and-drop canvas editor
- Admin page

## UI Direction

- Mobile-first.
- Warm and emotional.
- Simple enough for non-technical users.
- Use soft cream, pink, coral, beige, and light green tones.
- Use rounded cards and soft shadows.
- Use Korean UI text.
- Avoid crowded controls.
- The card should look like a real keepsake card.

## Coding Rules

- Use Vue 3 Composition API.
- Use TypeScript.
- Use Pinia for shared card state.
- Use Vue Router for pages.
- Use Tailwind CSS for styling.
- Keep components small and reusable.
- Put mock data in src/data.
- Put shared types in src/types.
- Put localStorage and export helpers in src/lib.
- Do not hardcode API keys.
- Do not implement everything at once.
- After each phase, explain:
  - changed files
  - implemented features
  - how to test
  - remaining limitations
