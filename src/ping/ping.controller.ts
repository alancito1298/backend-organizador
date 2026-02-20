import { Controller, Get } from '@nestjs/common';

<<<<<<< HEAD

@Controller()
=======
@Controller('auth')
>>>>>>> bf5b756 (reconfiguracion del proyecto)
export class PingController {
    @Get('ping')
    ping(){
        return 'ok'
    }
}
