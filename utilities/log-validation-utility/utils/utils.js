const path = require("path");
const _ = require("lodash");
const rootPath = path.dirname(process.mainModule.filename);
const constants = require("./constants");

const retailAPI = [
  "search",
  "on_search",
  "select",
  "on_select",
  "init",
  "on_init",
  "confirm",
  "on_confirm",
  "status",
  "on_status",
  "track",
  "on_track",
  "cancel",
  "on_cancel",
  "update",
  "on_update",
  "support",
  "on_support",
];

const retailSttlmntPhase = ["sale-amount", "withholding-amount", "refund"];

const retailSttlmntCntrprty = [
  "buyer",
  "buyer-app",
  "seller-app",
  "logistics-provider",
];

const getDecimalPrecision = (numberString) => {
  const parts = numberString.trim().split(".");
  if (parts.length === 2) {
    return parts[1].length;
  } else {
    return 0;
  }
};

const checkGpsPrecision = (coordinates) => {
  const [lat, long] = coordinates.split(",");
  const latPrecision = getDecimalPrecision(lat);
  const longPrecision = getDecimalPrecision(long);
  const decimalPrecision = constants.DECIMAL_PRECISION;

  if (latPrecision >= decimalPrecision && longPrecision >= decimalPrecision) {
    return 1;
  } else return 0;
};

const retailPymntTtl = {
  "delivery charges": "delivery",
  "packing charges": "packing",
  tax: "tax",
  discount: "discount",
  "convenience fee": "misc",
};

const retailPaymentType = [
  "ON-ORDER",
  "PRE-FULFILLMENT",
  "ON-FULFILLMENT",
  "POST-FULFILLMENT",
];
const retailFulfillmentState = [
  //pre-order fulfillment states
  "Serviceable",
  "Non-serviceable",
  //post-order fulfillment states
  "Pending",
  "Packed",
  "Order-picked-up",
  "Out-for-delivery",
  "Order-delivered",
  "RTO-Initiated",
  "RTO-Delivered",
  "RTO-Disposed",
  "Cancelled",
];

const retailOrderState = [
  "Created",
  "Accepted",
  "In-progress",
  "Completed",
  "Cancelled",
];

const logFulfillmentState = [
  "Pending",
  "Searching-for-Agent",
  "Agent-assigned",
  "Order-picked-up",
  "Out-for-delivery",
  "Order-delivered",
  "RTO-Initiated",
  "RTO-Delivered",
  "RTO-Disposed",
  "Cancelled",
];

const logOrderState = [
  "Created",
  "Accepted",
  "In-progress",
  "Completed",
  "Cancelled",
];

const groceryCategories = [
  "Fruits and Vegetables",
  "Masala & Seasoning",
  "Oil & Ghee",
  "Gourmet & World Foods",
  "Foodgrains",
  "Eggs, Meat & Fish",
  "Cleaning & Household",
  "Beverages",
  "Beauty & Hygiene",
  "Bakery, Cakes & Dairy",
  "Kitchen Accessories",
  "Baby Care",
  "Snacks & Branded Foods",
  "Pet Care",
  "Stationery",
  "Packaged Commodities",
  "Packaged Foods",
];

const fnbCategories = [
  "Continental",
  "Middle Eastern",
  "North Indian",
  "Pan-Asian",
  "Regional Indian",
  "South Indian",
  "Tex-Mexican",
  "World Cuisines",
  "Healthy Food",
  "Fast Food",
  "Desserts",
  "Bakes & Cakes",
  "Beverages (MTO)",
];

const homeDecorCategories = [
  "Home Decor",
  "Home Furnishings",
  "Furniture",
  "Garden and Outdoor Products",
  "Home Improvement",
  "Cookware and Dining",
  "Storage and Organisation",
];

const pharmaCategories = [
  "Pain Relieving Ointments",
  "Nutrition and Supplements",
  "Personal and Baby Care",
  "Sexual Wellness",
  "Gastric and Other Concerns",
  "Covid Essentials",
  "Diabetes Control",
  "Health Devices",
];

const elctronicsCategories = [
  "Audio",
  "Camera and Camcorder",
  "Computer Peripheral",
  "Desktop and Laptop",
  "Earphone",
  "Gaming",
  "Headphone",
  "Mobile Phone",
  "Mobile Accessories",
  "Safety Security",
  "Smart Watches",
  "Speaker",
  "Television",
  "Video",
  "Air Conditioning and Air Cleaners",
  "Health, Home and Personal Care",
  "Heaters",
  "Kitchen Appliances",
  "Lighting & Electric Fans",
  "Refrigerators and Freezers",
  "Vacuum Cleaners",
  "Washing Machines and Accessories",
  "Water Purifiers and Coolers",
  "Inverter & Stabilizer",
];

const bpcCategories = [
  "Bath & Body",
  "Feminine Care",
  "Fragrance",
  "Hair Care",
  "Make Up",
  "Men's Grooming",
  "Oral Care",
  "Skin Care",
  "Maternity Care",
  "Nursing & Feeding",
  "Sexual Wellness & Sensuality",
  "Tools & Accessories",
];

