# IdleAgeMMO

Browser tabanlı idle/incremental MMO oyunu. Karakter oluştur, görevler ver, kaynak topla, craft yap, savaş ve krallığını geliştir!

## 🎮 Oyun Hakkında

IdleAgeMMO, idle mekanikleri ve aktif oynanışı birleştiren bir MMO oyunudur. Oyuncular karakterlerini oluşturur, görevleri kuyruğa ekler, kaynak toplar, ekipman craft'lar ve düşmanlarla savaşır. Oyun, tarayıcı kapalıyken bile ilerlemeye devam eden idle mekanikleriyle sürekli ilerleme sağlar.

## ✨ Özellikler

- **3 Karakter Sınıfı:** Paladin, Archmage, Ranger
- **Idle Action Queue:** Görevleri kuyruğa ekle, otomatik tamamlansın
- **Turn-Based Combat:** Sınıfa özel skill'lerle savaş
- **Crafting System:** Kaynaklarla ekipman üret
- **Kingdom Building:** Binalar inşa et ve upgrade et
- **Quest System:** NPC'lerden görev al, ödüller kazan
- **Skill Tree:** Her sınıf için özel skill ağacı
- **Global Chat:** Diğer oyuncularla gerçek zamanlı sohbet
- **Cloud Save:** İlerlemeni bulutta sakla

## 🚀 Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Build al
npm run build
```

### Environment Variables

`.env` dosyası oluşturun:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 Dokümantasyon

Detaylı oyun tasarım dokümantasyonu için: **[GDD.md](./GDD.md)**

## 🛠️ Teknoloji Stack

- **Frontend:** React 19.2.0 + TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Backend:** Supabase
- **Real-time:** Supabase Realtime
- **Build Tool:** Vite

## 📖 Oyun Mekanikleri

### Action Queue System
Görevleri kuyruğa ekleyin ve otomatik tamamlanmalarını izleyin. Her görev stamina tüketir ve XP, Gold, kaynaklar kazandırır.

### Combat System
Turn-based combat sistemi. Her sınıfın kendine özel skill'leri var. Düşmanlar oyuncu seviyesine göre ölçeklenir.

### Progression
- Level atlama
- Skill unlock
- Equipment crafting
- Building upgrades

## 🎯 Mevcut Özellikler

✅ Karakter oluşturma (3 sınıf)  
✅ Action queue sistemi  
✅ Idle progression  
✅ Combat sistemi  
✅ Skill tree (12 skill)  
✅ Inventory & Equipment  
✅ Crafting (3 recipe)  
✅ Map & Zone travel  
✅ Kingdom building (3 bina)  
✅ Quest sistemi  
✅ NPC'ler  
✅ Event sistemi  
✅ Global chat  
✅ Cloud save  

## 🔮 Gelecek Özellikler

- Daha fazla zone ve quest
- Guild/Clan sistemi
- Trading sistemi
- Leaderboards
- Prestige sistemi
- Dungeons ve boss battles

## 📝 Lisans

Bu proje özel bir projedir.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen pull request gönderin.

---

**Daha fazla bilgi için:** [GDD.md](./GDD.md)
