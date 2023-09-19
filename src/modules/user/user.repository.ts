import { DataSource, Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { createUserInterface, updateUser, User, loginUserInterface } from "./model/user";
import { UserId } from "./model/user.id";
import { UserName } from "./model/user.username";
import { Email } from "./model/user.email";
import { zodLogginUserDao, zodUserDao } from "./dao/user.dao";
import { z } from "zod";

export class UserRepository {
	private userRepo: Repository<UserEntity>;
	constructor(appDataSource: DataSource) {
		this.userRepo = appDataSource.getRepository(UserEntity);
	}

	async isUniqueUserName(username: UserName): Promise<UserName.Unique | null> {
		const user = await this.findByEmailOrUsername(username)
		if (user === null) {
			return username as UserName.Unique
		}
		return null
	}

	async findByEmail(email: Email): Promise<User | null> {
		return this.userRepo.findOneBy({ email }).then((x) => z.nullable(zodUserDao).parse(x))
	}

	async isUniqueEmail(email: Email): Promise<Email.Unique | null> {
		const user = await this.findByEmail(email)
		if (user === null) {
			return email as Email.Unique
		}
		return null;
	}

	async findByEmailOrUsername(data: Email | UserName): Promise<User | null> {
		return this.userRepo
			.findOneBy([{ email: data }, { username: data }])
			.then((x) => z.nullable(zodUserDao).parse(x));
	}



	async findById(id: UserId): Promise<User | null> {
		return this.userRepo.findOneBy({ id }).then((x) =>
			z.nullable(zodUserDao).parse(x)
		)
	}

	updatePasswordById(id: UserId, password: string) {
		this.userRepo.update(
			{ id: id },
			{ password: password },
		)
	}

	updateUser(userId: UserId, user: updateUser) {
		this.userRepo.update({ id: userId }, user)
	}

	createUser(user: createUserInterface){
		return this.userRepo.save(user)
	}
}