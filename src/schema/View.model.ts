import mongoose, { Schema } from "mongoose"
import { ViewEnum } from "../libs/enums/view.enum"

const viewSchema = new Schema({
    viewGroup: {
        type: String,
        enum: ViewEnum,
        required: true
    },

    memberId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },

    viewRefId: {
        type: Schema.Types.ObjectId,
        required: true
    },

},
{ timestamps: true }
)


export default mongoose.model('View', viewSchema)