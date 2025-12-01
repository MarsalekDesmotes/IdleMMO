# IdleAgeMMO - Game Design Document (GDD)
**Versiyon:** 1.0  
**Tarih:** Kasım 2025  
**Platform:** Web Browser (React + TypeScript)  
**Genre:** Idle/Incremental MMO

---

## 1. GENEL BAKIŞ

### 1.1 Oyun Kavramı
IdleAgeMMO, browser tabanlı bir idle/incremental MMO oyunudur. Oyuncular karakterlerini oluşturur, görevler verir, kaynak toplar, ekipman craft'lar, düşmanlarla savaşır ve krallıklarını geliştirir. Oyun, idle mekaniğiyle sürekli ilerleme sağlar; oyuncular aktif olmasa bile kuyruğa eklenen görevler tamamlanır.

### 1.2 Temel Özellikler
- **Idle/Active Hybrid Gameplay:** Hem aktif hem idle oynanış
- **MMO Elementleri:** Global chat, cloud save, multi-user support
- **Deep Progression:** Level, skills, equipment, buildings
- **Combat System:** Turn-based combat with class-specific skills
- **Crafting & Economy:** Resource gathering, crafting, building upgrades
- **Quest System:** NPC'ler, görevler ve ödüller

### 1.3 Target Audience
- Idle/incremental oyun severler
- MMO oyuncuları
- Browser tabanlı oyun oynayanlar
- Casual/core hybrid oyuncular

---

## 2. OYUN MEKANİKLERİ

### 2.1 Core Loop
1. **Görev/Kuyruk Sistemi:** Oyuncu görevleri kuyruğa ekler
2. **Idle Progression:** Görevler otomatik tamamlanır
3. **Kaynak Toplama:** Wood, Stone, Tech kazanılır
4. **Crafting:** Kaynaklarla ekipman üretilir
5. **Combat:** Düşmanlarla savaşılır, XP/Gold kazanılır
6. **Progression:** Level atlanır, skill'ler açılır
7. **Kingdom Building:** Binalar upgrade edilir
8. **Döngü tekrar eder**

### 2.2 Idle Mechanics
- **Action Queue System:** 3+ slot kuyruk
- **Active Action Tracking:** Progress bar ve geri sayım
- **Offline Progression:** Tarayıcı kapalıyken bile ilerleme (localStorage)
- **Automatic Resource Regeneration:** Stamina (1/s), HP (0.5/s) otomatik yenilenir

### 2.3 Stamina System
- Her görev stamina tüketir
- Otomatik yenilenme: 1 stamina/saniye
- Görevleri optimize etmek için strateji gerektirir

---

## 3. KARAKTER SİSTEMİ

### 3.1 Character Creation
**Karakter Özellikleri:**
- **İsim:** Özelleştirilebilir
- **Sınıf:** 3 seçenek (Paladin, Archmage, Ranger)
- **Cinsiyet:** Male/Female
- **Avatar:** Class ve cinsiyete göre ön tanımlı avatarlar

### 3.2 Character Classes

#### **Paladin** (Tank/Support)
- **Başlangıç Stats:**
  - HP: 120
  - Max HP: 120
  - Stamina: 100
  - Max Stamina: 100
- **Rolü:** Yüksek savunma ve dayanıklılık
- **Oyun Stili:** Melee, tank, healing

#### **Archmage** (DPS/Caster)
- **Başlangıç Stats:**
  - HP: 80
  - Max HP: 80
  - Stamina: 80
  - Max Stamina: 80
- **Rolü:** Yüksek zarar, düşük HP
- **Oyun Stili:** Ranged, burst damage, mana management

#### **Ranger** (DPS/Agile)
- **Başlangıç Stats:**
  - HP: 100
  - Max HP: 100
  - Stamina: 120
  - Max Stamina: 120
- **Rolü:** Denge, yüksek agility
- **Oyun Stili:** Ranged, mobility, critical hits

### 3.3 Character Stats
- **Level:** 1'den başlar, sınırsız
- **XP:** Level atlamak için gerekli
- **HP:** Health Points
- **Stamina:** Action'lar için enerji
- **Gold:** Ana para birimi
- **Resources:** Wood, Stone, Tech

