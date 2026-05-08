# Implementation Tasks

## Phase 1. Project Setup & Interactive Card Component

- [ ] Set up Vue 3 project with Vite and TypeScript
- [ ] Install and configure Tailwind CSS
- [ ] Install and configure Pinia
- [ ] Install and configure Vue Router
- [ ] Create HomeView.vue
- [ ] Create CreateCardView.vue
- [ ] Create InteractiveCard.vue
- [ ] Implement 3D card flip effect using CSS transform
- [ ] Create card front layout
- [ ] Create card back layout
- [ ] Make layout mobile-first and responsive

## Phase 2. Card Front Customization

- [ ] Create 8 background presets
- [ ] Create BackgroundSelector.vue
- [ ] Implement photo upload
- [ ] Convert uploaded photo to base64/Data URL
- [ ] Display uploaded photo on card front
- [ ] Create sticker preset data
- [ ] Create StickerPicker.vue
- [ ] Add selected stickers to card front
- [ ] Store background, photo, and stickers in Pinia

## Phase 3. AI Message Generator & Letter Editor

- [ ] Create LetterEditor.vue
- [ ] Bind textarea to Pinia store
- [ ] Create mock AI messages
- [ ] Add AI recommendation button
- [ ] Show 3 predefined Parent's Day messages
- [ ] Each message should be 3 to 5 lines
- [ ] Fill textarea when a recommendation is selected
- [ ] Render letter on card back side

## Phase 4. Audio Recording & Voice Attachment

- [ ] Create VoiceRecorder.vue
- [ ] Implement MediaRecorder API
- [ ] Add Record, Stop, Play, and Re-record buttons
- [ ] Add recording timer
- [ ] Convert recorded Blob to Data URL
- [ ] Store recorded audio Data URL in Pinia
- [ ] Display audio player on card back side
- [ ] Show warning if MediaRecorder is not supported

## Phase 5. Saving, Sharing, and Recipient View

- [ ] Use html2canvas to export card image
- [ ] Add image save button
- [ ] Save card data to localStorage
- [ ] Generate card id
- [ ] Create /card/:id route
- [ ] Create RecipientCardView.vue
- [ ] Load card data from localStorage
- [ ] Show envelope opening animation
- [ ] Allow recipient to flip card
- [ ] Allow recipient to play audio
- [ ] Add reaction buttons
- [ ] Add confetti effect
- [ ] Add Create My Own Card button

## Phase 6. Later Integrations

- [ ] KakaoTalk Share SDK integration
- [ ] Real backend storage
- [ ] Real AI API integration
- [ ] Cross-device card sharing
- [ ] Cloud storage for photos and audio
- [ ] Video template feature
