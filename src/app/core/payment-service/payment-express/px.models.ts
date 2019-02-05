import { PxRequestBase, PxTransactionRequestBase } from "./px.models.base";
import { parseHostBindings } from "@angular/compiler";

export class PxStatusRequest extends PxRequestBase {
    constructor() {
        super("Status");
    }
}

export class PxPurchaseRequest extends PxTransactionRequestBase {
    constructor() {
        super("Purchase");
    }
}

export class PxRefundRequest extends PxTransactionRequestBase {
    constructor() {
        super("Refund");
    }
}

export class PxAuthRequest extends PxTransactionRequestBase {
    constructor() {
        super("Auth");
    }
}

export class PxTransactionResponse {
    TxnType: string;
    StatusId: number;
    TxnStatusId: number;
    Complete: number;
    ReCo: string;
    Tmo: number;
    TxnRef: string[]; 
    DL1: string;
    DL2: string;
    B1: any; //string - could use ignoreAttrs option in parser;
    B2: any; //string - could use ignoreAttrs option in parser;
    Result: TransactionResult;

    static load(xml: string): PxTransactionResponse {
        const reviver = (name, value) => {
            switch (name) {
                case "StatusId":
                case "TxnStatusId":
                case "Complete":
                case "Tmo":
                    return parseInt(value);
            }
            return value;
        }

        let response: PxTransactionResponse;
        const xml2js = require('xml2js');
        const parser = new xml2js.Parser({ explicitArray: false });
        parser.parseString(xml, function (err, result) {
            const obj = JSON.parse(JSON.stringify(result), reviver);
            response = obj["Scr"];
        });
        return response;
    }
}

export class TransactionResult {
    AC: string;
    AP: number;
    CN: string;
    CT: string;
    CH: string;
    DT: string;
    DT_TZ: string;
    DS: string;
    DS_TZ: string;
    PIX: string;
    RID: string;
    RRN: string;
    ST: string;
    TR: string;
    DBID: string;
    RC: string;
    RT: string;
    RTT: number;
    AmtA: number;
}