### 3.4 Derived Stats
- **Strength:** Physical attack power
- **Intelligence:** Magic attack power
- **Agility:** Speed, critical chance
- **Defense:** Damage reduction
- **Attack:** Total attack power
- **HP Regen:** Health regeneration rate
- **Crit Chance:** Critical hit probability

---

## 4. ACTION/GÖREV SİSTEMİ

### 4.1 Action Queue
- **Maksimum Slot:** Başlangıç 3 slot (genişletilebilir)
- **Queue Management:** Görev ekleme, çıkarma, sıralama
- **Automatic Execution:** İlk görev otomatik başlar
- **Sequential Processing:** Bir görev bitince sonraki başlar

### 4.2 Mevcut Actions

#### **Outskirts Zone Actions**

**Chop Wood**
- Süre: 5 saniye
- Stamina: 10
- Ödüller:
  - XP: 5
  - Gold: 2
  - Wood: 5

**Mine Stone**
- Süre: 8 saniye
- Stamina: 15
- Ödüller:
  - XP: 8
  - Gold: 3
  - Stone: 3

**Patrol Village**
- Süre: 10 saniye
- Stamina: 20
- Ödüller:
  - XP: 15
  - Gold: 10

#### **Iron Hills Zone Actions**

**Deep Mining**
- Süre: 15 saniye
- Stamina: 30
- Ödüller:
  - XP: 25
  - Gold: 10
  - Stone: 10
  - Tech: 1

**Study Ancient Runes**
- Süre: 25 saniye
- Stamina: 35
- Ödüller:
  - XP: 50
  - Gold: 20
  - Tech: 5

**Construct Golem**
- Süre: 45 saniye
- Stamina: 50
- Gereksinimler: Library Level 1
- Ödüller:
  - XP: 100
  - Tech: 10

#### **Building-Based Actions**

**Help Blacksmith**
- Süre: 20 saniye
- Stamina: 25
- Gereksinimler: Blacksmith Level 1
- Ödüller:
  - XP: 30
  - Gold: 40

---

## 5. COMBAT SİSTEMİ

### 5.1 Combat Overview
- **Combat Type:** Turn-based
- **Enemy Finding:** "Find Enemy" butonu ile rastgele düşman
- **Enemy Scaling:** Oyuncu level'ına göre ayarlanır

### 5.2 Combat Flow
1. **Idle Phase:** Düşman yok
2. **Combat Start:** "Find Enemy" ile başlatılır
3. **Active Phase:** Turn-based combat
4. **Victory/Defeat:** Sonuç ve ödüller
5. **Return to Idle:** Yeni düşman bulunabilir

### 5.3 Enemy System
**Goblin Scout (Örnek)**
- Level: Oyuncu level'ına eşit
- HP: 50 + (Level × 10)
- Damage: 5 + Level
- Ödüller:
  - Gold: Level × 10
  - XP: Level bazlı

### 5.4 Combat Actions
- **Basic Attack:** Temel fiziksel saldırı
- **Class Skills:** Unlock edilmiş active skill'ler
- **Turn Management:** Player → Enemy → Player...

### 5.5 Combat Log
- Tüm action'lar loglanır
- Real-time görüntüleme
- Scrollable history

---

## 6. SKILL SİSTEMİ

### 6.1 Skill Tree Structure
- **Skill Points:** Level atlarken kazanılır
- **Prerequisites:** Bazı skill'ler önceki skill gerektirir
- **Skill Types:** Passive ve Active

### 6.2 Paladin Skills

**Divine Strength** (Passive, Cost: 1, Level 2)
- +5 Strength

**Smite** (Active, Cost: 1, Level 3)
- Damage: 15
- Mana Cost: 10
- Cooldown: 0

**Holy Aura** (Passive, Cost: 2, Level 5)
- Required: Divine Strength
- +1 HP/s regeneration

**Divine Heal** (Active, Cost: 2, Level 8)
- Required: Holy Aura
- Heal: 30
- Mana Cost: 20
- Cooldown: 3

