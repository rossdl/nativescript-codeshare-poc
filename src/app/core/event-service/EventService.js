"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("tns-core-modules/http");
var EventService = /** @class */ (function () {
    function EventService() {
        this.rootUrl = "http://192.168.125.59/OPUsite/EPServer/Api/SiteConfigEvents/";
    }
    EventService.prototype.getEvents = function () {
        console.log('get-events');
        return this.get("SiteEvents");
    };
    EventService.prototype.getEventRates = function () {
        console.log('get-event-rates');
        return Promise.all([this.get("EventRates"), this.get("SiteRates")]);
    };
    EventService.prototype.get = function (api) {
        return http_1.getJSON("" + this.rootUrl + api);
    };
    EventService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], EventService);
    return EventService;
}());
exports.EventService = EventService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRXZlbnRTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLDhDQUFnRDtBQUloRDtJQUdJO1FBRmlCLFlBQU8sR0FBVyw4REFBOEQsQ0FBQTtJQUVqRixDQUFDO0lBRWpCLGdDQUFTLEdBQVQ7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsb0NBQWEsR0FBYjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMvQixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTywwQkFBRyxHQUFYLFVBQWUsR0FBVztRQUN0QixPQUFPLGNBQU8sQ0FBQyxLQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBSyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQWpCUSxZQUFZO1FBRHhCLGlCQUFVLEVBQUU7O09BQ0EsWUFBWSxDQWtCeEI7SUFBRCxtQkFBQztDQUFBLEFBbEJELElBa0JDO0FBbEJZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IGdldEpTT04gfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9odHRwXCI7XHJcbmltcG9ydCB7IFBhcmtpbmdFdmVudCB9IGZyb20gXCIuL0V2ZW50TW9kZWxzXCI7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBFdmVudFNlcnZpY2UgeyBcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcm9vdFVybDogc3RyaW5nID0gXCJodHRwOi8vMTkyLjE2OC4xMjUuNTkvT1BVc2l0ZS9FUFNlcnZlci9BcGkvU2l0ZUNvbmZpZ0V2ZW50cy9cIlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgZ2V0RXZlbnRzKCk6IFByb21pc2U8UGFya2luZ0V2ZW50W10+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZ2V0LWV2ZW50cycpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChcIlNpdGVFdmVudHNcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXZlbnRSYXRlcygpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXQtZXZlbnQtcmF0ZXMnKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3RoaXMuZ2V0KFwiRXZlbnRSYXRlc1wiKSwgdGhpcy5nZXQoXCJTaXRlUmF0ZXNcIildKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldDxUPihhcGk6IHN0cmluZyk6IFByb21pc2U8VD4ge1xyXG4gICAgICAgIHJldHVybiBnZXRKU09OKGAke3RoaXMucm9vdFVybH0ke2FwaX1gKTtcclxuICAgIH1cclxufSJdfQ==