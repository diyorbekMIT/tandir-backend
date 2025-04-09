import mongoose from "mongoose";
export const shapeIntoMongooseObjectId = (target: any) => {
    return typeof target === 'string' ? new mongoose.Types.ObjectId(target) : target;
};

export const AUTH_TIME = 24;