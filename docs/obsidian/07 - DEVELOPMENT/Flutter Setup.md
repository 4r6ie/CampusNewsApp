# Flutter Setup

## Install SDK

```bash
# macOS/Linux
git clone https://github.com/flutter/flutter.git
flutter channel stable
flutter upgrade
flutter doctor
```

## Project Setup

```bash
cd apps/mobile/flutter_app
flutter pub get
flutter run          # connected device/emulator
```

## Generate Platform Folders

If not already present: `flutter create .` inside `apps/mobile/flutter_app`.

## Related

- `apps/mobile/flutter_app/`
- `04 - ARCHITECTURE/Flutter Architecture.md`