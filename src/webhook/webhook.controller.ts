import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Public()
  @Post('mercadopago')
  @HttpCode(200)
  async handleWebhook(
    @Body() body: any,
    @Headers('x-signature') signature: string,
  ) {
    return this.webhookService.procesarNotificacion(body);
  }
}