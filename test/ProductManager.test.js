const ProductManager = artifacts.require("ProductManager");

contract("ProductManager", (accounts) => {
    const [owner, manufacturer] = accounts;

    it("should create a product", async () => {
        const productManager = await ProductManager.deployed();
        await productManager.createProduct("Test Product", 1, 100, manufacturer, { from: owner });
        const product = await productManager.getProductDetails(0);
        assert.equal(product.name, "Test Product", "Product was not created correctly");
    });
});
