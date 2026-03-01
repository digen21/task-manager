import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDueDateInTask1772388283170 implements MigrationInterface {
    name = 'AddDueDateInTask1772388283170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity_logs\` DROP FOREIGN KEY \`activity_logs_performed_by_fkey_id\``);
        await queryRunner.query(`ALTER TABLE \`activity_logs\` DROP FOREIGN KEY \`activity_logs_task_fkey_id\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`due_date\` datetime NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`task_due_date_idx\` ON \`tasks\` (\`due_date\`)`);
        await queryRunner.query(`ALTER TABLE \`activity_logs\` ADD CONSTRAINT \`activity_logs_task_fkey_id\` FOREIGN KEY (\`task\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_logs\` ADD CONSTRAINT \`activity_logs_performed_by_fkey_id\` FOREIGN KEY (\`performed_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity_logs\` DROP FOREIGN KEY \`activity_logs_performed_by_fkey_id\``);
        await queryRunner.query(`ALTER TABLE \`activity_logs\` DROP FOREIGN KEY \`activity_logs_task_fkey_id\``);
        await queryRunner.query(`DROP INDEX \`task_due_date_idx\` ON \`tasks\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`due_date\``);
        await queryRunner.query(`ALTER TABLE \`activity_logs\` ADD CONSTRAINT \`activity_logs_task_fkey_id\` FOREIGN KEY (\`task\`) REFERENCES \`tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity_logs\` ADD CONSTRAINT \`activity_logs_performed_by_fkey_id\` FOREIGN KEY (\`performed_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
