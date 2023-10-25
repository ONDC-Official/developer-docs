const path = require("path");
const _ = require("lodash");
const rootPath = path.dirname(process.mainModule.filename);

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

const taxNotInlcusive = ["F&B"];

const retailSttlmntPhase = ["sale-amount", "withholding-amount", "refund"];

const retailSttlmntCntrprty = [
  "buyer",
  "buyer-app",
  "seller-app",
  "logistics-provider",
];

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

const bpp_fulfillments = ["Delivery", "Pickup", "Delivery and Pickup"]; //id =1,2,3
const bpp_provider_days = [
  "1",
  "1,2",
  "1,2,3",
  "1,2,3,4",
  "1,2,3,4,5",
  "1,2,3,4,5,6",
  "1,2,3,4,5,6,7",
];
const categoriesMap = [
  {
    "Standard Delivery": [
      "Immediate Delivery",
      "Next Day Delivery",
      "Same Day Delivery",
    ],
  },
  { "Express Delivery": [] },
];
const grocery_categories_id = [
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

const fnb_categories_id = [
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
  "F&B",
];

const fssai_nos = [
  "brand_owner_FSSAI_license_no",
  "other_FSSAI_license_no",
  "importer_FSSAI_license_no",
];

const cancellation_rid = {
  "001": 0,
  "002": 0,
  "003": 0,
  "004": 0,
  "005": 0,
  "006": 0,
  "009": 1,
  "010": 1,
  "011": 1,
  "012": 1,
  "013": 1,
  "014": 1,
  "015": 1,
  "016": 0,
  "017": 0,
  "018": 0,
};

const uuidCheck = (data) => {
  console.log("***UUID Validation Utils***");
  let uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuid.test(data)) return false;
  return true;
};

const timestampCheck = (date) => {
  //console.log("***Timestamp Check Utils***");
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

const getVersion = (data) => {
  if (data?.search[0]?.context?.core_version === "1.1.0") return "v1.1";
  else return "v1.2";
};
function compareDates(dateString1, dateString2) {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  const year1 = date1.getUTCFullYear();
  const month1 = date1.getUTCMonth();
  const day1 = date1.getUTCDate();

  const year2 = date2.getUTCFullYear();
  const month2 = date2.getUTCMonth();
  const day2 = date2.getUTCDate();

  if (
    year1 > year2 ||
    (year1 === year2 && month1 > month2) ||
    (year1 === year2 && month1 === month2 && day1 > day2)
  ) {
    return true;
  } else if (
    year1 < year2 ||
    (year1 === year2 && month1 < month2) ||
    (year1 === year2 && month1 === month2 && day1 <= day2)
  ) {
    return false;
  }
}

const hasTwoOrLessDecimalPlaces = (inputString) => {
  const parts = inputString.split(".");

  if (parts.length === 2) {
    const decimalPart = parts[1];
    return decimalPart.length <= 2;
  } else {
    return true; // No decimal part, automatically satisfies the condition
  }
};

const getObjValues = (obj) => {
  let values = "";

  Object.values(obj).forEach((value) => {
    values += `- ${value}\n`;
  });
  return values;
};

const timeDiff = (time1, time2) => {
  const dtime1 = new Date(time1);
  const dtime2 = new Date(time2);

  if (isNaN(dtime1 - dtime2)) return 0;
  else return dtime1 - dtime2;
};

const isArrayEqual = (x, y) => {
  flag = _(x).xorWith(y, _.isEqual).isEmpty();
  console.log("FLAG*********", _(x).xorWith(y, _.isEqual).isEmpty());
  return flag;
};

const countDecimalDigits = (num) => {
  return num.toString().split(".")[1].length;
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
      const nestedKeys = isObjectEqual(
        sortedObj1[i],
        sortedObj2[i],
        `${parentKey}[${i}]`
      );
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

module.exports = {
  uuidCheck,
  timestampCheck,
  rootPath,
  retailAPI,
  retailFulfillmentState,
  retailOrderState,
  logFulfillmentState,
  logOrderState,
  bpp_fulfillments,
  bpp_provider_days,
  cancellation_rid,
  getObjValues,
  isObjectEqual,
  retailPaymentType,
  retailPymntTtl,
  categoriesMap,
  compareDates,
  hasTwoOrLessDecimalPlaces,
  timeDiff,
  getVersion,
  taxNotInlcusive,
  isArrayEqual,
  countDecimalDigits,
  grocery_categories_id,
  fnb_categories_id,
};
