import express from "express";
import CategoryController from "./categories.controllers.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

//Para poder recibir las categorias en la tienda de manera publica
router.get("/public", CategoryController.getAllCategories);

router.get("/get", verifyToken("admin"), CategoryController.getAllCategories);
router.post("/create", verifyToken("admin"), CategoryController.createCategory);
router.put(
  "/update/:category_id",
  verifyToken("admin"),
  CategoryController.updateCategory
);
router.delete(
  "/delete/:category_id",
  verifyToken("admin"),
  CategoryController.logicDeleteCategory
);

export default router;
