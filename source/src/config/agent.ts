import { IAgentConfig } from '../models';

const agentConfig: IAgentConfig = {
    dwnUrl: 'https://dwn-ssi.buenosaires.gob.ar/',
    universalResolverUrl: 'https://proxyquarkid.extrimian.com',//'https://node-ssi.buenosaires.gob.ar',
    didMethod: 'did:quarkid',//'did:quarkid:zksync',
    entities: 'https://quarkid.org/.well-known/did.json',
    vcslApiEndpoint: 'http://localhost:8000/vcsl' // Added for BRC-52 status checks
};

export default agentConfig;
