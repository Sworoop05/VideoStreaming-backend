import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    //it is not a good practice to give a filename as original name ,
    //so we need to give it a unique filename to prevent multiple same filename
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
export  {upload};
