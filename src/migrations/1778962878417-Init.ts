import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778962878417 implements MigrationInterface {
    name = 'Init1778962878417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_0483ccbf84f12cc70caff7b9075\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_0483ccbf84f12cc70caff7b9075\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_0483ccbf84f12cc70caff7b9075\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_0483ccbf84f12cc70caff7b9075\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
