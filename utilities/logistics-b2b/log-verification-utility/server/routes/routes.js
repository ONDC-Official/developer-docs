const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const {
  SUPPORTED_DOMAINS_SORTED_INDEX,
  FULL_ACTION_LIST,
  SERVER_LOG_DEST,
  ...constants
} = require("../../utils/constants");
const validate_schema_for_domain_json = require("../../schema/main");
const { validateLogs } = require("../../utils/validateLogUtil");
const readLogFiles = require("../../utils/logistics/readLogFiles");

router.get("/", (req, res) => {
  res.json({ msg: "Head over to /validate for route validation" });
});

// Route defined to validate logs

router.post("/validate/:domain", async (req, res) => {
  try {
    const { logPath } = req.body;
    const { domain } = req.params;

    /* -------- Input validation ------- */
    if (!logPath)
      return res.status(400).json({ msg: 'Req Body needs to have "logPath"' });

    if (!Object.keys(SUPPORTED_DOMAINS_SORTED_INDEX).includes(domain))
      return res
        .status(404)
        .json({ msg: `Domain ${domain} not supported yet!` });

    /* ------ End of Input validation ------- */

    const destination = await readLogFiles(domain, logPath);
    await validateLogs(domain, logPath, destination);
    const logReport = JSON.parse(
      fs.readFileSync(path.join(destination, "log_report.json")).toString()
    );
    return res.json({ logReport });
  } catch (error) {
    return res.status(500).json({ msg: "Error occurred while report generation" });
  }
});

module.exports = router;