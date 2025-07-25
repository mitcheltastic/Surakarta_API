// /src/api/middlewares/upload.middleware.js

const multer = require('multer');

// We use memoryStorage to temporarily hold the file as a buffer
// before it gets uploaded to ImageKit.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;