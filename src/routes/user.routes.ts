import { Router } from "express";
import { loginDto } from '../modules/user/dto/login.dto';
import { handleExpresss } from "../utility/handle-express";
import { UserService } from '../modules/user/user.service';
import { forgetPasswordDto } from "../modules/user/dto/forget-password.dto";
import { BadRequestError } from "../utility/http-errors";
import { signupDto } from "../modules/user/dto/signup.dto";
import { loginMiddle } from "../login.middleware";
import { upload } from "../utility/multer";
import { editProfile } from "../modules/user/dto/edit-profile.dto";
import { JwtService } from "../modules/jwt/jwt.service";
import { jwtDto } from "../modules/jwt/dto/jwt.dto";
import { blockDto } from "../modules/block/dto/block.dto";
export const resetPasswordRoute = "reset_password"


export const makeUserRouter = (userService: UserService, jwtService: JwtService) => {
	const app = Router();
	app.post("/login", (req, res) => {
		const dto = loginDto.parse(req.body);
		handleExpresss(res, () => userService.login(dto));
	});

	app.post("/register", (req, res) => {
		const dto = signupDto.parse(req.body);
		handleExpresss(res, () => userService.signup(dto), 201)
	})
	app.post("/login/forget", (req, res) => {
		const dto = forgetPasswordDto.parse(req.body);
		handleExpresss(res, () => userService.forgetPassword(dto));
	})

	app.post(`/${resetPasswordRoute}/:userId/:token`, async (req, res) => {
		const { userId, token } = req.params;
		const { password1, password2 } = req.body;

		handleExpresss(res, () => userService.resetPassword(userId, token, password1, password2));
	})
	app.post("/editProfile", loginMiddle(userService), upload.single('avatar'), (req, res) => {
		const dto = editProfile.parse(req.body);
		handleExpresss(res, () => userService.updateUserInfo(req.user.id, dto, req.file));
	});

	app.post("/verifyToken", async (req, res) => {
		const dto = jwtDto.parse(req.body)
		handleExpresss(res, () => jwtService.verify(dto))
	})

	app.post("block", loginMiddle(userService), async (req, res) => {
		const userId = req.user.id
		const dto = blockDto.parse({ ...req.body, userId })
		handleExpresss(res, () => );
	})
	return app;
};