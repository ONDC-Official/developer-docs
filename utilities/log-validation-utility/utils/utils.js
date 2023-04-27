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

// const uuidCheck = (data) => {
//   console.log("***UUID Validation Utils***");
//   let uuid =
//     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//   if (!uuid.test(data)) return false;
//   return true;
// };

const timestampCheck = (date) => {
  console.log("***Timestamp Check Utils***");
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
    values += value + "\n";
  });
  return values;
};

const isArrayEqual = (x, y) => {
  flag = _(x).xorWith(y, _.isEqual).isEmpty();
  console.log("FLAG*********", _(x).xorWith(y, _.isEqual).isEmpty());
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

module.exports = {
  timestampCheck,
  rootPath,
  retailAPI,
  retailFulfillmentState,
  retailOrderState,
  logFulfillmentState,
  logOrderState,
  bpp_fulfillments,
  cancellation_rid,
  getObjValues,
  retailPaymentType,
  retailPymntTtl,
  taxNotInlcusive,
  isArrayEqual,
  countDecimalDigits,
  grocery_categories_id,
  fnb_categories_id,
  emailRegex,
  isoDurToSec,
  timeDiff,
};
