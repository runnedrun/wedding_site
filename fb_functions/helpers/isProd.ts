import * as functions from "firebase-functions"
export const isProd = () => functions.config()?.other?.env === "production"
