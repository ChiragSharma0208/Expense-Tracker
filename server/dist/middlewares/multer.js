import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + String(Math.floor(Math.random() * 10)));
    },
});
export const upload = multer({ storage });