### 6.3 Archmage Skills

**Arcane Intellect** (Passive, Cost: 1, Level 2)
- +5 Intelligence

**Fireball** (Active, Cost: 1, Level 3)
- Damage: 25
- Mana Cost: 15
- Cooldown: 0

**Mana Flow** (Passive, Cost: 2, Level 5)
- Required: Arcane Intellect
- +3 Agility

**Deep Freeze** (Active, Cost: 2, Level 8)
- Required: Mana Flow
- Damage: 15
- Mana Cost: 20
- Cooldown: 2

### 6.4 Ranger Skills

**Eagle Eye** (Passive, Cost: 1, Level 2)
- +5 Agility

**Quick Shot** (Active, Cost: 1, Level 3)
- Damage: 12
- Mana Cost: 5
- Cooldown: 0

**Swift Step** (Passive, Cost: 2, Level 5)
- Required: Eagle Eye
- +3 Strength

**Aimed Shot** (Active, Cost: 2, Level 8)
- Required: Swift Step
- Damage: 35
- Mana Cost: 25
- Cooldown: 2

---

## 7. ENVANTER VE EKİPMAN

### 7.1 Inventory System
- **Slots:** 50 slot
- **Item Types:** Resource, Currency, Equipment, Consumable, Material
- **Stacking:** Aynı item'lar stacklenebilir
- **Drag & Drop:** Item hareket ettirilebilir

### 7.2 Equipment Slots
- **Head:** Kask, başlık
- **Body:** Zırh, kıyafet
- **Hands:** Eldiven, bilezik
- **Weapon:** Silah, kalkan

### 7.3 Equipment Stats
- **Attack:** Saldırı gücü
- **Defense:** Savunma gücü
- **Speed:** Hız bonusu
- **Class Restriction:** Bazı ekipmanlar belirli sınıflara özel

---

## 8. CRAFTING SİSTEMİ

### 8.1 Crafting Overview
- **Crafting View:** Tüm recipe'ler listelenir
- **Requirements:** Ingredients + Gold + Building Level
- **Crafting Time:** Anlık (gelecekte zaman bazlı olabilir)
- **XP Reward:** Crafting XP kazandırır

### 8.2 Mevcut Recipes

**Iron Sword**
- Gold Cost: 50
- Ingredients: Wood (20), Stone (40)
- Required Building: Blacksmith Level 1
- XP Reward: 20
- Result: Weapon (Attack +5)

**Iron Shield**
- Gold Cost: 40
- Ingredients: Wood (30), Stone (30)
- Required Building: Blacksmith Level 1
- XP Reward: 15
- Result: Weapon slot (Defense +3)

**Steel Pickaxe**
- Gold Cost: 100
- Ingredients: Wood (50), Stone (100), Tech (10)
- Required Building: Blacksmith Level 2
- XP Reward: 50
- Result: Weapon (Attack +4)

### 8.3 Crafting Requirements Display
- Mevcut kaynaklar gösterilir
- Yetersiz kaynaklar kırmızı
- Bina gereksinimleri kontrol edilir
- Lock icon ile kilitli recipe'ler

---

## 9. MAP VE TRAVEL

### 9.1 Zone System
- **Current Zone:** Oyuncunun bulunduğu bölge
- **Zone Travel:** Bölgeler arası seyahat
- **Zone Requirements:** Level gereksinimleri

### 9.2 Mevcut Zones

**The Outskirts** (Level 1-20)
- Başlangıç bölgesi
- Güvenli alan
- Basic resource gathering
- Açıklama: "Safe lands surrounding the stronghold. Good for gathering basic resources."

**Iron Hills** (Level 20-40)
- Orta seviye bölge
- Daha iyi kaynaklar
- Temple of Rebirth (Class Reset)
- Açıklama: "Rugged terrain rich in minerals. Home to the Temple of Rebirth."

### 9.3 Temple of Rebirth
- **Location:** Iron Hills
- **Requirement:** Level 20+
- **Function:** Class reset
- **Options:** Paladin, Archmage, Ranger

---

## 10. KINGDOM/BUILDING SİSTEMİ

