import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class PingController {
    @Get('ping')
    ping(){
        return 'ok'
    }
}
