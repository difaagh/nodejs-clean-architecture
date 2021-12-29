import { Column } from "typeorm";

export class BaseModel {
  @Column({ name: "created_date" })
  createdDate?: Date;
  @Column({ name: "updated_date" })
  updatedDate?: Date;
}