const fashionCategories = [
  "Men's Fashion Accessories,Fashion",
  "Men's Footwear Accessories",
  "Men's Topwear",
  "Men's Bottomwear",
  "Men's Innerwear & Sleepwear",
  "Men's Bags & Luggage",
  "Men's Eyewear",
  "Men's Footwear",
  "Men's Jewellery",
  "Women's Fashion Accessories",
  "Women's Footwear Accessories",
  "Women's Indian & Fusion Wear",
  "Women's Western Wear",
  "Women's Lingerie & Sleepwear",
  "Women's Bags & Luggage",
  "Women's Eyewear",
  "Women's Footwear",
  "Women's Jewellery",
  "Boy's Clothing",
  "Boy's Footwear",
  "Girl's Clothing",
  "Girl's Footwear",
  "Infant's Wear",
  "Infant Care & Accessories",
  "Infant Feeding & Nursing Essentials",
  "Infant Bath Accessories",
  "Infant Health & Safety",
  "Infant Diapers & Toilet Training",
  "Kid's Towels & Wrappers",
  "Kid's Fashion Accessories",
  "Kid's Jewellery",
  "Kid's Eyewear",
  "Kid's Bags & Luggage",
];

const allCategories = [
  ...fnbCategories,
  ...groceryCategories,
  ...homeDecorCategories,
  ...pharmaCategories,
  ...elctronicsCategories,
  ...bpcCategories,
  ...fashionCategories,
];

const taxNotInlcusive = [...fnbCategories];

const buyerCancellationRid = new Set(["001", "003", "006", "009", "010"]);
const sellerCancellationRid = new Set([
  "002",
  "005",
  "011",
  "012",
  "013",
  "014",
  "015",
  "018",
  "019",
]);

const timestampCheck = (date) => {
  let dateParsed = new Date(Date.parse(date));
  if (!isNaN(dateParsed)) {
    if (dateParsed.toISOString() != date) {
      //FORMAT_ERR= Valid date but not in RFC 3339 format
      return { err: "FORMAT_ERR" };
    }
  } else {
    //INVLD_DT= Invalid date-time format
    return { err: "INVLD_DT" };
  }
};

const getObjValues = (obj) => {
  let values = "";
  Object.values(obj).forEach((value) => {
    values += `- ${value}\n`;
  });
  return values;
};

const isArrayEqual = (x, y) => {
  flag = _(x).xorWith(y, _.isEqual).isEmpty();
  return flag;
};

const countDecimalDigits = (num) => {
  return num.toString().split(".")[1].length;
};

const emailRegex = (email) => {
  const emailRE = /^\S+@\S+\.\S+$/;
  return emailRE.test(email);
};

const timeDiff = (time1, time2) => {
  const dtime1 = new Date(time1);
  const dtime2 = new Date(time2);

  if (isNaN(dtime1 - dtime2)) return 0;
  else return dtime1 - dtime2;
};


const isObjectEqual = (obj1, obj2, parentKey = "") => {
  const typeOfObj1 = typeof obj1;
  const typeOfObj2 = typeof obj2;

  if (typeOfObj1 !== typeOfObj2) {
    return [parentKey];
  }

  if (typeOfObj1 !== "object" || obj1 === null || obj2 === null) {
    return obj1 === obj2 ? [] : [parentKey];
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return [parentKey];
    }

    const sortedObj1 = [...obj1].sort();
    const sortedObj2 = [...obj2].sort();

    for (let i = 0; i < sortedObj1.length; i++) {
      const nestedKeys = isObjectEqual(sortedObj1[i], sortedObj2[i], `${parentKey}[${i}]`);
      if (nestedKeys.length > 0) {
        return nestedKeys;
      }
    }

    return [];
  }

  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  const allKeys = [...new Set([...obj1Keys, ...obj2Keys])];

  const notEqualKeys = [];

  for (let key of allKeys) {
    if (!obj2.hasOwnProperty(key) || !obj1.hasOwnProperty(key)) {
      notEqualKeys.push(parentKey ? `${parentKey}/${key}` : key);
      continue;
    }

    const nestedKeys = isObjectEqual(
      obj1[key],
      obj2[key],
      parentKey ? `${parentKey}/${key}` : key
    );

    if (nestedKeys.length > 0) {
      notEqualKeys.push(...nestedKeys);
    }
  }

  return notEqualKeys;
};

const isoDurToSec = (duration) => {
  let durRE =
    /P((\d+)Y)?((\d+)M)?((\d+)W)?((\d+)D)?T?((\d+)H)?((\d+)M)?((\d+)S)?/;

  const splitTime = durRE.exec(duration);
  if (!splitTime) {
    return 0;
  }

  const years = Number(splitTime?.[2]) || 0;
  const months = Number(splitTime?.[4]) || 0;
  const weeks = Number(splitTime?.[6]) || 0;
  const days = Number(splitTime?.[8]) || 0;
  const hours = Number(splitTime?.[10]) || 0;
  const minutes = Number(splitTime?.[12]) || 0;
  const seconds = Number(splitTime?.[14]) || 0;

  const result =
    years * 31536000 +
    months * 2628288 +
    weeks * 604800 +
    days * 86400 +
    hours * 3600 +
    minutes * 60 +
    seconds;

  return result;
};

const compareCoordinates = (coord1, coord2) => {
  // Remove all spaces from the coordinates
  const cleanCoord1 = coord1.replace(/\s/g, "");
  const cleanCoord2 = coord2.replace(/\s/g, "");

  // Compare the cleaned coordinates
  return cleanCoord1 === cleanCoord2;
};

module.exports = {
  timestampCheck,
  rootPath,
  retailAPI,
  retailFulfillmentState,
  retailOrderState,
  logFulfillmentState,
  logOrderState,
  buyerCancellationRid,
  sellerCancellationRid,
  getObjValues,
  retailPaymentType,
  retailPymntTtl,
  taxNotInlcusive,
  allCategories,
  isArrayEqual,
  countDecimalDigits,
  emailRegex,
  isoDurToSec,
  timeDiff,
  isObjectEqual,
  checkGpsPrecision,
  compareCoordinates,
};
