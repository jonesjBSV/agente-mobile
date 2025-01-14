# Mobile Agent

## Setup Agent

Use `Node v18`

```bash
git clone https://github.com/extrimian/mobile-agent.git
cd agente-mobile
yarn

// in agente-mobile\source\node_modules\react-native-os\android\build.gradle
// modify line 47
    implementation 'com.facebook.react:react-native:+'

# macOS
brew install jq

# Linux
sudo apt-get install jq

yarn custom <project> <version>
```

Avalaible projects:

-   `extrimian` (Extrimian - _com.extrimian.identity_)
-   `quarkid` (QuarkID - _com.extrimian.quarkid_)

## Start Mobile Agent

#### Using android emulator or device

```bash
yarn android
```

#### Using ios simulator (only MacOS)

```bash
yarn ios
```
