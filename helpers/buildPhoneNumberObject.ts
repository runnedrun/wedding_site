import parsePhoneNumberFromString, {
  isPossiblePhoneNumber,
} from "libphonenumber-js"
import { PhoneNumber } from "../helper_types/PhoneNumberType"

export const buildPhoneNumberObject = (phoneNumber: string): PhoneNumber => {
  const isValid = isPossiblePhoneNumber(phoneNumber, "US")
  if (!isValid) {
    return null
  }
  const parsed = parsePhoneNumberFromString(phoneNumber, "US")
  return {
    raw: phoneNumber,
    number: String(parsed.nationalNumber),
    countryCode: String(parsed.countryCallingCode),
  }
}
