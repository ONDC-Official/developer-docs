const fs = require("fs");
const utils = require("./utils");
const constants = require("./constants");
const path = require("path");
//const checkOnSelect = require("./retOnSelect");

const servicabilityCheck = (element, error) => {
    try {
        action = element.context.action
        console.log(`Running servicability check in /${action}`);
        let nonServiceableFlag = 0;
            try {
                console.log(`Checking fulfillments' state in ${action}`);
                on_select = element.message.order;
                const ffState = on_select.fulfillments.every((ff) => {
                    const ffDesc = ff.state.descriptor;
                    if (ffDesc.code.toLowerCase() === "non-serviceable") {
                        nonServiceableFlag = 1;
                    }
                    return ffDesc.hasOwnProperty("code")
                        ? ffDesc.code.toLowerCase() === "serviceable" ||
                            ffDesc.code.toLowerCase() === "non-serviceable"
                        : false;
                });
                if (!ffState) {
                    error.ffStateCode = `Pre-order fulfillment state codes should be used in fulfillments[].state.descriptor.code`;
                }
                } catch (err) {
                    console.log(
                        `!!Error while checking fulfillments' state in /${action}`,
                        err
                    );
                }
            if (element.hasOwnProperty("error")) {
                on_select_error = element.error;
                if (
                    nonServiceableFlag &&
                    (!on_select_error ||
                        !on_select_error.type === "DOMAIN-ERROR" ||
                        !on_select_error.code === "30009")
                ) {
                    error.notServiceable = `Non Serviceable Domain error should be provided when fulfillment is not serviceable`;
                }
                else if (nonServiceableFlag &&
                    (on_select_error &&
                        on_select_error.type === "DOMAIN-ERROR" &&
                        on_select_error.code === "30009")
                    ) {
                    return true
                }
            }
            else if (!nonServiceableFlag && !element.hasOwnProperty("error")) {
                return false
            }
        return error
    } catch (err) {
        if (err.code === "ENOENT") {
            console.log(`!!File not found for /${action} API!`);
        } else {
            console.log(
                `!!Some error occurred while checking /${action} API`,
                err
            );
        }
    }
};

module.exports = servicabilityCheck
