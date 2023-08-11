import { test, describe, beforeAll, afterAll, expect, } from "vitest";
import { GenericContainer,StartedTestContainer } from "testcontainers";
import { configDataSource, AppDataSource } from "../src/Shared_infra/data-source";
import { User } from "../src/User/infra/User";
import { Repository } from "typeorm";

describe('Functions related to the user', async () => {
    var container: StartedTestContainer; 
    var repo: Repository<User>;

    beforeAll(async () => {
        container = await new GenericContainer("mysql")
            .withExposedPorts(3306)
            .withEnvironment({ MYSQL_ROOT_PASSWORD: '123456', MYSQL_DATABASE: 'test' })
            .start();

        configDataSource(container.getHost(), container.getMappedPort(3306));
        await AppDataSource.initialize();

        repo = AppDataSource.getRepository(User);

        await repo.createQueryBuilder()
            .insert()
            .into(User)
            .values([
                { username: 'johndoe', passwd: 'password123', email: 'johndoe@example.com' },
                { username: 'janedoe', passwd: 'password456', email: 'janedoe@example.com' },
                { username: 'bobsmith', passwd: 'password789', email: 'bobsmith@example.com' }
            ])
            .execute();
    }, 30000)

    afterAll(async () => {
        await container.stop();
    });

    test('start', async () => {
        const user = await repo.findOneBy({ passwd: 'password123' });
        expect(user.id).toBe(1)
    })
})