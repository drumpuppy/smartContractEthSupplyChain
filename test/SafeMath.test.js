const SafeMath = artifacts.require('./SafeMath.sol');

contract('SafeMath', (accounts) => {
  let safeMath;

  before(async () => {
    safeMath = await SafeMath.deployed();
  });

  describe('addition', () => {
    it('adds two numbers correctly', async () => {
      let a = 123;
      let b = 456;
      let result = await safeMath.add(a, b);
      
      assert.equal(result.toNumber(), a + b, 'adds two numbers');
    });

    it('throws an error on addition overflow', async () => {
      let a = web3.utils.toBN('115792089237316195423570985008687907853269984665640564039457584007913129639935'); // 2^256 - 1
      let b = 1;
      try {
        await safeMath.add(a, b);
        assert.fail('expected to throw');
      } catch (error) {
        assert.include(error.message, 'revert', 'expected overflow error');
      }
    });
  });

  describe('subtraction', () => {
    it('subtracts two numbers correctly', async () => {
      let a = 456;
      let b = 123;
      let result = await safeMath.sub(a, b);
      
      assert.equal(result.toNumber(), a - b, 'subtracts two numbers');
    });

    it('throws an error on subtraction underflow', async () => {
      let a = 123;
      let b = 456;
      try {
        await safeMath.sub(a, b);
        assert.fail('expected to throw');
      } catch (error) {
        assert.include(error.message, 'revert', 'expected underflow error');
      }
    });
  });

  // Add more tests for multiplication, division, etc.
});

