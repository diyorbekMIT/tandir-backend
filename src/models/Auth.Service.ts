import { configDotenv } from "dotenv/lib/main";
import { AUTH_TIME } from "../libs/config";
import jwt from 'jsonwebtoken';
import { Member } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errrors";

class AuthService {
    private readonly secretToken;

    constructor() {
        this.secretToken = process.env.SECRET_TOKEN as string;
    }

    public async createToken(payload: Member): Promise<String> {
        try {
            const duration = `${AUTH_TIME}h`;
            const token = jwt.sign(payload, this.secretToken, {expiresIn: duration});
            return token as string;
        }catch(err) {
           throw new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED);
        }
    }

    public async checkAuth(token: string): Promise<Member> {
        const result = (await jwt.verify(token, this.secretToken)) as Member;
        console.log(`-----{AUTH} memberNick: ${result.memberNick}`)
        return result;
        
    }
}

export default AuthService;