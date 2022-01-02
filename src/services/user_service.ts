import { Connection } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import * as bcrypt from "bcrypt";
import { User } from "@src/model/index";
import { ValidateSchema } from "@src/validation/validation";
import { CreateUserSchema, UpdateUserSchema } from "@src/validation/user_validation";
import { JwtGenerate } from "@src/lib/jwt";
import { BadRequestError } from "@src/exception/index";

export class UserService {
  db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  @Transactional()
  async Create(user: User): Promise<User> {
    const newUser = ValidateSchema<User>(CreateUserSchema, user).throwErrorIfNeeded();
    const exists = await this.FindBy("email", user.email);
    if (exists) {
      throw new BadRequestError(user.email + " already exists", "BAD_REQUEST");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(Buffer.from(newUser.password), salt);
    newUser.password = hashedPassword;
    newUser.createdDate = new Date();
    await this.db.getRepository(User).save(newUser);

    return newUser;
  }

  @Transactional()
  async Update(user: User): Promise<User> {
    ValidateSchema<User>(UpdateUserSchema, user).throwErrorIfNeeded();
    const exists = await this.FindBy("id", user.id);
    if (!exists) {
      throw new BadRequestError(user.id + " did'nt exists", "BAD_REQUEST");
    }
    if (user.password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(Buffer.from(user.password), salt);
      user.password = hashedPassword;
    }
    user.updatedDate = new Date();
    await this.db.getRepository(User).update({ id: user.id }, user);
    return user;
  }

  async FindBy(column: keyof User, value: string): Promise<User> {
    const obj: Record<string, any> = {};
    obj[column] = value;
    const user = await this.db.getRepository(User).findOne(obj);
    return user;
  }

  async GetAll(): Promise<User[]> {
    const user = await this.db.getRepository(User).find();
    return user;
  }

  async Delete(userId: string): Promise<void> {
    await this.db.getRepository(User).delete({ id: userId });
  }

  async Login(email: string, password: string): Promise<string> {
    if (!email || !password) {
      throw new BadRequestError("email and password can't be null", "BAD_REQUEST");
    }
    const user = await this.FindBy("email", email);
    if (!user) {
      return null;
    }
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return null;
    }
    const token = JwtGenerate(user);
    return token;
  }
}
