const WhitelistManager = artifacts.require("WhitelistManager");

contract("WhitelistManager", (accounts) => {
    const [owner, user] = accounts;

    it("should allow adding to the whitelist", async () => {
        const whitelist = await WhitelistManager.deployed();
        await whitelist.addAddressToWhitelist(user, { from: owner });
        assert.isTrue(await whitelist.isWhitelisted(user), "User should be whitelisted");
    });

    it("should allow removing from the whitelist", async () => {
        const whitelist = await WhitelistManager.deployed();
        await whitelist.removeAddressFromWhitelist(user, { from: owner });
        assert.isFalse(await whitelist.isWhitelisted(user), "User should not be whitelisted");
    });
});
