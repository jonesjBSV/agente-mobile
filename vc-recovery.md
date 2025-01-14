## Back up of Verifiable Credentials

## Instructions for using the Backup of Verifiable Credentials
In this update, new features have been incorporated into the Identity Wallet to improve the management of verifiable credentials. These features include:

### 1. Exporting Verifiable Credentials: Allows users to generate a file of the stored credentials.
###  2. Importing Verifiable Credentials: Allows users to upload previously exported credentials, provided they meet certain signature and encryption requirements.
These options are available in the application's settings view.

Detailed Functionality:

1. Exporting Verifiable Credentials
- Location: Settings view
- Button: Export Credentials

Flow:
1. When clicking on the Export Credentials button, the user is redirected to a confirmation view.
2. In this view, there is an additional button labeled Send.
3. By clicking on the Send button:
4. The system verifies if there are stored credentials in the Wallet. If credentials exist, an encrypted file with DIDComm and signed with the private keys of the DID configured in the application is generated. The generated file is saved on the user's device.

If no credentials are available, no file will be generated.
2. Importing Verifiable Credentials
Location: Settings view
Button: Import Credentials
Pre-requisite: Have the original DID in the wallet to which the verifiable credentials were issued.

Flow:

1. When clicking on the Import Credentials button, the user is redirected to a confirmation view.
2. In this view, there is an additional button labeled Import.
3. By clicking on the Import button:
4. The application searches for files on the user's device.
5. The system verifies that:
6. The file is encrypted and signed with DIDComm.
7. The private and public keys of the DID that signed the file are imported and configured in the application.
8. If the DID in the file does not match the DID configured in the Wallet, the import will not proceed.
