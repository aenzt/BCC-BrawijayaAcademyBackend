import {MigrationInterface, QueryRunner} from "typeorm";

export class NewMig1647137413644 implements MigrationInterface {
    name = 'NewMig1647137413644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`imageLink\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`imageLink\``);
    }

}
