import parsePhoneNumber from "libphonenumber-js"
import { PhoneNumber } from "../helper_types/PhoneNumberType"

export const buildPhoneNumberString = (phoneNumber: PhoneNumber) => {
  return `+${phoneNumber.countryCode}${phoneNumber.number}`
}

export const buildPrettyPhoneNumber = (phoneNumber: PhoneNumber) => {
  return parsePhoneNumber(
    `+${phoneNumber.countryCode}${phoneNumber.number}`
  )?.formatNational()
}
