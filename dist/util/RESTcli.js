"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESTcli = void 0;
const index_1 = require("../index");
const qs = require("querystring");
const rp = require("request-promise-native");
const BitPayException_1 = require("../Exceptions/BitPayException");
class RESTcli {
    constructor(environment, ecKey) {
        this._keyUtils = new index_1.KeyUtils();
        this._ecKey = ecKey;
        this._baseUrl = environment.toUpperCase() == index_1.Env.Test ? index_1.Env.TestUrl : index_1.Env.ProdUrl;
        this.init();
    }
    init() {
        try {
            this._identity = this._keyUtils.getPublicKeyFromPrivateKey(this._ecKey);
            this._commonOptions = {
                headers: {
                    'x-accept-version': index_1.Env.BitpayApiVersion,
                    'x-bitpay-plugin-info': index_1.Env.BitpayPluginInfo,
                    'x-bitpay-api-frame': index_1.Env.BitpayApiFrame,
                    'x-bitpay-api-frame-version': index_1.Env.BitpayApiFrameVersion,
                    'Content-Type': 'application/json'
                },
                json: true
            };
        }
        catch (e) {
            throw new BitPayException_1.default(null, "RESTcli init failed : " + e.message);
        }
    }
    getSignedHeaders(uri, formData) {
        return {
            'x-identity': this._identity,
            'x-signature': this._keyUtils.sign(uri + formData, this._ecKey),
        };
    }
    async post(uri, formData = {}, signatureRequired = true) {
        try {
            const _fullURL = this._baseUrl + uri;
            const _formData = JSON.stringify(formData);
            const _options = JSON.parse(JSON.stringify(this._commonOptions));
            _options.uri = _fullURL;
            _options.body = JSON.parse(JSON.stringify(formData));
            if (signatureRequired) {
                Object.assign(_options.headers, this.getSignedHeaders(_fullURL, _formData));
            }
            return await rp.post(_options).then((resp) => resp).then(resp => {
                return this.responseToJsonString(resp);
            });
        }
        catch (e) {
            throw new BitPayException_1.default(null, "RESTcli POST failed : " + e.message);
        }
    }
    async get(uri, parameters = {}, signatureRequired = true) {
        try {
            const _fullURL = this._baseUrl + uri;
            const _options = JSON.parse(JSON.stringify(this._commonOptions));
            const _query = '?' + qs.stringify(parameters);
            _options.uri = _fullURL;
            _options.qs = parameters;
            if (signatureRequired) {
                Object.assign(_options.headers, this.getSignedHeaders(_fullURL, _query));
            }
            return await rp.get(_options).then((resp) => resp).then(resp => {
                return this.responseToJsonString(resp);
            });
        }
        catch (e) {
            throw new BitPayException_1.default(null, "RESTcli GET failed : " + e.message);
        }
    }
    async delete(uri, parameters = {}) {
        try {
            const _fullURL = this._baseUrl + uri;
            const _options = JSON.parse(JSON.stringify(this._commonOptions));
            const _query = '?' + qs.stringify(parameters);
            Object.assign(_options.headers, this.getSignedHeaders(_fullURL, _query));
            _options.uri = _fullURL;
            _options.qs = parameters;
            return await rp.delete(_options).then((resp) => resp).then(resp => {
                return this.responseToJsonString(resp);
            });
        }
        catch (e) {
            throw new BitPayException_1.default(null, "RESTcli DELETE failed : " + e.message);
        }
    }
    async update(uri, formData = {}) {
        try {
            const _fullURL = this._baseUrl + uri;
            const _formData = JSON.stringify(formData);
            const _options = JSON.parse(JSON.stringify(this._commonOptions));
            Object.assign(_options.headers, this.getSignedHeaders(_fullURL, _formData));
            _options.uri = _fullURL;
            _options.body = formData;
            return await rp.put(_options).then((resp) => resp.data).then(resp => {
                return this.responseToJsonString(resp);
            });
        }
        catch (e) {
            throw new BitPayException_1.default(null, "RESTcli UPDATE failed : " + e.message);
        }
    }
    async responseToJsonString(response) {
        try {
            if (response == null) {
                throw new BitPayException_1.default(null, "Error: HTTP response is null");
            }
            let responsObj = JSON.parse(JSON.stringify(response));
            if (responsObj.hasOwnProperty("status")) {
                if (responsObj["status"] === 'error') {
                    throw new BitPayException_1.default(null, "Error: " + responsObj["error"], null, responsObj["code"]);
                }
            }
            if (responsObj.hasOwnProperty("error")) {
                throw new BitPayException_1.default(null, "Error: " + responsObj["error"]);
            }
            else if (responsObj.hasOwnProperty("errors")) {
                let message = '';
                responsObj["errors"].forEach(function (error) {
                    message += "\n" + error.toString();
                });
                throw new BitPayException_1.default(null, "Errors: " + message);
            }
            if (responsObj.hasOwnProperty("success")) {
                return JSON.stringify(responsObj["success"]);
            }
            if (responsObj.hasOwnProperty("data")) {
                return JSON.stringify(responsObj["data"]);
            }
            return JSON.stringify(responsObj);
        }
        catch (e) {
            throw new BitPayException_1.default(null, "failed to retrieve HTTP response body : " + e.message);
        }
    }
}
exports.RESTcli = RESTcli;
//# sourceMappingURL=RESTcli.js.map