### 10.1 Building Types

**Town Hall** (Başlangıç Level 1)
- Base Cost: Gold 100, Wood 50, Stone 20
- Function: Kingdom'un kalbi, yeni özellikler açılır
- Upgrade Cost: Her level için %50 artış

**Blacksmith**
- Base Cost: Gold 150, Wood 100, Stone 50
- Function: Weapon/Equipment crafting
- Unlocks: Crafting recipes

**Library**
- Base Cost: Gold 200, Wood 150, Stone 100
- Function: Research, tech advancement
- Unlocks: Advanced actions (Construct Golem)

### 10.2 Building Upgrade System
- **Cost Scaling:** Her level için 1.5x maliyet artışı
- **Formula:** Base Cost × (1.5^currentLevel)
- **Resource Display:** Mevcut kaynaklar gösterilir
- **Affordability Check:** Yetersiz kaynak kırmızı gösterilir

### 10.3 Resource Display
- Wood, Stone, Tech gösterilir
- Kart bazlı görsel gösterim
- Real-time güncelleme

---

## 11. QUEST VE NPC SİSTEMİ

### 11.1 Quest Types
- **Resource Quest:** Belirli kaynak toplama
- **Level Quest:** Belirli level'a ulaşma
- **Kill Quest:** Belirli düşman öldürme

### 11.2 Mevcut Quests

**Gather Wood** (Quest ID: q1)
- NPC: Elder Marcus
- Description: "Collect 10 pieces of Wood to help build the settlement."
- Requirement: Wood × 10
- Rewards: XP 50, Gold 10

**Rat Problem** (Quest ID: q2)
- NPC: Captain Alaric
- Description: "Defeat 5 Giant Rats in the sewers."
- Requirement: Kill "Giant Rat" × 5
- Rewards: XP 100, Gold 25, Health Potion × 2

### 11.3 NPCs

**Elder Marcus**
- Role: Village Elder
- Zone: Outskirts
- Dialogue:
  - "Welcome to our village, traveler."
  - "We are in dire need of resources. Can you help us?"
- Quest: Gather Wood

**Captain Alaric**
- Role: Guard Captain
- Zone: Outskirts
- Dialogue:
  - "Keep your weapon sharp."
  - "The rats are getting bold lately."
- Quest: Rat Problem

### 11.4 Quest Progress Tracking
- Real-time progress güncellemesi
- Otomatik tamamlama kontrolü
- Reward dağıtımı

---

## 12. EVENT SİSTEMİ

### 12.1 Event Mechanics
- **Rastgele Tetikleme:** 30-90 saniye arası
- **Event Duration:** 60 saniye (test için)
- **Global Events:** Tüm oyuncular için aktif

### 12.2 Mevcut Events

**Blood Moon**
- Description: "Enemies are stronger but grant double XP!"
- Duration: 60 saniye
- Enemy Modifier:
  - Name Prefix: "Corrupted"
  - Level Bonus: +2
  - HP Multiplier: 1.5x
- XP Multiplier: 2.0x

**Goblin Raid**
- Description: "Goblins are swarming! Quick battles."
- Duration: 60 saniye
- Enemy Modifier:
  - Name Prefix: "Raider"
  - Level Bonus: 0
  - HP Multiplier: 0.8x
- XP Multiplier: 1.2x

### 12.3 Event Banner
- Aktif event'ler için banner
- Kalan süre gösterimi
- Otomatik gizlenme

---

## 13. CHAT SİSTEMİ

### 13.1 Global Chat
- **Type:** Global chat channel
- **Real-time:** Supabase Realtime ile anlık mesajlaşma
- **Message History:** Son 50 mesaj
- **Auto-scroll:** Yeni mesajlara otomatik scroll

### 13.2 Chat Features
- Username display (email prefix veya game username)
- Timestamp gösterimi
- Message formatting
- Scroll area

### 13.3 Technical Implementation
- Supabase Realtime subscription
- INSERT event listening
- Message persistence

---

## 14. PROGRESSION SİSTEMİ

