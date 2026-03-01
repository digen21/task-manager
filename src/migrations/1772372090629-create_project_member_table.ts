import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectMemberTable1772372090629 implements MigrationInterface {
    name = 'CreateProjectMemberTable1772372090629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`user_organization_fkey_id\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_a9a5a9fada64fc56e2aaf2f9464\``);
        await queryRunner.query(`CREATE TABLE \`project_members\` (\`id\` varchar(36) NOT NULL, \`project\` varchar(255) NOT NULL, \`user\` varchar(255) NOT NULL, \`role\` enum ('ADMIN', 'MEMBER') NOT NULL, UNIQUE INDEX \`IDX_b50ff199e37d2d0dcefc12029a\` (\`project\`, \`user\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`organizationId\``);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`deleted_at\` \`deleted_at\` datetime NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4e954dcb12475f988a9b78071e\` ON \`projects\` (\`organization\`, \`name\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`user_organization_fkey_id\` FOREIGN KEY (\`organization\`) REFERENCES \`organizations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_6c1194595ddf21fb9ba310e8450\` FOREIGN KEY (\`project\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_1cff889e9726a8853de45c5b37d\` FOREIGN KEY (\`user\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_1cff889e9726a8853de45c5b37d\``);
        await queryRunner.query(`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_6c1194595ddf21fb9ba310e8450\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`user_organization_fkey_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_4e954dcb12475f988a9b78071e\` ON \`projects\``);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`organizationId\` varchar(36) NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_b50ff199e37d2d0dcefc12029a\` ON \`project_members\``);
        await queryRunner.query(`DROP TABLE \`project_members\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_a9a5a9fada64fc56e2aaf2f9464\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organizations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`user_organization_fkey_id\` FOREIGN KEY (\`organization\`) REFERENCES \`organizations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
