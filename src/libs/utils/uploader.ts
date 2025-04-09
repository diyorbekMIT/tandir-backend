import path from "path";
import multer from "multer";
import { v4 } from "uuid";

function targetImageStore(address: string) {
    return multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, `./uploads/${address}`);
        },
        filename: function(req, file, cb) {
            const ext = path.parse(file.originalname).ext;
            cb(null, v4() + ext);
        }
    })
};

const makeUploader = (address: string) => {
    const storage = targetImageStore(address);
    return multer({storage: storage})
}

export default makeUploader;