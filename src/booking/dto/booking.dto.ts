import { ApiProperty } from '@nestjs/swagger';

export class BookingDto {
  @ApiProperty()
  confirmation_no: string;

  @ApiProperty()
  resv_name_id: string;

  @ApiProperty()
  arrival: string;

  @ApiProperty()
  departure: string;

  @ApiProperty()
  adults: number;

  @ApiProperty()
  children: number;

  @ApiProperty()
  roomtype: string;

  @ApiProperty()
  ratecode: string;

  @ApiProperty()
  rateamount: {
    amount: number;
    currency: string;
  };

  @ApiProperty()
  guarantee: string;

  @ApiProperty()
  method_payment: string;

  @ApiProperty()
  computed_resv_status: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  booking_balance: number;

  @ApiProperty()
  booking_created_date: string;
}
