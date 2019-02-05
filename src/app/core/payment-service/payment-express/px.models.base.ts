
export abstract class PxRequestBase {
    user: string;
    key: string;
    Station: string;
    TxnRef: string;
    readonly TxnType: string;

    constructor(txnType: string) {
        this.TxnType = txnType;
    }

    toXML(): string {
        var xml2js = require('xml2js');
        var builder = new xml2js.Builder({ headless: true, rootName: 'Scr' });

        let xmlobj = { ...(this as any) };  //fix TS2698 error
        xmlobj.$ = { action: "doScrHIT", user: this.user, key: this.key };
        delete xmlobj.user;
        delete xmlobj.key;

        return builder.buildObject(xmlobj);
    }
}

export abstract class PxTransactionRequestBase extends PxRequestBase {
    Amount: number;
    AmountCash: number;
    Cur: string;
    DeviceId: string;
    PosName: string;
    PosVersion: string;
    VendorId: string;
    MRef: string;

    constructor(txnType: string) {
        super(txnType);
    }
}