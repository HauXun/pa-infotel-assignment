import { Module } from '@nestjs/common';
import { XmlService as XmlServiceWithLib } from 'src/xml/lib-xml.service';
import { XmlService } from 'src/xml/xml.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [],
  providers: [XmlService, XmlServiceWithLib],
  controllers: [BookingController],
})
export class BookingModule {}
