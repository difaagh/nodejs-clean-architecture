import { Entity, PrimaryColumn, Column } from "typeorm";
import { BaseModel } from "./model";
import { USER_TABLE } from "@src/config/constants";

@Entity({ name: USER_TABLE })
export class User extends BaseModel {
  @PrimaryColumn({ name: "id" })
  id?: string;
  @Column({ name: "name" })
  name: string;
  @Column({ name: "password" })
  password: string;
  @Column({ name: "email" })
  email: string;
}
