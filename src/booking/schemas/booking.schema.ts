import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

type RateAmount = {
  amount: number;
  currency: string;
};

@Schema()
export class Booking extends Document {
  @Prop()
  confirmation_no: string;

  @Prop()
  resv_name_id: string;

  @Prop()
  arrival: string;

  @Prop()
  departure: string;

  @Prop()
  adults: number;

  @Prop()
  children: number;

  @Prop()
  roomtype: string;

  @Prop()
  ratecode: string;

  @Prop({ type: 'object' })
  rateamount: RateAmount;

  @Prop()
  guarantee: string;

  @Prop()
  method_payment: string;

  @Prop()
  computed_resv_status: string;

  @Prop()
  last_name: string;

  @Prop()
  first_name: string;

  @Prop()
  title: string;

  @Prop()
  phone_number: string;

  @Prop()
  email: string;

  @Prop()
  booking_balance: number;

  @Prop()
  booking_created_date: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
