// Sample mock data for frontend testing

export const products = [
  { id:101, key:"elden-ring", name:"Elden Ring", developer:"FromSoftware", price:"59.99", image:"/img/elden-ring.jpg", description:"Open-world action RPG.", esrb_rating:"M" },
  { id:102, key:"hades", name:"Hades", developer:"Supergiant Games", price:"24.99", image:"/img/hades.jpg", description:"Roguelike dungeon crawler.", esrb_rating:"T" },
  { id:103, key:"cyberpunk-2077", name:"Cyberpunk 2077", developer:"CD PROJEKT RED", price:"49.99", image:"/img/cp2077.jpg", description:"Futuristic open-world RPG.", esrb_rating:"M" },
  { id:104, key:"stardew-valley", name:"Stardew Valley", developer:"ConcernedApe", price:"14.99", image:"/img/stardew.jpg", description:"Farming/life sim.", esrb_rating:"E10+" },
  { id:105, key:"valorant", name:"VALORANT", developer:"Riot Games", price:"0.00", image:"/img/valorant.jpg", description:"Tactical shooter.", esrb_rating:"T" },
  { id:106, key:"baldurs-gate-3", name:"Baldur's Gate 3", developer:"Larian Studios", price:"69.99", image:"/img/bg3.jpg", description:"CRPG based on D&D 5e.", esrb_rating:"M" },
  { id:107, key:"minecraft", name:"Minecraft", developer:"Mojang", price:"29.99", image:"/img/minecraft.jpg", description:"Sandbox building game.", esrb_rating:"E10+" },
  { id:108, key:"god-of-war", name:"God of War (2018)", developer:"SIE Santa Monica", price:"39.99", image:"/img/gow.jpg", description:"Story-driven action adventure.", esrb_rating:"M" },
];

export const accounts = [
  { id:201, username:"ayaan", password:"dev-only", age:21, email:"ayaan@example.com" },
  { id:202, username:"ryan", password:"dev-only", age:21, email:"mansi@example.com" },
];

export const wishlist = [
  { id:401, user_id:201, product_id:106, date_added:"2025-10-19", rank:1 },
  { id:402, user_id:202, product_id:104, date_added:"2025-10-19", rank:1 },
];

export const purchases = [
  { id:501, user_id:201, product_id:101, purchase_date:"2025-10-19", price_paid:"59.99" },
  { id:502, user_id:202, product_id:104, purchase_date:"2025-10-19", price_paid:"39.99" },
];
