const { FULL_ACTION_LIST, SERVER_LOG_DEST } = require("../../utils/constants");
const path = require("path");

const multer = require("multer");
// const multiStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // initial upload path
// 		console.log("Hello", req.files.search[0])
//     const data = JSON.parse(req.files[0].buffer.toString());
//     if (!(data && data.context && data.context.transaction_id)) cb(Error("No file found!"), undefined);
//     let destination = path.join(
//       __dirname,
//       SERVER_LOG_DEST,
//       data.context.transaction_id
//     );

//     cb(null, destination);
//   },
//   filename: (_req, file, callback) => {
//     callback(
//       null,
//       file.fieldname + path.extname(file.originalname).toLowerCase()
//     );
//   },
// });


const multiStorage = multer.memoryStorage({});
const singleStorage = multer.memoryStorage({});

const fileFilter = (_req, file, callback) => {
  // Check ext
  const extname = /json/.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = /json/.test(file.mimetype);

  if (mimetype && extname) {
    return callback(null, true);
  } else {
    return callback(null, false);
  }
};

const uploadMultiple = multer({ storage: multiStorage, fileFilter });
const uploadSingle = multer({storage: singleStorage, fileFilter});

const logsUpload = uploadMultiple.fields(
  FULL_ACTION_LIST.map((name) => ({ name, maxCount: 1 }))
);
const logUpload = uploadSingle.single("log")
module.exports = { logsUpload, logUpload };
