import { Entity, PrimaryColumn, Column } from "typeorm";
import { BaseModel } from "./model";

@Entity({ name: "user_table" })
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
