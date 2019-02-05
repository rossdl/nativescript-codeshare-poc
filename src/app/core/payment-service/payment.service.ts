import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, timer, merge, concat } from 'rxjs';
import { tap, catchError, map, switchMap, skipWhile, takeWhile, take, share } from 'rxjs/operators';
import { PxStatusRequest, PxPurchaseRequest, PxTransactionResponse } from "./payment-express/px.models";
import { PxTransactionRequestBase, PxRequestBase } from "./payment-express/px.models.base";

// this is tightly coupled with Payment Express (Px) right now
// should later implement abstract class or interface & InjectionToken

@Injectable()
export class PaymentService { 
    private readonly user: string = "AmanoMcGannHIT_Dev";
    private readonly key: string = "f88db1b81f77c95c5306d70934eb4758";
    private readonly station: string = "4127161472";
    private readonly rootUrl: string = "https://uat.paymentexpress.com/pxmi3/pos.aspx";

    constructor(private http: HttpClient) { }

    sendPurchase(amount: number): Observable<PxTransactionResponse> {
        // start with purchase request
        const purchase = this.getPurchaseRequest(amount);
        const purchaseRequest$ = this.sendRequest(purchase);

        // wait 3 seconds then poll for status every 2 seconds until complete
        const notCompleted = (r: PxTransactionResponse): boolean => r.Complete !== 1;
        const status = this.getStatusRequest(purchase);
        const pollingStatus = timer(3000, 2000).pipe(switchMap(_ => this.sendRequest(status)), share());
        const statusInProgress = pollingStatus.pipe(takeWhile(notCompleted));
        const statusComplete = pollingStatus.pipe(skipWhile(notCompleted), take(1));
        const pollStatus$ = merge(statusInProgress, statusComplete);

        // do not start polling until purchase request is finished
        return concat(purchaseRequest$, pollStatus$);
    }

    private sendRequest(txn: PxRequestBase): Observable<PxTransactionResponse> {
        // https://github.com/angular/angular/issues/18586
        // FYI this does not compile:
        // const options = { headers: headers, responseType: 'text' }
        // return this.http.post(this.rootUrl, xml, options).pipe(

        const headers = new HttpHeaders();
        headers.append("Content-Type", "text/xml");
        headers.append("Accept", "text/xml");

        const xml = txn.toXML();
        console.log('>>> sendRequest');
        console.log(xml);

        return this.http.post(this.rootUrl, xml, { headers: headers, responseType: 'text' }).pipe(
            tap(result => { console.log('>>> RESPONSE'); console.log(result); }),
            map(xml => PxTransactionResponse.load(xml)),
            catchError(this.handleError('sendRequest', this.getCompletedResponse("ERROR")))
        ) as Observable<PxTransactionResponse>;
    }

    private getPurchaseRequest(amount: number): PxPurchaseRequest {
        const txn = new PxPurchaseRequest();
        this.setAuth(txn);
        txn.TxnRef = (new Date).toJSON().replace(/\D+/g, "").substr(4);
        txn.PosName = "AmiPocApp";
        txn.DeviceId = "AmiPocDevice";
        txn.VendorId = "AmiPocVender";
        txn.Cur = "USD";
        txn.Amount = amount;
        return txn;
    }

    private getStatusRequest(transactionRequest: PxTransactionRequestBase): PxStatusRequest {
        const statusRequest = new PxStatusRequest();
        this.setAuth(statusRequest );
        statusRequest.TxnRef = transactionRequest.TxnRef;
        return statusRequest;
    }

    private getCompletedResponse(DL1: string): PxTransactionResponse {
        const response = new PxTransactionResponse();
        response.Complete = 1;
        response.DL1 = DL1;
        response.DL2 = "";
        return response;
    }

    private setAuth(request: PxRequestBase) {
        request.user = this.user;
        request.key = this.key;
        request.Station = this.station;
    }

    private get<T>(api: string): Promise<T> {
        return this.get$<T>(api).toPromise();
    }

    private get$<T>(api: string): Observable<T> {
        const url = `${this.rootUrl}${api}`;
        return this.http.get<T>(url).pipe(tap(result => console.log('http.get', url, result)));
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
       
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
       
          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);
       
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
}