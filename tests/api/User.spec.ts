import { UserModel } from "../../packages/app-server/src/api/models";
import * as dbHandler from "./dbHandler";

const describeif = condition => condition ? describe : describe.skip;

describeif(process.env.CI)("User model", () => {
    /** Подключаемcя к базе перед тестами. */
    beforeAll(async () => await dbHandler.dbConnection());

    /** Чистим коллекции после каждого теста. */
    afterEach(async () => await dbHandler.clearDatabase());

    /** Отключаемся от базы после всех тестов. */
    afterAll(async () => await dbHandler.closeDatabase());

    const commonUserData = {
        nickname: "John Doe",
        uid: 1,
        social: "vk"
    };

    it("should creates a User document", async () => {
        const user = await UserModel.create(commonUserData);

        expect(user.nickname).toEqual(commonUserData.nickname);
        expect(user.uid).toEqual(commonUserData.uid);
        expect(user.social).toEqual(commonUserData.social);
    });

    it("should finds a User document", async () => {
        await UserModel.create(commonUserData);
        const user = await UserModel.findOne({ uid: commonUserData.uid });

        expect(user.nickname).toEqual(commonUserData.nickname);
    });

    it("should not creates User document", async () => {
        const create = async () => {
            let notValidUserData = { ...commonUserData }
            notValidUserData.social = "someNotValodSocial";

            await UserModel.create(notValidUserData);
        }

        expect(create()).rejects.toThrow();
    });
});
