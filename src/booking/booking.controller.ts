import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import { XmlService as XmlServiceWithLib } from 'src/xml/lib-xml.service';
import { XmlService } from 'src/xml/xml.service';

@ApiTags('booking')
@Controller('booking')
@UseGuards(AuthGuard('jwt'))
export class BookingController {
  constructor(
    private readonly xmlService: XmlService,
    private readonly xmlServiceWithLib: XmlServiceWithLib,
  ) {}

  @Get(':confirmation_no')
  @ApiOperation({ summary: 'Booking Converter' })
  async getBooking(@Param('confirmation_no') confirmation_no: string) {
    const fileName = `booking_${confirmation_no}.xml`;
    const filePath = path.join(
      __dirname.split('dist')[0],
      'src',
      'xml-files',
      `${fileName}`,
    );
    const xmlJson =
      // await this.xmlServiceWithLib.parseXmlFileWithLibrary(filePath);
      await this.xmlService.parseXmlFile(filePath);
    const bookingData = this.xmlService.extractBookingData(xmlJson);
    return bookingData;
  }
}
