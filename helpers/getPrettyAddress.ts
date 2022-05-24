import { Address } from "@/helper_types/AddressType"

const getPrettyAddress = (addressObj: Address) => {
  return `${addressObj.street}, ${addressObj.city}, ${addressObj.state} ${addressObj.zip}`
}
