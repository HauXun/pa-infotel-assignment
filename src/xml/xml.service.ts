import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { BookingDto } from 'src/booking/dto/booking.dto';

@Injectable()
export class XmlService {
  // Recursive XML to JSON converter
  parseXmlNode(xmlNode): any {
    let result = {};
    if (xmlNode.nodeType === 1) {
      // Element node
      if (xmlNode.attributes.length > 0) {
        result['@attributes'] = {};
        for (let j = 0; j < xmlNode.attributes.length; j++) {
          const attribute = xmlNode.attributes.item(j);
          result['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xmlNode.nodeType === 3) {
      // Text node
      result = xmlNode.nodeValue;
    }
    if (xmlNode.hasChildNodes()) {
      for (let i = 0; i < xmlNode.childNodes.length; i++) {
        const item = xmlNode.childNodes.item(i);
        const nodeName = item.nodeName;
        if (typeof result[nodeName] === 'undefined') {
          result[nodeName] = this.parseXmlNode(item);
        } else {
          if (typeof result[nodeName].push === 'undefined') {
            const old = result[nodeName];
            result[nodeName] = [];
            result[nodeName].push(old);
          }
          result[nodeName].push(this.parseXmlNode(item));
        }
      }
    }
    return result;
  }

  async parseXmlFile(filePath: string): Promise<any> {
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const DOMParser = require('xmldom').DOMParser;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
    return this.parseXmlNode(xmlDoc.documentElement);
  }

  // Extract data to the required JSON structure
  extractBookingData(xmlJson: any): any {
    const hotelReservation =
      xmlJson['soap:Body']['FetchBookingResponse']['HotelReservation'];
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
        (uid: any) => uid['@attributes'].type === 'INTERNAL',
      )['#text'],
      resv_name_id: Array.from(uniqueIdList).find(
        (uid) =>
          uid['@attributes'].type === 'INTERNAL' &&
          uid['@attributes'].source === 'RESVID',
      )['#text'],
      arrival: roomStay['hc:TimeSpan']['hc:StartDate']['#text'],
      departure: roomStay['hc:TimeSpan']['hc:EndDate']['#text'],
      adults: Array.from(guestCounts).find(
        (gc: any) => gc['@attributes'].ageQualifyingCode === 'ADULT',
      )['@attributes'].count,
      children:
        Array.from(guestCounts).find(
          (gc: any) => gc['@attributes'].ageQualifyingCode === 'CHILD',
        )['@attributes'].count || 0,
      roomtype:
        roomStay['hc:RoomTypes']['hc:RoomType']['@attributes']?.roomTypeCode ??
        '',
      ratecode:
        roomStay['hc:RatePlans']['hc:RatePlan']['@attributes']?.ratePlanCode ??
        '',
      rateamount: {
        amount: parseInt(roomRates['#text']),
        currency: roomRates['@attributes'].currencyCode,
      },
      guarantee: roomStay['hc:Guarantee']['@attributes'].guaranteeType,
      method_payment: reservationPayments['@attributes'].PaymentType,
      computed_resv_status: hotelReservation['@attributes'].reservationStatus,
      last_name: customer['PersonName']['c:lastName']?.['#text'] ?? '',
      first_name: customer['PersonName']['c:firstName']?.['#text'] ?? '',
      title: customer['PersonName']['c:nameTitle']?.['#text'] ?? '',
      phone_number: '+84123456789',
      email: 'test@email.com',
      booking_balance: parseInt(roomStay['hc:CurrentBalance']['#text']),
      booking_created_date: reservationHistory['@attributes'].insertDate,
    };

    return bookingDto;
  }
}
