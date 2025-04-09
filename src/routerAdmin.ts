import memberController from "./controllers/member.controller";
import productController from "./controllers/product.controller";
import restaurantController from "./controllers/restaurant.controller";

import express from "express";
import makeUploader from "./libs/utils/uploader";
const routerAdmin = express.Router();

routerAdmin.get('/', restaurantController.goHome);

routerAdmin
   .get('/signup', restaurantController.getSignUp)
   .post('/signup', makeUploader("members").single("memberImage"),restaurantController.processSignUp);

routerAdmin
   .get('/login', restaurantController.getLogin)
   .post('/login', restaurantController.processLogin);

routerAdmin.get('/logout', restaurantController.logout)

routerAdmin.get('/checkauth', restaurantController.checkAuth)

/** PRODUCTS */

routerAdmin.post('/product/create', memberController.verifyRestaurant,
   makeUploader("products").array("productImages"),
   productController.createProduct);

routerAdmin.post('/product/:id', 
      memberController.verifyRestaurant, 
      productController.updateProduct
  );

routerAdmin.get('/product/all', memberController.verifyRestaurant,productController.getAllProducts)


/**USERS */

routerAdmin.get('/user/all', memberController.verifyRestaurant, memberController.getUsers);
routerAdmin.post('/user/update', memberController.verifyRestaurant, memberController.updateChoosesUser)


export default routerAdmin;