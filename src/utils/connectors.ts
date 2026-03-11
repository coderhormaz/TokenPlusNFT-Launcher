import { InjectedConnector } from '@web3-react/injected-connector';

// No chain restriction here — chain validation is handled in the UI after connection
export const injected = new InjectedConnector({}); 