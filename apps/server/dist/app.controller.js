"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
let AppController = class AppController {
    constructor(appService, configService) {
        this.appService = appService;
        this.configService = configService;
    }
    getHello() {
        return this.appService.getHello();
    }
    forRobot() {
        return 'User-agent:  *\nDisallow:  /';
    }
    getFavicon(res) {
        const imgContent = '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';
        const imgBuffer = Buffer.from(imgContent, 'base64');
        res.setHeader('Content-Type', 'image/png');
        res.send(imgBuffer);
    }
    dashRender() {
        const { originUrl: weweRssServerOriginUrl } = this.configService.get('feed');
        const { code } = this.configService.get('auth');
        return {
            weweRssServerOriginUrl,
            enabledAuthCode: !!code,
            iconUrl: weweRssServerOriginUrl
                ? `${weweRssServerOriginUrl}/favicon.ico`
                : 'https://r2-assets.111965.xyz/wewe-rss.png',
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('/robots.txt'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "forRobot", null);
__decorate([
    (0, common_1.Get)('favicon.ico'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getFavicon", null);
__decorate([
    (0, common_1.Get)('/dash*'),
    (0, common_1.Render)('index.hbs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "dashRender", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        config_1.ConfigService])
], AppController);
//# sourceMappingURL=app.controller.js.map