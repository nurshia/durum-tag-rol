# 🎭 Durum & Tag Rol Botu

Discord sunucunuz için gelişmiş sadakat sistemi botu. Üyelerinizin tag ve durum kontrolü yaparak otomatik rol yönetimi sağlar.

## ✨ Özellikler

- 🏷️ **Tag Kontrolü**: Sunucu tagını kullanan üyeleri otomatik tespit
- 📝 **Durum Kontrolü**: Custom status'te belirli metni kullanan üyeleri takip
- 🔗 **Birleşik Mod**: Hem tag hem durum kontrolü bir arada
- 🎭 **Otomatik Rol**: Koşulları sağlayan üyelere otomatik rol verme/alma
- 📋 **Log Sistemi**: Tüm işlemlerin detaylı kaydı
- ⚡ **Modern UI**: Discord'un yeni Components V2 arayüzü

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/nurshia/durum-tag-rol.git
cd durum-tag-rol
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `config.js` dosyasını düzenleyin:
```javascript
module.exports = {
  token: "BOT_TOKEN_BURAYA",
  prefix: ".",
  owner: "DISCORD_ID_BURAYA",
  sunucuId: "SUNUCU_ID_BURAYA",
  clanTag: "TAG_BURAYA",
  clanId: "CLAN_ROLE_ID_BURAYA",
  statusText: "DURUM_METNI_BURAYA",
  embedColor: "#5865F2"
};
```

4. Botu başlatın:
```bash
npm start
```

## 📺 Video Anlatım

Kurulum ve kullanım hakkında detaylı video anlatım:

[![Sadakat Bot Kurulum ve Kullanım](https://img.youtube.com/vi/vm9xfCanacc/maxresdefault.jpg)](https://www.youtube.com/watch?v=vm9xfCanacc)

[🎥 YouTube'da İzle](https://www.youtube.com/watch?v=vm9xfCanacc)

## 🎮 Kullanım

### Komutlar

- `.sadakat` - Sadakat sistemi yönetim panelini açar (Sadece bot sahibi)

### Yönetim Paneli

Panelden şunları yapabilirsiniz:

1. **Mod Değiştir**
   - ❌ Kapalı: Sistem devre dışı
   - 🏷️ Sadece Tag: Sadece guild tag kontrolü
   - 📝 Sadece Durum: Sadece custom status kontrolü
   - 🔗 Tag VE Durum: Her ikisi de gerekli

2. **Rol Ayarla**
   - Koşulları sağlayan üyelere verilecek rolü belirleyin

3. **Log Kanalı Ayarla**
   - Sadakat işlemlerinin loglanacağı kanalı seçin

## 🔧 Gereksinimler

- Node.js v16.9.0 veya üzeri
- Discord.js v14.16.3
- Gerekli bot izinleri:
  - Manage Roles
  - View Channels
  - Send Messages
  - Read Message History

## 📁 Proje Yapısı

```
durum-tag-rol/
├── eventler/           # Bot event handler'ları
│   ├── ready.js
│   ├── interactionCreate.js
│   ├── presenceUpdate.js
│   ├── userUpdate.js
│   └── messageCreate.js
├── interactionlar/     # Interaction handler'ları
│   ├── sadakat_menu.js
│   ├── sadakat_mod_select.js
│   ├── sadakat_rol_modal.js
│   └── sadakat_log_modal.js
├── komutlar/          # Bot komutları
│   └── sadakat.js
├── config.js          # Yapılandırma dosyası
├── index.js           # Ana bot dosyası
└── package.json
```

## 🤝 Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🔗 Bağlantılar

- [Discord.js Dokümantasyonu](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord Sunucumuz](https://discord.gg/npm)

## 💬 Destek

Sorularınız veya sorunlarınız için:

- [![Discord Invite](https://dc.oksi.dev/npm)](https://discord.gg/npm)

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!
