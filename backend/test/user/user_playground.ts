import { GenericContainer, StartedTestContainer } from "testcontainers";
import { configDataSource, AppDataSource } from "../../src/Shared_infra/data-source";
import { User } from "../../src/User/infra/User";
import { MySqlContainer } from "testcontainers";

(async () => {
    var container = await new GenericContainer("mysql")
        .withExposedPorts(3306)
        .withEnvironment({ MYSQL_ROOT_PASSWORD: '123456', MYSQL_DATABASE: 'test'})
        .start();

    configDataSource(container.getHost(), container.getMappedPort(3306));
    await AppDataSource.initialize();

    const repo = await AppDataSource.getRepository(User);

    await repo.createQueryBuilder()
        .insert()
        .into(User)
        .values([
            { username: 'johndoe', passwd: 'password123', email: 'johndoe@example.com' },
            { username: 'janedoe', passwd: 'password456', email: 'janedoe@example.com' },
            { username: 'bobsmith', passwd: 'password789', email: 'bobsmith@example.com' }
        ])
        .execute();

    const users = await repo.find();
    console.log(users);

    container.stop();
})()









