# Path Finder

A React Native GPS activity tracking app built with Expo. Record your walks and runs, see your path drawn live on the map, and review past activities with a full route replay.

---

## Features

- Real-time map powered by MapTiler
- Live GPS location tracking with a blue dot
- Start/Stop activity recording with a live polyline drawn on the map
- Live stats: duration and distance while tracking
- Activity history stored locally with SQLite
- Detail view for each past activity with a static route map

---

## How to Run the Project

### Prerequisites

- Node.js 18+
- Xcode (for iOS simulator or device)
- An Apple Developer account (free is enough for device testing)
- A [MapTiler](https://cloud.maptiler.com) API key (free tier available)
- A Google Maps API key (required for the Android Maps SDK — [get one here](https://console.cloud.google.com))

### 1. Clone and install dependencies

```bash
git clone https://github.com/anabogatinovska/path-finder-react-native.git
cd path-finder-react-native
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your keys:

```
EXPO_PUBLIC_MAPTILER_API_KEY=your_maptiler_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

Also paste the Google Maps key into `app.json` under `android.config.googleMaps.apiKey`.

### 3. Run on iOS Simulator

```bash
npx expo run:ios
```

### 4. Run on a Physical iOS Device

Connect your iPhone via USB, trust the Mac on the device, then:

```bash
npx expo run:ios --device
```

Once the build is installed, start Metro and open the app:

```bash
npx expo start
```

> Your iPhone and Mac must be on the same WiFi network, or run `npx expo start --tunnel` as an alternative.

### 5. Run on Android

```bash
npx expo run:android
```

---

## AI Tools Used

### Claude (Anthropic) — Claude Code

The entire project was built through a conversation with **Claude Code**, Anthropic's AI coding assistant used directly inside VS Code.

**How it helped:**

- **Architecture decisions** — Before writing a single line, Claude recommended the state management approach (Zustand over Redux/Context for this scale) and the styling solution (NativeWind), with clear reasoning for each choice.
- **Project scaffolding** — Claude set up the full clean architecture from scratch: `features/`, `services/`, `store/`, `utils/`, `types/` layers with strict separation of concerns, following a `CLAUDE.md` guidelines file it also authored.
- **Feature implementation** — Each feature (map integration, activity tracking, history screen) was implemented end-to-end by Claude: service layer, Zustand store, hooks, and UI components.
- **Debugging** — When native errors appeared (e.g. `Cannot find native module 'ExpoSQLite'`, `InvalidHostID` on device install, the Metro "Refreshing..." loop), Claude diagnosed the root cause and provided the exact fix.
- **Decision guidance** — When facing choices like SQLite vs AsyncStorage, Claude gave a structured comparison tied to the specific use case rather than a generic answer.

---

## Biggest Challenge During Vibe Coding

The biggest challenge was **trusting the process without losing architectural control**.

Vibe coding moves fast — Claude would generate entire feature layers in one response, and the temptation was to just accept everything and keep going. The real discipline was in slowing down at key decision points: reading the generated code, understanding the data flow, and asking "does this actually follow the architecture we agreed on?" before moving to the next feature.

A concrete example: the `onPanDrag` + `followsUserLocation` conflict in the map component. On iOS, enabling both native camera following and manual `animateToRegion` caused the map to fire `onPanDrag` during programmatic animations, which silently disabled the follow mode. The symptom (Metro "Refreshing..." banner flickering) looked completely unrelated to the actual bug. Without understanding the underlying react-native-maps event system, the AI-suggested code would have looked correct but behaved wrongly in production.

The lesson: vibe coding is most effective when you treat the AI as a senior pair programmer, not an autopilot. You still need to own the understanding of what is being built.
