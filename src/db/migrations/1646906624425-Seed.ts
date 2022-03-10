import { Category } from "src/categories/entities/category.entity";
import { Role } from "src/users/entities/role.entity";
import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import { category } from "../seed/category.seed";
import { role } from "../seed/role.seed";

export class Seed1646906624425 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository(Role).save(role);
        await getRepository(Category).save(category);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
