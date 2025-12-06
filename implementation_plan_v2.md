# Implementation Plan: Idle & Social Features

This plan focuses on adding depth and social interaction to the game, prioritizing cost-effective implementation.

## 1. Global Chat System (High Priority - Social)
**Objective:** Enable players to communicate with basic rate limiting to prevent spam and reduce DB costs.

### Frontend (`ChatView.tsx` & `ChatWidget.tsx`)
- [ ] Create a collapsible Chat Widget that persists across screens.
- [ ] Display messages with Timestamp, Username, and formatted text.
- [ ] **Cost Control UI:** Implement "Slow Mode" logic visually (e.g., send button disabled for 5s after generic message).

### Backend (`chatStore.ts`)
- [ ] connect to `chat_messages` table via Supabase Realtime.
- [ ] **Optimization:** Limit fetched history to last 50 messages to save bandwidth/reads.
- [ ] **Rate Limiting:** Prevent sending more than 1 message every 3 seconds per client.

## 2. Rebirth / Prestige System (Medium Priority - Depth)
**Objective:** Add endgame replayability.

### Backend (`gameStore.ts`)
- [ ] Add `rebirth` count and `prestigeCurrency` (e.g., "Ancient Shards") to Character.
- [ ] Implement `performRebirth()` function:
    - Resets: Level, XP, Resources, Gold, Basic Skills (Woodcutting/Mining).
    - Keeps: Inventory (Equipment?), Prestige Currency, Guild Membership.
    - Awards: `Ancient Shards` based on total Level/XP before reset.
- [ ] Create `PrestigeStore` or upgrades list:
    - Permanent +% XP Gain.
    - Permanent +% Resource Production.

### Frontend (`RebirthModal.tsx` or Temple View)
- [ ] UI to show "What you lose" vs "What you gain".
- [ ] Shop interface to spend Ancient Shards.

## 3. Guild Improvements (Low Priority - Depth)
**Objective:** Give guilds a purpose.

### Backend
- [ ] Add `guild_buffs` logic (simple static bonuses based on Guild Level).
- [ ] Update `guildStore.ts` to calculate active buffs.

### Comparison to Previous Plan
- Focused on "Chat" and "Rebirth" first as requested.
- Chat restrictions implemented client-side + simple DB Limits later if needed.
