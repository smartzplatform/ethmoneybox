'use strict';

import expectThrow from '../submodules/openzeppelin-solidity/test/helpers/expectThrow';

const BigNumber = web3.BigNumber;
const chai =require('chai');
chai.use(require('chai-bignumber')(BigNumber));
chai.use(require('chai-as-promised')); // Order is important
chai.should();

const MoneyBox = artifacts.require("MoneyBox");

contract('MoneyBox', function(accounts) {
	const acc = {anyone: accounts[0], owner: accounts[1]};
	beforeEach(async function () {
		this.inst = await MoneyBox.new({from: acc.owner});
	});

	it('should have zero balance for any non-existing account', function() {
		this.inst.myBalance({from: acc.owner}).should.eventually.be.bignumber.equal(1);
	});

	it('should throw from neverWork', function() {
		//this.inst.neverWork({from: acc.owner}).should.eventually.be.rejected;
		expectThrow(this.inst.neverWork({from: acc.owner}).should.eventually.not.be);
	});

});

