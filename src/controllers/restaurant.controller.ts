import MemberService from "../models/Member.Service";
import { T } from "../libs/types/common";
import express, { Request, Response } from "express";
import { MemberType } from "../libs/enums/member.enum";
import { AdminRequest, MemberInput } from "../libs/types/member";
import Errors, { Message } from "../libs/Errrors";


const restaurantController : T = {};

restaurantController.goHome = (req: Request, res: Response) => {
    try {
      res.render("home");
    } catch (err) {
        console.log("ERROR on RestaurantHomePage", err);
        res.redirect("/admin")
    }
}



restaurantController.getSignUp = (req: Request, res: Response) => {
    try {
      res.render("signup")
    } catch (err) {
        console.log("ERROR on RestaurantSignUpPage", err);
        res.redirect("/admin")
    }
}

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
      res.render("login")
    } catch (err) {
        console.log("ERROR on RestaurantLoginPage", err);
        res.redirect("/admin");
    }
}

restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
      const input = req.body;
      const memberService = new MemberService();
      const result = await memberService.processLogin(input);
      req.session.member = result;
      req.session.save(function () {
        res.redirect("/admin/product/all")
      })
    } catch (err) {
        console.log("ERROR on RestaurantProcessLogin", err);
        const message =  err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}"); window.location.replace('/admin/login')</script>`)
        console.log(err);

    }
}

restaurantController.processSignUp = async (req: AdminRequest, res: Response) => {
  try {
		console.log("processSignup!");
        const file = req.file;
        
		const newMember: MemberInput = req.body;
        newMember.memberImage = file?.path;
		  newMember.memberType = MemberType.RESTAURANT;

		const memberService = new MemberService();
		const result = await memberService.processSignup(newMember);
  
        req.session.member = result;
        req.session.save(function() {
            res.redirect("/admin/product/all");
        });
    } catch (err) {
        console.log("Error, processLogin", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(
            `<script> alert("${message}"); window.location.replace('/admin/signup') </script>`
        );
	}
};


restaurantController.checkAuth = (req: AdminRequest, res: Response) => {
  try {
    if (req.session?.member) {
      res.send(`Hi ${req.session.member.memberNick}`)
    } else {
     
      res.send(Message.NOT_AUTHONTICATED)
    }
  } catch (err) {
      console.log("ERROR on RestaurantCheckAuth", err);
      res.send(err);
  }
}

restaurantController.logout = (req: AdminRequest, res: Response) => {
  try {
    req.session?.destroy(function() {
      console.log("logout");
      res.redirect("/admin")
    })
  } catch (err) {
    console.log("ERROR on RestaurantLogout", err);
    res.send(err);
  }
}


export default restaurantController;