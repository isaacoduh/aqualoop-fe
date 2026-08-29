import type { Business } from "@/domain/types";

export const businesses: Business[] = [
  {
    id:"biz_001", operatorId:"op_001", name:"BlueSpring Refill Hub", slug:"bluespring-refill-hub",
    description:"Purified drinking water refills and reusable bottle exchange for homes and offices.",
    phone:"+2348012341101", email:"orders@bluespring.example.test", status:"ACTIVE", isOpen:true,
    rating:4.8, reviewCount:184, fulfilmentModes:["DELIVERY","PICKUP"], deliveryRadiusKm:8, minimumOrder:2500,
    addressId:"addr_biz_001", coordinates:{lat:6.4281,lng:3.4219},
    openingHours:{monday:["08:00","20:00"],tuesday:["08:00","20:00"],wednesday:["08:00","20:00"],thursday:["08:00","20:00"],friday:["08:00","21:00"],saturday:["09:00","21:00"],sunday:["10:00","18:00"]},
    heroImageUrl:"/images/businesses/bluespring-hero.jpg", logoUrl:"/images/businesses/bluespring-logo.png", createdAt:"2026-03-11T10:00:00Z"
  },
  {
    id:"biz_002", operatorId:"op_002", name:"PureDrop Water House", slug:"puredrop-water-house",
    description:"Residential and office purified-water refill service with scheduled delivery.",
    phone:"+2348012341102", email:"hello@puredrop.example.test", status:"ACTIVE", isOpen:true,
    rating:4.6, reviewCount:96, fulfilmentModes:["DELIVERY","PICKUP"], deliveryRadiusKm:12, minimumOrder:3000,
    addressId:"addr_biz_002", coordinates:{lat:6.4356,lng:3.4551},
    openingHours:{monday:["07:30","19:30"],tuesday:["07:30","19:30"],wednesday:["07:30","19:30"],thursday:["07:30","19:30"],friday:["07:30","20:00"],saturday:["08:00","20:00"],sunday:["09:00","17:00"]},
    heroImageUrl:"/images/businesses/puredrop-hero.jpg", logoUrl:"/images/businesses/puredrop-logo.png", createdAt:"2026-03-13T10:00:00Z"
  },
  {
    id:"biz_003", operatorId:"op_003", name:"Oasis Bottle Exchange", slug:"oasis-bottle-exchange",
    description:"Fast reusable bottle swaps for nearby households and small businesses.",
    phone:"+2348012341103", email:"support@oasis.example.test", status:"ACTIVE", isOpen:false,
    rating:4.9, reviewCount:231, fulfilmentModes:["PICKUP"], deliveryRadiusKm:0, minimumOrder:2000,
    addressId:"addr_biz_003", coordinates:{lat:6.4473,lng:3.4724},
    openingHours:{monday:["08:00","18:00"],tuesday:["08:00","18:00"],wednesday:["08:00","18:00"],thursday:["08:00","18:00"],friday:["08:00","18:00"],saturday:["09:00","17:00"],sunday:null},
    heroImageUrl:"/images/businesses/oasis-hero.jpg", logoUrl:"/images/businesses/oasis-logo.png", createdAt:"2026-04-02T10:00:00Z"
  },
  {
    id:"biz_004", operatorId:"op_004", name:"ClearFlow Water Market", slug:"clearflow-water-market",
    description:"Purified water for homes, offices and hospitality businesses.",
    phone:"+2348012341104", email:"team@clearflow.example.test", status:"PENDING_VERIFICATION", isOpen:false,
    rating:0, reviewCount:0, fulfilmentModes:["DELIVERY","PICKUP"], deliveryRadiusKm:15, minimumOrder:5000,
    addressId:"addr_biz_004", coordinates:{lat:6.4698,lng:3.5852},
    openingHours:{monday:["08:00","20:00"],tuesday:["08:00","20:00"],wednesday:["08:00","20:00"],thursday:["08:00","20:00"],friday:["08:00","20:00"],saturday:["09:00","18:00"],sunday:null},
    heroImageUrl:"/images/businesses/clearflow-hero.jpg", logoUrl:"/images/businesses/clearflow-logo.png", createdAt:"2026-08-20T10:00:00Z"
  }
];
