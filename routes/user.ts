import express from "express";
import UserController from "../Controllers/UserController";
import { verifyToken } from "../db/middlewares/authMiddleware";

const routes = express.Router();
console.log("Rutas de usuarios cargadas correctamente");

routes.post("/create", UserController.createUser);
routes.get("/",  UserController.getUsers);
routes.get("/:id",  UserController.getUserById);
routes.put("/:id",  UserController.updateUser);
routes.delete("/:id",  UserController.deleteUser);
routes.get("/me",  UserController.getCurrentUser);


export default routes;
