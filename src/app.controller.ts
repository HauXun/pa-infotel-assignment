import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';
import { PaymentService } from './payment/payment.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Default API' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('payment-success')
  @ApiTags('payment')
  @ApiOperation({ summary: 'Redirect API Success' })
  async paymentSuccess(@Res() res: Response) {
    return res.json(await this.paymentService.handlePaymentNotification());
  }

  @Get('payment-fail')
  @ApiTags('payment')
  @ApiOperation({ summary: 'Redirect API Failed' })
  paymentFail(): string {
    return this.paymentService.getPaymentFail();
  }
}
