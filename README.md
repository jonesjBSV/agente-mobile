## [Description](https://github.com/ssi-quarkid/agente-mobile?tab=readme-ov-file#description) and [Features](https://github.com/ssi-quarkid/agente-mobile?tab=readme-ov-file#description)
## [Technologies](https://github.com/ssi-quarkid/agente-mobile?tab=readme-ov-file#technologies)
## [Architecture](https://docs.quarkid.org/en/Arquitectura/) and [Documentation](https://docs.quarkid.org/en/Arquitectura/componentes/)
## Configurations:
### 1. [Local Environment Setup](https://github.com/ssi-quarkid/agente-mobile?tab=readme-ov-file#local-environment-setup)
### 2. [Environment Variables](https://github.com/ssi-quarkid/agente-mobile?tab=readme-ov-file#environment-variables)

-------------------------------------------------------------------------

## Description

The agent allows the creation of a self-sovereign digital identity. 
It also creates, receives, and shares verifiable credentials.
It can have trusted contacts, public DIDs of organizations and governments. Access services from different organizations securely and in a standardized way. Communicate with other agents or organizations in a decentralized, encrypted, and authenticated manner.

### Features

- DID Generation (Generation of keys for recovery, update, signature, and transport)
- Storage of verifiable credentials
- Storage of known entities
- Handling of WACI-DIDComm protocol (with WACI-Interpreter)
- Capability for credential presentation
- DID import and export
- VC Attachments
- VCs Back Up and Recovery

## Technologies

The application uses the following technologies:

- Node 14.19.3
- React Native 0.69.3
- Expo 5.3.0
- Typescript 2.0.4
  
## Architecture
[Diagram](https://docs.quarkid.org/en/Arquitectura/)

## Documentation
[Link](https://docs.quarkid.org/en/Arquitectura/componentes/)

## Local Environment Setup

1. Clone the repository

Prerequisites:
- Install Java SDK v14.*
- Install the development environment [React Native 0.69.3](https://reactnative.dev/docs/environment-setup)
- Configure Java environment variables:
    - JAVA_HOME
    - PATH

- Install Android Studio. *It should be used with Java SDK v14, mentioned in the first step.*
- Generate an emulator in Android Studio
- Open the project with the selected editor
- Open a terminal and execute:

Install dependencies:

```bash
cd source
yarn 
yarn postinstall
```

- Modify:
The file: node_modules\react-native-os\android\build.gradle 
Line 47: change 'compilation' to 'implementation'

## Environment Variables

- Configure your variables in the file /source/src/config/agent.ts

Start the app

```bash
yarn android
```

### General

N/A

## Logs

N/A

## Network Requirements
The application must have internet connectivity. 

## Access Route

N/A 
