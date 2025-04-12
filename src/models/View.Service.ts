import { ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";
import { View } from "../libs/types/view";
import { resourceUsage } from "process";

export class ViewService {
   private readonly viewModel;

   constructor() {
    this.viewModel = ViewModel;
   }

   public async checkViewExistence(input: ViewInput): Promise<View> {
    return await this.viewModel
        .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
        .exec();
}
}

export default ViewService;