import MemberService from "../models/Member.Service";
import { T } from "../libs/types/common";
import express, { NextFunction, Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errrors";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import { AUTH_TIME, shapeIntoMongooseObjectId } from "../libs/config";
import AuthService from "../models/Auth.Service";




const memberController: T = {};

const memberService = new MemberService();
const authService = new AuthService();


memberController.verifyAuth = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies["accessToken"];
    if (!token) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHONTICATED); // Check this first
    }
    req.member = await authService.checkAuth(token); // Then validate token
    next();
  } catch (err) {
    console.log("ERROR", err);
    if (err instanceof Errors) {
      return res.status(err.code).json(err); // Stop here
    }
    return res.status(Errors.standard.code).json(Errors.standard); // Stop here
  }
};


memberController.retrieveAuth = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try{
    
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);
     next()
  } catch(err) {
    console.log("ERROR", err);
    next();
} 
}

memberController.logout = async (req: ExtendedRequest, res: Response) => {
    try{
      console.log("logout");
      res.cookie("accessToken", null, {maxAge: 0, httpOnly: true});
      res.status(HttpCode.OK).json({logout: true});
    } catch(err) {
      if (err instanceof Errors) res.status(err.code).json(err);
      else res.status(Errors.standard.code).json(Errors.standard);
    }
}


memberController.login = async (req: Request, res: Response) => {
  try {
    const input = req.body,
    result = await memberService.login(input),
    token = await authService.createToken(result);

    //TOKEN AUTHENTICATION
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIME * 3600 * 1000,
      httpOnly: false
    })

    res.status(200).json({member: result, accessToken: token});
  } catch (err) {
      console.log("ERROR on RestaurantProcessLogin", err);
      if (err instanceof Errors) res.status(err.code).json(err);
      else res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Errors.standard)

  }             
}

memberController.signup = async (req: Request, res: Response) => {
  try {
    const newMember = req.body,
     result = await memberService.signup(newMember),
     token = await authService.createToken(result);

    //TOKEN AUTHENTICATION
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIME * 3600 * 1000,
      httpOnly: false
    })
    console.log(token);

    res.status(200).json({member: result, accessToken: token});
  } catch (err) {
      console.log("ERROR on RestaurantProcessSignUp", err);
      if (err instanceof Errors) res.status(err.code).json(err);
      else res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Errors.standard)
  }
}



memberController.verifyRestaurant = async (req: AdminRequest, res: Response, next: NextFunction) => {
  if (req.session?.member?.memberType === MemberType.RESTAURANT) {
      req.member = req.session.member;
      next();
  } else {
      const message = Message.NOT_AUTHONTICATED; // ✅ Fixed spelling
      res.send(`
          <script>
              alert("${message}");
              window.location.replace("/admin/login");
          </script>
      `);
  }
};

memberController.getUsers = async(req: AdminRequest, res: Response) => {
  try {
    const users = await memberService.getUsers();
    res.render("users", {users: users})
  } catch (err) {
    console.log("ERROR on getUsers", err);
    res.redirect("/admin/login");
  }
}


memberController.updateChoosesUser = async (req: AdminRequest, res: Response) => {
  try {
    console.log("updateChoosesUser");
    req.body._id = shapeIntoMongooseObjectId(req.body._id)
    const result = await memberService.updateChoosenUser(req.body);
    res.status(HttpCode.OK).json({data: result});
    console.log('result', result);
  } catch(err) {
    console.log("ERROR on updateChoosesUser", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard)
  }
}


memberController.getMemberDetail = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getMemberDetail");
    if (!req.member) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHONTICATED);
    }
    const result = await memberService.getMemberDetail(req.member);
    console.log(result);
    return res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("ERROR on getMemberDetail", err);
    if (err instanceof Errors) return res.status(err.code).json(err);
    else return res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default memberController