import mongoose, { ObjectId, Types } from "mongoose";
import { ViewEnum } from "../enums/view.enum";

export interface View {
    _id: Types.ObjectId;
    viewGroup: ViewEnum;
    memberId: Types.ObjectId;
    viewRefId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface ViewInput {
    memberId: Types.ObjectId;
    viewRefId: Types.ObjectId;
    viewGroup: ViewEnum
}