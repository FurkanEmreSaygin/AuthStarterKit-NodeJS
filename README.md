# 🚀 AuthStarterKit-NodeJS

Modern ve Güvenli Kimlik Doğrulama Temeli

AuthStarterKit-NodeJS projesine hoş geldiniz! Bu proje, **NodeJS** ve
**Express** kullanarak kullanıcı kimlik doğrulama, yetkilendirme, hata
yönetimi ve gerçek zamanlı bildirimler için hazır, güvenli ve modern bir
başlangıç kiti sunar.

Sistem, güvenlik ve esneklik odaklı, endüstri standartlarında
teknolojilerle sıfırdan inşa edilmiştir.

------------------------------------------------------------------------

## ✨ Projenin Temelleri ve Özellikleri

### 🔐 Kimlik Doğrulama (Authentication)

Durumsuz (stateless) ve güvenli oturumlar için endüstri standardı **JWT
(JSON Web Token)** kullanılır.

### 🛡️ Güvenlik

Kullanıcı güvenliği en yüksek seviyededir:

-   **Bcrypt:** Şifreler güçlü bir şekilde hash'lenir.\
-   **Npm Audit:** Bağımlılıklar taranmış ve güvenlik açığı **1**
    seviyesine kadar düşürülmüştür.

### 🎯 Yetkilendirme (Authorization)

Gelişmiş Rol Tabanlı Erişim Kontrolü (**RBAC**) ile admin, moderatör
veya standart kullanıcı rollerini kolayca yönetebilirsiniz.

### 💾 Veri Yönetimi

Esnek ve performanslı bir yapı için **MongoDB (NoSQL)** kullanılmıştır.

### 📢 Gerçek Zamanlı İletişim

**Emitter** ve **SSE (Server-Sent Events)** ile sunucudan istemciye tek
yönlü gerçek zamanlı veri akışı sağlanır.

### 🌐 Dil ve Hata Yönetimi

-   **i18n Uluslararasılaştırma:** Çok dilli hata ve yanıt desteği.\
-   **Custom Error Sistemi:** Daha merkezî ve anlamlı hata yönetimi.

------------------------------------------------------------------------

## 🛠️ Kurulum ve Çalıştırma

### **Adım 1: Bağımlılıkları Yükleyin**

``` bash
npm install
```

### **Adım 2: .env Dosyası Oluşturun**

Aşağıdaki değerleri ekleyin:

    CONNECTION_STRING="mongodb://localhost:27017/authdb"

    LOG_LEVEL="info"
    JWT_EXPIRY="1d"
    JWT_SECRET="minimum 32 karakter"
    DEFAULT_LANG=
    
    PORT=3001

### **Adım 3: Projeyi Başlatın**

``` bash
# Geliştirme modu
npm run dev

# Standart başlatma
npm start
```

## 💡 Potansiyel Geliştirmeler

-   🔁 Refresh Token sistemi\
-   🔒 OAuth (Google, GitHub...)\
-   🧪 Unit & Integration testleri

------------------------------------------------------------------------

## 👨‍💻 NodeJS ile ❤️ ile geliştirilmiştir.
