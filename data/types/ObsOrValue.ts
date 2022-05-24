import { Observable } from "rxjs"

export type ObsOrValue<Type> = Observable<Type> | Type
