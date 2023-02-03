# Görüntülü Konuşma Uygulaması

**_[TR]_**

Aynı odalara dahil olan kullanıcılar görüntülü olarak iletişim kurabilmektedir.
Uygulama aşağıdaki özelliklere sahiptir:
- [X] Oda oluşturma (kayıt gerektirmez)
- [X] Sesi ve mikrofonu açma/kapatma
- [X] (Oda sihibi için) diğer katılımcıların kamera ve mikrofonuna müdahele edebilme
- [X] Odaların linkinin ve parolasının paylaşılarak diğer kullanıcılara gönderilebilmesi

## Kullanılan Teknolojiler

- IonSFU (MCU tipinde WebRTC kullanımını kolaylaştıran Golang kütüphanesi)
- NestJS (Typescript)
- Socket.io
- VueJS

> **_NOTE:_** Uygulama temel bir kullanıma sahiptir ve bir demodur. Farklı teknolojiler de kullanılarak profesyonel hali için geliştirmeler devam etmektedir.

**_[EN]_**
Participants who join same rooms can chat by video
The app has features that below:
- [X] Creating room (no registration require)
- [X] Microphone and camera turn on/off
- [X] (only for room host) changing camera and mic change status of other participants
- [X] Sending the room link and password to (to registered or non-registered) other users

## Used Technologies

- IonSFU (A GOlang library that facilitate using MCU WebRTC)
- NestJS (Typescript)
- Socket.io
- VueJS

To start backend in development mode:
```
cd server
npm run start:dev
```

To start front-end in development mode:
```
cd client
npm run dev
```

To start ion sfu:
```
cd ion-sfu
/main.exe -c config.toml
```

