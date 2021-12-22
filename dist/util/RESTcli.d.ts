import * as elliptic from "elliptic";
export declare class RESTcli {
    _ecKey: elliptic.ec.KeyPair;
    _identity: string;
    _baseUrl: string;
    private _keyUtils;
    private _commonOptions;
    constructor(environment: string, ecKey: elliptic.ec.KeyPair);
    private init;
    private getSignedHeaders;
    post(uri: string, formData?: any, signatureRequired?: boolean): Promise<any>;
    get(uri: string, parameters?: any, signatureRequired?: boolean): Promise<any>;
    delete(uri: string, parameters?: any): Promise<string>;
    update(uri: string, formData?: any): Promise<string>;
    responseToJsonString(response: any): Promise<string>;
}
