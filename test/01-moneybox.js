'use strict';

import expectThrow from '../submodules/openzeppelin-solidity/test/helpers/expectThrow';

const MoneyBox = artifacts.require("MoneyBox");

contract('MoneyBox', function(accounts) {
	const acc = {anyone: accounts[0], owner: accounts[1]};
	let inst;
	it('should deploy', async() => {
		inst = await MoneyBox.new({from: acc.owner});
	});
});