### 14.1 Level System
- **Starting Level:** 1
- **Starting XP:** 0
- **Starting Max XP:** 100
- **XP Scaling:** Her level için artan XP gereksinimi

### 14.2 XP Sources
- Action completion
- Combat victories
- Quest completion
- Crafting items

### 14.3 Level Up Benefits
- Skill point kazanımı
- Max HP artışı
- Max Stamina artışı
- Stat bonuses

---

## 15. ECONOMY VE KAYNAKLAR

### 15.1 Currency
**Gold**
- Ana para birimi
- Actions'tan kazanılır
- Combat'tan kazanılır
- Quest ödülleri
- Crafting ve building maliyetleri

### 15.2 Resources

**Wood**
- Ağaç kesme ile kazanılır
- Crafting malzemesi
- Building upgrade maliyeti

**Stone**
- Taş madenciliği ile kazanılır
- Crafting malzemesi
- Building upgrade maliyeti

**Tech**
- Advanced actions ile kazanılır
- High-tier crafting malzemesi
- Advanced building maliyeti

### 15.3 Resource Management
- Inventory'de stacklenir
- Resource header'da gösterilir
- Real-time güncelleme

---

## 16. TECHNICAL SPECIFICATIONS

### 16.1 Technology Stack
- **Frontend:** React 19.2.0 + TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Backend:** Supabase
- **Real-time:** Supabase Realtime
- **Build Tool:** Vite

### 16.2 Data Persistence
- **Local Storage:** Zustand persist middleware
- **Cloud Save:** Supabase (profiles table)
- **Sync Frequency:** Important actions'ta otomatik

### 16.3 Database Schema

**profiles Table**
```sql
- id (UUID, PK, FK to auth.users)
- username (text, unique)
- game_state (JSONB)
- updated_at (timestamp)
```

**chat_messages Table**
```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- username (text)
- content (text)
- created_at (timestamp)
```

### 16.4 Authentication
- **Provider:** Supabase Auth
- **Methods:** Email/Password
- **Guest Mode:** Local-only gameplay
- **Auto-register:** Sign-in fail'de otomatik signup

---

## 17. UI/UX TASARIM

### 17.1 Layout Structure
- **Sidebar:** Navigation + User Profile
- **Main Content:** View-specific content
- **Resource Header:** Gold, resources, stats
- **Event Banner:** Active events
- **Debug Panel:** Development tools

### 17.2 Navigation Views
1. **Dashboard (Stronghold):** Action queue, active action
2. **Combat:** Combat interface
3. **Skills:** Skill tree
4. **Inventory:** Equipment and items
5. **Crafting:** Crafting recipes
6. **Map:** Zone selection
7. **World:** NPCs and quests
8. **Kingdom:** Building management
9. **Chat:** Global chat

### 17.3 Visual Design
- **Color Scheme:** Dark theme with accent colors
- **Icons:** Lucide React icon set
- **Cards:** Modern card-based UI
- **Responsive:** Mobile-friendly (md: breakpoints)

---

## 18. MEVCUT FEATURE LIST

### ✅ Implemented Features
1. ✅ Character creation (3 classes)
2. ✅ Action queue system
3. ✅ Idle progression
4. ✅ Combat system (turn-based)
5. ✅ Skill tree (12 skills total)
6. ✅ Inventory & Equipment
7. ✅ Crafting system (3 recipes)
8. ✅ Map & Zone travel
9. ✅ Kingdom building (3 buildings)
10. ✅ Quest system (2 quests)
11. ✅ NPCs (2 NPCs)
12. ✅ Event system (2 events)
13. ✅ Global chat
14. ✅ Cloud save
15. ✅ Authentication

### 🔄 Partial Features
- Quest system (2 quest, genişletilebilir)
- Event system (2 event, genişletilebilir)
- Crafting (3 recipe, genişletilebilir)
- Zones (2 zone, genişletilebilir)

### ❌ Not Implemented (Future)
- Guild/Clan system
- PvP
- Trading
- Auction house
- Leaderboards
- Achievements
- Daily/Weekly quests
- Prestige system
- Multi-zone dungeons
- Boss battles

---

## 19. GAME BALANCE

