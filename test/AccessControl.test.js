const AccessControl = artifacts.require("AccessControl");

contract("AccessControl", (accounts) => {
    const [owner, user] = accounts;

    it("should assign a role", async () => {
        const accessControl = await AccessControl.deployed();
        await accessControl.assignRole(user, 2, { from: owner }); // Assuming 2 is a role identifier
        assert.equal(await accessControl.roles(user), 2, "Role was not assigned correctly");
    });

    it("should revoke a role", async () => {
        const accessControl = await AccessControl.deployed();
        await accessControl.revokeRole(user, { from: owner });
        assert.equal(await accessControl.roles(user), 0, "Role was not revoked correctly");
    });
});
