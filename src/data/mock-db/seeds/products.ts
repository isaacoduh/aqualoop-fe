import type { Product, BusinessProduct } from "@/domain/types";

export const products: Product[] = [
  { id:"prod_10l_refill", name:"10L Purified Water Refill", slug:"10l-refill", sizeLitres:10, type:"REFILL", description:"Refill an existing 10L reusable bottle.", imageUrl:"/images/products/10l-refill.png", active:true },
  { id:"prod_15l_refill", name:"15L Purified Water Refill", slug:"15l-refill", sizeLitres:15, type:"REFILL", description:"Refill an existing 15L reusable bottle.", imageUrl:"/images/products/15l-refill.png", active:true },
  { id:"prod_20l_refill", name:"20L Purified Water Refill", slug:"20l-refill", sizeLitres:20, type:"REFILL", description:"Refill an existing 20L reusable bottle.", imageUrl:"/images/products/20l-refill.png", active:true },
  { id:"prod_10l_exchange", name:"10L Bottle Exchange", slug:"10l-exchange", sizeLitres:10, type:"BOTTLE_EXCHANGE", description:"Swap an empty 10L bottle for a filled reusable bottle.", imageUrl:"/images/products/10l-exchange.png", active:true },
  { id:"prod_20l_exchange", name:"20L Bottle Exchange", slug:"20l-exchange", sizeLitres:20, type:"BOTTLE_EXCHANGE", description:"Swap an empty 20L bottle for a filled reusable bottle.", imageUrl:"/images/products/20l-exchange.png", active:true }
];

export const businessProducts: BusinessProduct[] = [
  { id:"bp_001", businessId:"biz_001", productId:"prod_10l_refill", price:1600, depositAmount:0, active:true },
  { id:"bp_002", businessId:"biz_001", productId:"prod_15l_refill", price:2100, depositAmount:0, active:true },
  { id:"bp_003", businessId:"biz_001", productId:"prod_20l_refill", price:2400, depositAmount:0, active:true },
  { id:"bp_004", businessId:"biz_001", productId:"prod_10l_exchange", price:2800, depositAmount:1200, active:true },
  { id:"bp_005", businessId:"biz_001", productId:"prod_20l_exchange", price:4200, depositAmount:2000, active:true },

  { id:"bp_006", businessId:"biz_002", productId:"prod_10l_refill", price:1700, depositAmount:0, active:true },
  { id:"bp_007", businessId:"biz_002", productId:"prod_20l_refill", price:2500, depositAmount:0, active:true },
  { id:"bp_008", businessId:"biz_002", productId:"prod_20l_exchange", price:4300, depositAmount:2000, active:true },

  { id:"bp_009", businessId:"biz_003", productId:"prod_10l_exchange", price:2700, depositAmount:1000, active:true },
  { id:"bp_010", businessId:"biz_003", productId:"prod_20l_exchange", price:4100, depositAmount:1800, active:true },

  { id:"bp_011", businessId:"biz_004", productId:"prod_10l_refill", price:1650, depositAmount:0, active:true },
  { id:"bp_012", businessId:"biz_004", productId:"prod_20l_refill", price:2450, depositAmount:0, active:true }
];
