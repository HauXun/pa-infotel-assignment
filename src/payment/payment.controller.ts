import { Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaymentService } from './payment.service';
import { RedirectService } from './redirect.service';

@ApiTags('payment')
@Controller('payment')
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':confirmation_no')
  @ApiOperation({ summary: 'Vietcombank Create Payment' })
  @ApiBody({ schema: { type: 'string' } })
  async makePayment(
    @Param('confirmation_no') confirmation_no: string,
    @Res() res: Response,
  ) {
    try {
      const { checkout_url } =
        await this.paymentService.createPayment(confirmation_no);

      RedirectService.redirect(checkout_url);
      return;
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Payment failed', error: error.message });
    }
  }

  @Post('check-order/:token_code')
  @ApiOperation({ summary: 'Vietcombank Check Order Payment' })
  @ApiBody({ schema: { type: 'string' } })
  async checkOrder(
    @Param('token_code') token_code: string,
    @Res() res: Response,
  ) {
    return res.json(
      await this.paymentService.handlePaymentNotification(token_code),
    );
  }

  @ApiOperation({ summary: 'Banking Check Payment bank-code' })
  @Post('/check-bankcode/all')
  async checkBankcode(@Res() res: Response) {
    return res.json(await this.paymentService.handlePaymentBankcode());
  }
}
