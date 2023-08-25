import {Entity, PrimaryGeneratedColumn, Column, Unique} from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn({type: "int"})
  id: number;

  @Column({type: "varchar", length: 50})
  @Unique(['username'])
  username: string;

  @Column({type: "varchar", length: 255,nullable: true})
  passwd: string;

  @Column({type: "varchar", length: 255,nullable: true})
  @Unique(['email'])
  email: string;

  @Column({type: "varchar", length: 255,nullable: true})
  googleId: string;  

  @Column({type: "varchar", length: 255,nullable: true})
  facebookId: string;
}


