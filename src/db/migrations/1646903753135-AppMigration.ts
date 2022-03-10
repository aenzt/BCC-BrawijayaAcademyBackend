import {MigrationInterface, QueryRunner} from "typeorm";

export class AppMigration1646903753135 implements MigrationInterface {
    name = 'AppMigration1646903753135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`nim\` bigint NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`fullName\` varchar(255) NOT NULL, \`faculty\` varchar(255) NOT NULL, \`major\` varchar(255) NOT NULL, \`roleId\` int NULL, PRIMARY KEY (\`nim\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`body\` text NULL, \`playlistLink\` varchar(255) NULL, \`price\` int NOT NULL, \`joinCode\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`orderId\` varchar(255) NOT NULL, \`courseId\` int NOT NULL, \`userId\` bigint NOT NULL, \`transcationId\` varchar(255) NOT NULL, \`transcationStatus\` varchar(255) NOT NULL, \`totalPrice\` int NOT NULL, \`orderAt\` datetime NOT NULL, PRIMARY KEY (\`orderId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_courses_owned_course\` (\`userNim\` bigint NOT NULL, \`courseId\` int NOT NULL, INDEX \`IDX_41073637d7718ba1b60e2958be\` (\`userNim\`), INDEX \`IDX_f1eab9a028c131bd104cdda52a\` (\`courseId\`), PRIMARY KEY (\`userNim\`, \`courseId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_course_created_course\` (\`userNim\` bigint NOT NULL, \`courseId\` int NOT NULL, INDEX \`IDX_315b355fb0b0e11792f7a45474\` (\`userNim\`), INDEX \`IDX_4569a0ef5f4cf91f2e978d04a1\` (\`courseId\`), PRIMARY KEY (\`userNim\`, \`courseId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_courses_course\` (\`categoryId\` int NOT NULL, \`courseId\` int NOT NULL, INDEX \`IDX_6568734260443c798f18a63d5f\` (\`categoryId\`), INDEX \`IDX_0ab70255e3fb3e53842c6a04bc\` (\`courseId\`), PRIMARY KEY (\`categoryId\`, \`courseId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_courses_owned_course\` ADD CONSTRAINT \`FK_41073637d7718ba1b60e2958be1\` FOREIGN KEY (\`userNim\`) REFERENCES \`user\`(\`nim\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_courses_owned_course\` ADD CONSTRAINT \`FK_f1eab9a028c131bd104cdda52a2\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_course_created_course\` ADD CONSTRAINT \`FK_315b355fb0b0e11792f7a45474c\` FOREIGN KEY (\`userNim\`) REFERENCES \`user\`(\`nim\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_course_created_course\` ADD CONSTRAINT \`FK_4569a0ef5f4cf91f2e978d04a1d\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_courses_course\` ADD CONSTRAINT \`FK_6568734260443c798f18a63d5f2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`category_courses_course\` ADD CONSTRAINT \`FK_0ab70255e3fb3e53842c6a04bcf\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category_courses_course\` DROP FOREIGN KEY \`FK_0ab70255e3fb3e53842c6a04bcf\``);
        await queryRunner.query(`ALTER TABLE \`category_courses_course\` DROP FOREIGN KEY \`FK_6568734260443c798f18a63d5f2\``);
        await queryRunner.query(`ALTER TABLE \`user_course_created_course\` DROP FOREIGN KEY \`FK_4569a0ef5f4cf91f2e978d04a1d\``);
        await queryRunner.query(`ALTER TABLE \`user_course_created_course\` DROP FOREIGN KEY \`FK_315b355fb0b0e11792f7a45474c\``);
        await queryRunner.query(`ALTER TABLE \`user_courses_owned_course\` DROP FOREIGN KEY \`FK_f1eab9a028c131bd104cdda52a2\``);
        await queryRunner.query(`ALTER TABLE \`user_courses_owned_course\` DROP FOREIGN KEY \`FK_41073637d7718ba1b60e2958be1\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`DROP INDEX \`IDX_0ab70255e3fb3e53842c6a04bc\` ON \`category_courses_course\``);
        await queryRunner.query(`DROP INDEX \`IDX_6568734260443c798f18a63d5f\` ON \`category_courses_course\``);
        await queryRunner.query(`DROP TABLE \`category_courses_course\``);
        await queryRunner.query(`DROP INDEX \`IDX_4569a0ef5f4cf91f2e978d04a1\` ON \`user_course_created_course\``);
        await queryRunner.query(`DROP INDEX \`IDX_315b355fb0b0e11792f7a45474\` ON \`user_course_created_course\``);
        await queryRunner.query(`DROP TABLE \`user_course_created_course\``);
        await queryRunner.query(`DROP INDEX \`IDX_f1eab9a028c131bd104cdda52a\` ON \`user_courses_owned_course\``);
        await queryRunner.query(`DROP INDEX \`IDX_41073637d7718ba1b60e2958be\` ON \`user_courses_owned_course\``);
        await queryRunner.query(`DROP TABLE \`user_courses_owned_course\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
