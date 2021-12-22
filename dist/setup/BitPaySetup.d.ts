declare const fs: any;
declare const request: any;
declare const BitPaySDK: any;
declare const readline: any;
declare let privateKeyPath: string;
declare let ConfFilePath: string;
declare let keyUtils: any;
declare let keyPair: any;
declare let ecKey: any;
declare let environment: any;
declare let storeFile: boolean;
declare let apiUrl: any;
declare let merchantToken: any;
declare let merchantPairCode: any;
declare let payoutToken: any;
declare let payoutPairCode: any;
declare let keyPath: string;
declare let keyPlain: string;
declare let rl: any;
declare let main: () => void;
declare let selectEnv: () => Promise<void>;
declare let setEnv: (env: any) => Promise<void>;
declare let selectCreateKey: () => Promise<void>;
declare let createNewKey: () => Promise<void>;
declare let loadKey: (privateKey: any) => Promise<void>;
declare let storeKey: () => Promise<void>;
declare let selectTokens: () => Promise<void>;
declare let requestTokens: (option: any) => Promise<void>;
declare let updateConfigFile: () => Promise<never>;
declare function sleep(ms: any): Promise<unknown>;