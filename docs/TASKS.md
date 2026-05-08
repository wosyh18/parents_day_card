# Implementation Tasks

## Phase 1. Project Setup & Interactive Card Component ✅

- [x] Set up Vue 3 project with Vite and TypeScript
- [x] Install and configure Tailwind CSS
- [x] Install and configure Pinia
- [x] Install and configure Vue Router
- [x] Create HomeView.vue
- [x] Create CreateCardView.vue
- [x] Create InteractiveCard.vue
- [x] Implement 3D card flip effect using CSS transform
- [x] Create card front layout
- [x] Create card back layout
- [x] Make layout mobile-first and responsive

## Phase 2. Card Front Customization ✅

- [x] Create 8 background presets
- [x] Create BackgroundSelector.vue
- [x] Implement photo upload
- [x] Convert uploaded photo to base64/Data URL
- [x] Display uploaded photo on card front
- [x] Create sticker preset data
- [x] Create StickerPicker.vue
- [x] Add selected stickers to card front
- [x] Store background, photo, and stickers in Pinia

## Phase 3. AI Message Generator & Letter Editor ✅

- [x] Create LetterEditor.vue
- [x] Bind textarea to Pinia store
- [x] Create mock AI messages
- [x] Add AI recommendation button
- [x] Show 3 predefined Parent's Day messages
- [x] Each message should be 3 to 5 lines
- [x] Fill textarea when a recommendation is selected
- [x] Render letter on card back side

## Phase 4. Audio Recording & Voice Attachment ✅

- [x] Create VoiceRecorder.vue
- [x] Implement MediaRecorder API
- [x] Add Record, Stop, Play, and Re-record buttons
- [x] Add recording timer
- [x] Convert recorded Blob to Data URL
- [x] Store recorded audio Data URL in Pinia
- [x] Display audio player on card back side
- [x] Show warning if MediaRecorder is not supported

## Phase 5. Cloud Storage & Sharing (Supabase Integration) 🚀

- [x] Install @supabase/supabase-js
- [x] Initialize Supabase client (`src/lib/supabase.ts`)
- [x] Create `cards` table in Supabase DB
- [x] Create `photos` and `voices` storage buckets
- [x] Implement cloud save logic (Photo/Audio upload + DB insert)
- [x] Update `CreateCardView.vue` with cloud save support
- [ ] Update `RecipientCardView.vue` to fetch data from cloud
- [ ] Use html2canvas to export card image
- [ ] Add image save button
- [x] Generate card id (UUID via Supabase)
- [x] Create /card/:id route
- [x] Show envelope opening animation
- [x] Allow recipient to flip card
- [x] Allow recipient to play audio
- [x] Add reaction buttons
- [x] Add confetti effect
- [ ] Add Create My Own Card button

## Phase 6. Future Enhancements

- [ ] KakaoTalk Share SDK (Real sharing)
- [ ] Login (Supabase Auth)
- [ ] User's "My Cards" list
- [ ] Real AI API integration
- [ ] Video template feature
