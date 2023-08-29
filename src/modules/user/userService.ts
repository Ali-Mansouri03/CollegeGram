import { UserRepository } from './userRepository';
import { isUserName } from './model/user.username';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../../utility/http-errors';
import { LoginDtoType } from './dto/login.dto';
import { isUserEmail } from './model/user.email';
import { UserInformation } from './model/user';
import { signupDto } from './dto/signup.dto';
import { CreateFullUserDao, CreateUserDao } from './dao/user.dao';
import { hashPassword, comparePasswords } from '../../utility/passwordUtils';
import { v4 } from 'uuid';
import { UserId } from './model/user.id';

export class UserService {
    constructor(private userRepository: UserRepository) { }
    async login({ authenticator, password }: LoginDtoType){
        if (isUserEmail(authenticator)) {
            const user = await this.userRepository.findByEmail(authenticator);
            if (!user) {
                throw new NotFoundError('Email');
            }
            // if (user.password !== password) {
            //     throw new UnauthorizedError();
            // }
            // // const { password: _, ...rest } = user

            const passwordsMatch = await comparePasswords(password, user.password);
            if (passwordsMatch) {
                // send token
            } else {
                throw new UnauthorizedError();
            }

            const outputUser = CreateFullUserDao(user)
            return outputUser;
                
        }
        if (isUserName(authenticator)) {
            const user = await this.userRepository.findByUsername(authenticator);
            if (!user) {
                throw new NotFoundError('User');
            }
            if (user.password !== password) {
                throw new UnauthorizedError();
            }
            const outputUser = CreateFullUserDao(user)
            return outputUser;
        }
    }
    async signup(dto: signupDto) {

        const userByEmail = await this.userRepository.findByEmail(dto.email);
        if (userByEmail) {
            throw new ConflictError("ایمیل وارد شده از قبل در کالج‌گرام ثبت شده است")
        }

        const userByUsername = await this.userRepository.findByUsername(dto.username);
        if (userByUsername) {
            throw new ConflictError("یوزرنیم وارد شده از قبل در کالج‌گرام ثبت شده است")
        }

        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestError("پسوردهایی که وارد کردید یکسان نیستند.")
        }

        const hashedPassword = await hashPassword(dto.password);

        const user = {
            id: v4() as UserId,
            username: dto.username,
            email: dto.email,
            password: hashedPassword

        };
        
        const newUser = await this.userRepository.createUser(user);
        const outputUser = CreateUserDao(newUser);
        return outputUser;
    }
}