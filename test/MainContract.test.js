const MainContract = artifacts.require("MainContract");

contract("MainContract", (accounts) => {
    const [owner, manufacturer, unauthorizedUser] = accounts;

    before(async () => {
        const main = await MainContract.deployed();
        // Adding manufacturer to the whitelist before the tests
        await main.addToWhitelist(manufacturer, { from: owner });
    });

    it("should allow whitelisted manufacturer to create a product", async () => {
        const main = await MainContract.deployed();
        await main.createNewProduct("Integration Product", 1, 100, manufacturer, { from: owner });
        const product = await main.getProductDetails(0);
        assert.equal(product.name, "Integration Product", "Product name does not match the expected value");
        assert.equal(product.totalPerLot, 100, "Total per lot does not match the expected value");
    });

    it("should not allow unauthorized users to create a product", async () => {
        const main = await MainContract.deployed();
        try {
            await main.createNewProduct("Unauthorized Product", 2, 50, unauthorizedUser, { from: unauthorizedUser });
            assert.fail("The product creation should have thrown an error");
        } catch (error) {
            assert.include(error.message, "revert", "The error message should contain 'revert'");
        }
    });

    it("should transfer product ownership correctly", async () => {
        const main = await MainContract.deployed();
        // First, we need to ensure the product exists
        await main.createNewProduct("Transferable Product", 3, 150, manufacturer, { from: owner });
        let product = await main.getProductDetails(1);
        assert.equal(product.currentOwner, manufacturer, "Initially, the manufacturer should be the owner");

        // Transfer ownership to a new owner
        await main.transferProduct(1, unauthorizedUser, { from: owner });
        product = await main.getProductDetails(1);
        assert.equal(product.currentOwner, unauthorizedUser, "Ownership was not transferred correctly");
    });
});
