const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");

const checkOnTrack = (data, msgIdSet) => {
  let onTrackObj = {};
  let on_track = data;
  let contextTimestamp = on_track?.context?.timestamp;

  on_track = on_track?.message?.tracking;
  let tags = on_track?.tags;

  if (tags) {
    tags.forEach((tag) => {
      if (tag?.code === "order") {
        tag?.list.forEach((listTag) => {
          if (
            listTag?.code === "id" &&
            listTag?.value != dao.getValue("trackOrderId")
          ) {
            onTrackObj.orderIdErr = `Order Id in /track and /on_track does not match`;
          }
        });
      }

      if (tag?.code === "config") {
        tag?.list.forEach((listTag) => {
          let attrVal;
          if (listTag?.code === "attr") {
            attrVal = listTag?.value;
          }
          if (listTag?.code === "type" && listTag?.value === "live_poll") {
            if (!on_track?.location?.gps)
              onTrackObj.locationErr = `tracking/location/gps is required for live_poll`;
            if (attrVal !== "tracking.location.gps")
              onTrackObj.attrErr = `attr value should be 'tracking/location/gps' for live_poll`;
          }

          if (listTag?.code === "type" && listTag?.value === "deferred") {
            if (!on_track?.url)
              onTrackObj.locationErr = `tracking/url is required for non hyperlocal tracking`;
            if (attrVal !== "tracking.url")
              onTrackObj.attrErr = `attr value should be 'tracking/url' for deferred tracking`;
          }
        });
      }
    });
  } else {
    onTrackObj.tagsErr = `Tags should be provided in /on_track`;
  }

  if (on_track?.location?.updated_at > contextTimestamp) {
    onTrackObj.updatedAtErr = `tracking/location/updated_at cannot be future dated w.r.t context/timestamp`;
  }

  if (on_track?.location?.time?.timestamp > contextTimestamp) {
    onTrackObj.lctnTimeAtErr = `tracking/location/time/timestamp cannot be future dated w.r.t context/timestamp`;
  }

  console.log(
    on_track?.location?.updated_at,
    on_track?.location?.time?.timestamp
  );
  if (on_track?.location?.updated_at < on_track?.location?.time?.timestamp) {
    onTrackObj.updatedAtLctnErr = `tracking/location/time/timestamp cannot be future dated w.r.t tracking/location/updated_at`;
  }

  return onTrackObj;
};

module.exports = checkOnTrack;
