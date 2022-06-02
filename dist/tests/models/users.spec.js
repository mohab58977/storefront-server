"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../../models/users");
const UserStoreInstance = new users_1.UserStore();
describe("User Model", () => {
    const user = {
        firstname: "Hans",
        lastname: "Meier",
        password: "password123"
    };
    async function createUser(user) {
        return UserStoreInstance.create(user);
    }
    async function deleteUser(id) {
        return UserStoreInstance.delete(id);
    }
    it("should have an index method", () => {
        expect(UserStoreInstance.index).toBeDefined();
    });
    it("should have a create method", () => {
        expect(UserStoreInstance.create).toBeDefined();
    });
    it("should have a remove method", () => {
        expect(UserStoreInstance.delete).toBeDefined();
    });
    it("create method should create a user", async () => {
        const createdUser = await createUser(user);
        const firstname = createdUser.firstname;
        const lastname = createdUser.lastname;
        if (createdUser) {
            expect(firstname).toBe(user.firstname);
            expect(lastname).toBe(user.lastname);
        }
        await deleteUser(createdUser.user_id);
    });
    it("index method should return a list of users", async () => {
        const createdUser = await createUser(user);
        const userList = await UserStoreInstance.index();
        expect(userList).toEqual([createdUser]);
        await deleteUser(createdUser.user_id);
    });
    it("remove method should remove the user", async () => {
        const createdUser = await createUser(user);
        await deleteUser(createdUser.user_id);
        const userList = await UserStoreInstance.index();
        expect(userList).toEqual([]);
    });
    it("authenticates the user with a password", async () => {
        const createdUser = await createUser(user);
        const userFromDb = await UserStoreInstance.authenticate(user);
        if (userFromDb) {
            const { firstname, lastname } = userFromDb;
            expect(firstname).toBe(user.firstname);
            expect(lastname).toBe(user.lastname);
        }
        await deleteUser(createdUser.id);
    });
});
