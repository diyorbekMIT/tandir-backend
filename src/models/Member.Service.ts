import { shapeIntoMongooseObjectId } from "../libs/config";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errrors";
import { Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import bcrypt from "bcryptjs";

class MemberService {
    private readonly memberModel;
    constructor() {
        this.memberModel = MemberModel;
    }


    /** BSSR */

    public async processSignup(input: MemberInput): Promise<Member> {
        const exist = await this.memberModel.findOne(
            {memberType: MemberType.RESTAURANT}).exec();
        if (exist) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
        }
        try {
        const hashedPassword = await bcrypt.hash(input.memberPassword, 10);
        console.log(hashedPassword)
        input.memberPassword = hashedPassword;
        const result = await this.memberModel.create(input);
        result.memberPassword = "";
        return result;
        } catch (error) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }

    }

    public async processLogin(input: MemberInput): Promise<Member> {
        const result = await this.memberModel.findOne(
            { memberNick: input.memberNick}, {memberNick: 1, memberPassword:1}
        ).exec();
        if (!result) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.NO_ERROR_NICK);
        }

        const match = await bcrypt.compare(input.memberPassword, result.memberPassword);

        
        
        if (!match) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }

        const member = await this.memberModel.findById(result._id).exec();

        console.log("isExist", result);
        return member as Member;
    }


    /** SPA */

    public async signup(input: MemberInput): Promise<Member> {
       
        try {
        const hashedPassword = await bcrypt.hash(input.memberPassword, 10);
        console.log(hashedPassword)
        input.memberPassword = hashedPassword;
        const result = await this.memberModel.create(input);
        result.memberPassword = "";
        return result.toObject();
        } catch (error) {
            console.log("Error, model:signup", error);
            throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
        }
    }

    public async login(input: MemberInput): Promise<Member> {
        const result = await this.memberModel.findOne(
            { memberNick: input.memberNick,
                memberStatus: { $ne: MemberStatus.DELETED }  // Exclude blocked users  // { $ne: MemberStatus.BLOCKED }  // Exclude blocked users
            }, 
            {memberNick: 1, memberPassword:1, memberStatus: 1}
        ).exec();
        if (!result) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.NO_ERROR_NICK);
        }
        else if (result.memberStatus === MemberStatus.BLOCKED) {
            throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
        }

        const match = await bcrypt.compare(input.memberPassword, result.memberPassword);


        if (!match) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }

        const member = await this.memberModel.findById(result._id).lean().exec();

        console.log("isExist", member);
        
        return member as Member;
    }

    public async getUsers(): Promise<Member[]> {
        const result = await this.memberModel.find({memberType: MemberType.USER}).exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        return result;
    }

    public async updateChoosenUser(user: MemberUpdateInput): Promise<Member> {
        user._id = shapeIntoMongooseObjectId(user._id);
        const result = await this.memberModel.findByIdAndUpdate(user._id, user, { new: true }).exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        return result;
    }
}

export default MemberService;