### 19.1 Action Balance
- **Early Game:** 5-10 saniye actions
- **Mid Game:** 15-25 saniye actions
- **Late Game:** 45+ saniye actions
- **Stamina Cost:** Action süresine göre scale edilir

### 19.2 Reward Balance
- **XP Scaling:** Action süresi ve zorluğuna göre
- **Gold Scaling:** Action seviyesine göre
- **Resource Rewards:** Action tipine göre

### 19.3 Combat Balance
- Enemy HP: 50 + (Level × 10)
- Enemy Damage: 5 + Level
- Reward: Level × 10 Gold

---

## 20. FUTURE ROADMAP

### Phase 1: Core Polish (Current)
- ✅ All basic systems
- ✅ Cloud save
- ✅ Multiplayer chat

### Phase 2: Content Expansion
- More zones (3-5 additional)
- More quests (10-20)
- More recipes (10-15)
- More skills per class
- More buildings

### Phase 3: Social Features
- Guild/Clan system
- Friend system
- Trading system
- Leaderboards

### Phase 4: Advanced Features
- Prestige system
- Dungeons
- Boss battles
- Seasonal events
- Achievements

---

## 21. MONETIZATION (Optional Future)

### Free-to-Play Model
- **Premium Currency:** (Future implementation)
- **Cosmetic Items:** (Future implementation)
- **Quality of Life:** (Future implementation)
- **No Pay-to-Win:** Temel ilerleme ücretsiz

---

## 22. ART & ASSETS

### 22.1 Character Avatars
- **Male/Female variants**
- **Class-specific avatars:**
  - Paladin (Male/Female)
  - Archmage (Male/Female)
  - Ranger (Male/Female)

### 22.2 UI Assets
- Icons: Lucide React
- Backgrounds: Gradient shaders
- Combat arena: Background image

---

## 23. SOUND & MUSIC

### 23.1 Current Status
- ❌ Sound effects: Not implemented
- ❌ Background music: Not implemented

### 23.2 Future Plans
- UI sound effects
- Combat sounds
- Ambient music
- Event music variations

---

## 24. ACCESSIBILITY

### 24.1 Current Features
- Keyboard navigation support
- Clear visual feedback
- Tooltip system
- Progress indicators

### 24.2 Future Improvements
- Screen reader support
- Colorblind-friendly palettes
- Text size options
- Reduced motion options

---

## 25. PERFORMANCE

### 25.1 Optimization
- **State Management:** Zustand (lightweight)
- **Rendering:** React 19 optimizations
- **Storage:** LocalStorage + Cloud sync
- **Real-time:** Efficient Supabase subscriptions

### 25.2 Target Performance
- Initial load: < 3 seconds
- Action response: < 100ms
- Smooth 60 FPS UI
- Minimal memory usage

---

## 26. TESTING & QUALITY ASSURANCE

### 26.1 Testing Areas
- ✅ Core gameplay loops
- ✅ Combat system
- ✅ Inventory management
- ✅ Cloud save/load
- ✅ Chat functionality

### 26.2 Known Issues
- Environment variables setup needed
- Guest mode chat limitations
- Limited error handling

---

## 27. DOCUMENTATION

### 27.1 Code Documentation
- TypeScript types for all systems
- Component structure
- Store architecture

### 27.2 Player Documentation
- ❌ In-game tutorial (Future)
- ❌ Help system (Future)
- ✅ Tooltips and UI hints

---

## 28. CONCLUSION

IdleAgeMMO, sağlam bir temel üzerine kurulu bir idle/incremental MMO oyunudur. Mevcut sistemler çalışır durumda ve genişletilebilir bir mimariye sahiptir. Oyun, idle gameplay, combat, crafting, building ve social özellikleri birleştiren dengeli bir deneyim sunmaktadır.

**Strengths:**
- Çalışan core systems
- Extensible architecture
- Modern tech stack
- Cloud save & multiplayer ready

**Areas for Growth:**
- Content expansion
- Social features
- Polish & UX improvements
- Performance optimization

---

**Document Version:** 1.0  
**Last Updated:** Kasım 2025  
**Maintained By:** Development Team


