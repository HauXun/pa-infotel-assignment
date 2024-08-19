import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import * as fs from 'fs';
import { BookingDto } from 'src/booking/dto/booking.dto';

@Injectable()
export class XmlService {
  // Using fast-xml-parser to parse XML
  async parseXmlFileWithLibrary(filePath: string): Promise<any> {
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    const stringOptions = ['S:Envelope', 'S:Body', 'w:body2'];
    const options = {
      ignoreAttributes: false,
      isArray: (tagName) => {
        if (stringOptions.includes(tagName)) return true;
      },
    };
    const parser = new XMLParser(options);
    const jObj = parser.parse(xmlData);

    return jObj;
  }

  // Extract data to the required JSON structure
  extractBookingData(xmlJson: any): any {
    const hotelReservation =
      xmlJson['soap:Envelope']['soap:Body']['FetchBookingResponse'][
        'HotelReservation'
      ];
    const roomStay = hotelReservation['r:RoomStays']['hc:RoomStay'];
    const resGuest = hotelReservation['r:ResGuests']['r:ResGuest'];
    const uniqueIdList = hotelReservation['r:UniqueIDList']['c:UniqueID'];
    const roomRates =
      roomStay['hc:RoomRates']['hc:RoomRate']['hc:Rates']['hc:Rate']['hc:Base'];
    const guestCounts = roomStay['hc:GuestCounts']['hc:GuestCount'];
    const reservationPayments =
      hotelReservation['r:ReservationPayments']['r:ReservationPaymentInfo'];
    const reservationHistory = hotelReservation['r:ReservationHistory'];

    const customer = Array.isArray(resGuest['r:Profiles']['Profile'])
      ? resGuest['r:Profiles']['Profile'][0]?.['Customer']
      : resGuest['r:Profiles']['Profile']['Customer'];

    // Extracting basic information from the XML structure
    const bookingDto: BookingDto = {
      confirmation_no: Array.from(uniqueIdList).find(
        (uid: any) => uid['@_type'] === 'INTERNAL',
      )['#text'],
      resv_name_id: Array.from(uniqueIdList).find(
        (uid: any) =>
          uid['@_type'] === 'INTERNAL' && uid['@_source'] === 'RESVID',
      )['#text'],
      arrival: roomStay['hc:TimeSpan']['hc:StartDate']['#text'],
      departure: roomStay['hc:TimeSpan']['hc:EndDate']['#text'],
      adults: (
        Array.from(guestCounts).find(
          (gc: any) => gc['@_ageQualifyingCode'] === 'ADULT',
        ) as any
      )['@_count'],
      children:
        (
          Array.from(guestCounts).find(
            (gc: any) => gc['@_ageQualifyingCode'] === 'CHILD',
          ) as any
        )['@_count'] || 0,
      roomtype:
        roomStay['hc:RoomTypes']['hc:RoomType']?.['@_roomTypeCode'] ?? '',
      ratecode:
        roomStay['hc:RatePlans']['hc:RatePlan']?.['@_ratePlanCode'] ?? '',
      rateamount: {
        amount: parseInt(roomRates['#text']),
        currency: roomRates['@_currencyCode'],
      },
      guarantee: roomStay['hc:Guarantee'].guaranteeType,
      method_payment: reservationPayments.PaymentType,
      computed_resv_status: hotelReservation.reservationStatus,
      last_name: customer['PersonName']['c:lastName'] ?? '',
      first_name: customer['PersonName']['c:firstName'] ?? '',
      title: customer['PersonName']['c:nameTitle'] ?? '',
      phone_number: '+84123456789',
      email: 'test@email.com',
      booking_balance: parseInt(roomStay['hc:CurrentBalance']['#text']),
      booking_created_date: reservationHistory.insertDate,
    };

    return bookingDto;
  }
}
