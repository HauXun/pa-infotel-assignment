import { HttpService } from '@nestjs/axios';
import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'node:crypto';
import { lastValueFrom } from 'rxjs';

type PaymentMethodCode =
  | 'QRCODE'
  | 'IB-ONLINE'
  | 'ATM-CARD'
  | 'CREDIT-CARD'
  | 'WALLET';

const AMOUNT = 9831780; // random number

@Injectable({ scope: Scope.DEFAULT })
export class PaymentService {
  private readonly VIETCOMBANK_PAYMENT_URL: string;
  private readonly merchant_site_code: string;
  private readonly merchant_passcode: string;
  private readonly return_url: string;
  private readonly cancel_url: string;
  private readonly notify_url: string;
  private static token_code: string;
  private static order_code: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.VIETCOMBANK_PAYMENT_URL =
      this.configService.get<string>('VIETCOMBANK_PAYMENT_URL_SANDBOX') ||
      this.configService.get<string>('VIETCOMBANK_PAYMENT_URL');
    this.merchant_site_code =
      this.configService.get<string>('MERCHANT_SITE_CODE');
    this.merchant_passcode =
      this.configService.get<string>('MERCHANT_PASSCODE');
    this.return_url = this.configService.get<string>('RETURN_URL');
    this.cancel_url = this.configService.get<string>('CANCEL_URL');
    this.notify_url = this.configService.get<string>('NOTIFY_URL');
  }

  async createPayment(
    confirmation_no: string,
  ): Promise<{ checkout_url: string; token_code: string }> {
    const order_code = confirmation_no;
    const order_description = 'Payment for booking';
    const amount = AMOUNT;
    const currency = 'VND';
    const buyer_fullname = 'NGUYEN VAN A';
    const buyer_email = 'vcb-test@yopmail.com';
    const buyer_mobile = '1234567890';
    const buyer_address = 'HCM';
    const language = 'vi';
    const version = '1.0';
    const payment_method_code: PaymentMethodCode = 'ATM-CARD';
    const bank_code = '';

    const checksumStr = `${this.merchant_site_code}|${order_code}|${order_description}|${AMOUNT}|${currency}|${buyer_fullname}|${buyer_email}|${buyer_mobile}|${buyer_address}|${this.return_url}|${this.cancel_url}|${this.notify_url}|vi|${this.merchant_passcode}`;
    const checksum = createHash('md5').update(checksumStr).digest('hex');

    const response = await lastValueFrom(
      this.httpService.post(
        this.VIETCOMBANK_PAYMENT_URL,
        {
          function: 'CreateOrder',
          merchant_site_code: this.merchant_site_code,
          order_code,
          order_description,
          amount,
          currency,
          buyer_fullname,
          buyer_email,
          buyer_mobile,
          buyer_address,
          return_url: this.return_url,
          cancel_url: this.cancel_url,
          notify_url: this.notify_url,
          language,
          version,
          payment_method_code,
          bank_code,
          checksum,
        },
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      ),
    );

    if (response.data.result_code === '0000') {
      // need a solution to save token_code and order_code to handle payment notification (recommend using message queue), now i use static for testing
      PaymentService.token_code = response.data.result_data.token_code;
      PaymentService.order_code = confirmation_no;
      return response.data.result_data;
    } else {
      throw new Error('Failed to create payment');
    }
  }

  async handlePaymentNotification(token_code_order?: string): Promise<any> {
    const token_code = token_code_order || PaymentService.token_code;

    const checksumStr = [
      this.merchant_site_code,
      token_code,
      this.merchant_passcode,
    ].join('|');

    const checksum = createHash('md5').update(checksumStr).digest('hex');

    const response = await lastValueFrom(
      this.httpService.post(
        this.VIETCOMBANK_PAYMENT_URL,
        {
          function: 'CheckOrder',
          merchant_site_code: this.merchant_site_code,
          token_code,
          checksum,
        },
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      ),
    );

    if (response.data.result_code === '0000') {
      return response.data;
    } else {
      throw new Error('Failed to check order');
    }
  }

  async handlePaymentBankcode(): Promise<any> {
    const checksumStr = [this.merchant_site_code, this.merchant_passcode].join(
      '|',
    );

    const checksum = createHash('md5').update(checksumStr).digest('hex');

    const response = await lastValueFrom(
      this.httpService.post(
        this.VIETCOMBANK_PAYMENT_URL,
        {
          function: 'GetBanks',
          merchant_site_code: this.merchant_site_code,
          checksum,
        },
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      ),
    );

    if (response.data.result_code === '0000') {
      return response.data;
    } else {
      throw new Error('Failed to check order');
    }
  }

  getPaymentFail(): string {
    return 'Payment has been failed!';
  }
}
