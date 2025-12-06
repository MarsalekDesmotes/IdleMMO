# Implementation Plan: Rarity & Depth Update

This plan focuses on adding depth to Gathering and Crafting through a Rarity System, and adding visual distinction for rare items.

## 1. Rarity System Core
**Objective:** specific rarity tiers and visual indicators.

### Data Structure `gameStore.ts`
- [ ] Update `Item` interface:
    - Add `rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'` (Default: 'common')
- [ ] Create utility `getItemColor(rarity)`:
    - Common: `text-muted-foreground` (Grey)
    - Uncommon: `text-green-500` (Green)
    - Rare: `text-blue-500` (Blue)
    - Epic: `text-purple-500` (Purple)
    - Legendary: `text-orange-500` (Orange)

## 2. Deepening Gathering (Rare Drops)
**Objective:** Make gathering exciting with RNG drops.

### Logic `gameStore.ts`
- [ ] Update `processAutoResources` (Worker production):
    - 1% chance per tick per worker to find a rare variant.
    - Wood -> **Elder Wood** (Uncommon)
    - Stone -> **Gemstone** (Rare)
    - Tech -> **Data Crystal** (Uncommon)
- [ ] Update `activeAction` (Manual gathering):
    - Higher chance (e.g., 5%) to find rare resources when manual gathering.

## 3. UI Updates
**Objective:** Display rarity beautifully.

### `InventoryGrid.tsx` & `EquipmentSlots.tsx`
- [ ] Update item cards/slots to use `getItemColor` for borders and name text.
- [ ] Add a subtle glow effect for Rare+ items.

## 4. Deepening Crafting (Quality Proc)
**Objective:** Crafting shouldn't be static.

### Logic `gameStore.ts` -> `craftItem`
- [ ] Calculate "Crit Chance" based on `Research` skill level.
- [ ] If Crit:
    - Generated Item gets `rarity = 'uncommon'` (or higher).
    - Stats (Attack/Defense) multiplied by 1.2x.
    - Log: "Critical Craft! You created a [Rare] Iron Sword!"
