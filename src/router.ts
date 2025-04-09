import express from "express";
import memberController from "./controllers/member.controller";
const router = express.Router();

router.post('/member/login', memberController.login)

router.post('/member/signup', memberController.signup)

router.get('/member/verify', memberController.verifyAuth)

export default router;