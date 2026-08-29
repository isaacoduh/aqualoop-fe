import type { Address } from "@/domain/types";

export const addresses: Address[] = [
  { id:"addr_usr_001_home", ownerId:"usr_001", label:"HOME", line1:"14 Admiralty Way", line2:"Lekki Phase 1", city:"Lagos", state:"Lagos", country:"NG", coordinates:{lat:6.4439,lng:3.4700}, isDefault:true },
  { id:"addr_usr_001_work", ownerId:"usr_001", label:"WORK", line1:"22 Ozumba Mbadiwe Avenue", city:"Victoria Island", state:"Lagos", country:"NG", coordinates:{lat:6.4285,lng:3.4218}, isDefault:false },
  { id:"addr_usr_002_home", ownerId:"usr_002", label:"HOME", line1:"8 Fola Osibo Street", city:"Lekki", state:"Lagos", country:"NG", coordinates:{lat:6.4389,lng:3.4726}, isDefault:true },
  { id:"addr_biz_001", ownerId:"biz_001", label:"BUSINESS", line1:"12 Akin Adesola Street", city:"Victoria Island", state:"Lagos", country:"NG", coordinates:{lat:6.4281,lng:3.4219}, isDefault:true },
  { id:"addr_biz_002", ownerId:"biz_002", label:"BUSINESS", line1:"31 Providence Street", city:"Lekki", state:"Lagos", country:"NG", coordinates:{lat:6.4356,lng:3.4551}, isDefault:true },
  { id:"addr_biz_003", ownerId:"biz_003", label:"BUSINESS", line1:"5 Bisola Durosinmi Etti Drive", city:"Lekki", state:"Lagos", country:"NG", coordinates:{lat:6.4473,lng:3.4724}, isDefault:true },
  { id:"addr_biz_004", ownerId:"biz_004", label:"BUSINESS", line1:"18 Chevron Drive", city:"Lekki", state:"Lagos", country:"NG", coordinates:{lat:6.4698,lng:3.5852}, isDefault:true }
];
