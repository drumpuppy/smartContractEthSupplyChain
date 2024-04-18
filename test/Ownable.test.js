const Ownable = artifacts.require("Ownable");

contract("Ownable", (accounts) => {
    const [owner, newOwner] = accounts;

    it("should set the creator as the owner", async () => {
        const ownableInstance = await Ownable.deployed();
        assert.equal(await ownableInstance.owner(), owner, "The owner is incorrectly set");
    });

    it("should transfer ownership", async () => {
        const ownableInstance = await Ownable.deployed();
        await ownableInstance.transferOwnership(newOwner, { from: owner });
        assert.equal(await ownableInstance.owner(), newOwner, "Ownership has not been transferred");
    });
});
