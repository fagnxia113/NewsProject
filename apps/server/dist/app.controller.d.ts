import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Response as Res } from 'express';
export declare class AppController {
    private readonly appService;
    private readonly configService;
    constructor(appService: AppService, configService: ConfigService);
    getHello(): string;
    forRobot(): string;
    getFavicon(res: Res): void;
    dashRender(): {
        weweRssServerOriginUrl: string;
        enabledAuthCode: boolean;
        iconUrl: string;
    };
}
