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
// const { logsUpload, logUpload } = require("../utils/fileHandler");

router.get("/", (req, res) => {
  res.json({ msg: "Head over to /validate for route validation" });
});

// /validate/flow/:domain

// router.post("/validate/local/single", async (req, res) => {
//   const { domain, path: filePath } = req.body;
//   if (!domain || !filePath)
//     return res
//       .status(400)
//       .json({ msg: 'Req Body needs to have "domain" and "path"' });

//   if (!Object.keys(SUPPORTED_DOMAINS_SORTED_INDEX).includes(domain))
//     return res.status(404).json({ msg: `Domain ${domain} not supported yet!` });
//   try {
//     const file = fs.readFileSync(path.join(filePath));

//     const fileData = JSON.parse(file.toString());

//     const action = fileData.context.action;

//     const individualSchemaErrors = validate_schema_for_domain_json(domain, {
//       [action]: [fileData],
//     });
//     const destination = path.join(
//       __dirname,
//       "../../",
//       SERVER_LOG_DEST,
//       domain,
//       fileData.context.transaction_id,
//       "logs"
//     );
//     const dirExists = fs.existsSync(destination);
//     try {
//       fs.mkdirSync(destination, { recursive: true });

//       fs.writeFileSync(
//         path.join(destination, action + ".json"),
//         JSON.stringify(fileData)
//       );
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ msg: "Error occurred while storing file" });
//     }

//     if (dirExists) {
//       var fullLogReport = {};
//       validateLogs(domain, destination, path.join(destination, "..")).then(
//         () => {
//           fullLogReport = JSON.parse(
//             fs
//               .readFileSync(path.join(destination, "../log_report.json"))
//               .toString()
//           );
//           return res.json({ individualSchemaErrors, fullLogReport });
//         }
//       );
//     } else {
//       return res.json({ individualSchemaErrors });
//     }
//   } catch (error) {
//     console.log("Error:", error);
//     if (error.code === "ENOENT")
//       return res.status(400).json({ msg: "File/Path does not exist" });
//     return res.status(500).json({ msg: "Error occurred" });
//   }
// });

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

// router.post("/validate/single/:domain", logUpload, async (req, res) => {
//   if (!req.file)
//     return res.status(403).json({ msg: "Invalid or no file sent" });
//   const domain = req.params.domain;
//   if (!Object.keys(SUPPORTED_DOMAINS_SORTED_INDEX).includes(domain))
//     return res.status(404).json({ msg: `Domain ${domain} not supported yet!` });

//   const fileData = JSON.parse(req.file.buffer.toString());

//   const destination = path.join(
//     __dirname,
//     "../../",
//     SERVER_LOG_DEST,
//     domain,
//     fileData.context.transaction_id,
//     "logs"
//   );
//   const dirExists = fs.existsSync(destination);
//   const action = fileData.context.action;
//   try {
//     fs.mkdirSync(destination, { recursive: true });

//     fs.writeFileSync(
//       path.join(destination, action + ".json"),
//       JSON.stringify(fileData)
//     );
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ msg: "Error occurred while storing file" });
//   }

//   const individualSchemaErrors = validate_schema_for_domain_json(domain, {
//     [action]: [fileData],
//   });

//   if (dirExists) {
//     var logReport = {};
//     validateLogs(domain, destination, path.join(destination, "..")).then(() => {
//       logReport = JSON.parse(
//         fs.readFileSync(path.join(destination, "../log_report.json")).toString()
//       );
//       return res.json({ individualSchemaErrors, logReport });
//     });
//   } else {
//     return res.json({ individualSchemaErrors });
//   }
// });

// router.post("/validate/multiple/:domain", logsUpload, async (req, res) => {
//   if (!req.files || req.files.length === 0)
//     return res.status(400).json({ msg: "No files sent" });
//   const domain = req.params.domain;
//   if (!Object.keys(SUPPORTED_DOMAINS_SORTED_INDEX).includes(domain))
//     return res.status(404).json({ msg: `Domain ${domain} not supported yet!` });

//   const domainSortedIndex = constants[SUPPORTED_DOMAINS_SORTED_INDEX[domain]];
//   // Check if all compulsory files are present & no extra files are sent
//   if (
//     !domainSortedIndex.every((logName) =>
//       Object.keys(req.files).includes(logName)
//     )
//   )
//     return res.status(400).json({ msg: "All files not detected" });

//   const firstFileData = JSON.parse(
//     req.files[Object.keys(req.files)[0]][0].buffer.toString()
//   );
//   const destination = path.join(
//     __dirname,
//     "../../",
//     SERVER_LOG_DEST,
//     domain,
//     firstFileData.context.transaction_id,
//     "logs"
//   );
//   if (fs.existsSync(destination))
//     fs.rmdirSync(destination, { recursive: true });
//   // return res.status(403).json({msg: "Log Report for that Transaction ID already recorded."})

//   fs.mkdirSync(destination, { recursive: true });

//   for (file of Object.values(req.files)) {
//     const fileData = JSON.parse(file[0].buffer.toString());
//     const action = fileData.context.action;
//     fs.writeFileSync(
//       path.join(destination, action + ".json"),
//       JSON.stringify(fileData)
//     );
//   }

//   var logReport = {};
//   validateLogs(domain, destination, path.join(destination, ".."))
//     .then(() => {
//       logReport = JSON.parse(
//         fs.readFileSync(path.join(destination, "../log_report.json")).toString()
//       );
//       return res.json({ logReport });
//     })
//     .catch((error) => {
//       console.log("Error", error);
//       return res
//         .status(500)
//         .json({ msg: "Error Occured during report generation" });
//     });

//   // const log_generation_success =
//   //   (await validateLog(domain, destination)) && true;
//   // return res.json({
//   //   domain,
//   //   files: Object.keys(req.files),
//   //   log_generation_success,
//   // });
// });

// router.post("/validateSchema/:path", (req, res) => {
//   const path = req.params.path;
//   const data = req.body;
//   const result = service.schemaValidation(domain, data, path);
//   res.json(result);
// });

// router.post("/CheckContext/:path", (req, res) => {
//   const path = req.params.path;
//   const data = req.body.context;
//   const result = service.checkContext(data, path);
//   res.json(result);
// });

// router.post("/ValidateLog/:domain", (req, res) => {
//   const domain = req.params.domain;
//   validateLog(domain);
// });

module.exports = router;
