'use strict';

import expectThrow from '../submodules/openzeppelin-solidity/test/helpers/expectThrow';

const BigNumber = web3.BigNumber;
const chai =require('chai');
chai.use(require('chai-bignumber')(BigNumber));
chai.use(require('chai-as-promised')); // Order is important
chai.should();

const MoneyBox = artifacts.require("MoneyBox");

contract('MoneyBox', function(accounts) {
	const acc = {anyone: accounts[0], owner: accounts[1], anyoneElse: accounts[2]};
	beforeEach(async function () {
		this.inst = await MoneyBox.new({from: acc.owner});
	});

	it('should have zero balance for any non-existing account', function() {
		this.inst.myBalance({from: acc.owner}).should.eventually.be.bignumber.equal(0);
		this.inst.myBalance({from: acc.anyone}).should.eventually.be.bignumber.equal(0);
	});

	it('should refuse to accept money in myBalance, etc', async function() {
		const someEther = web3.toWei('10', 'finney')
		await expectThrow(this.inst.myBalance({from: acc.anyone, value: someEther}));
	});

	it('should allow set Goal sum and read own Goal', function() {
		const sumToReach = web3.toWei('100', 'finney');
		this.inst.setGoal(sumToReach, {from: acc.anyone}).should.eventually.be.fulfilled;
		this.inst.myGoal({from: acc.anyone}).should.eventually.be.bignumber.equal(sumToReach);
	});

	it('should only allow to increase goal amount after it was set, but not to decrease it', async function() {
		const sumToReach = web3.toWei('100', 'finney');
		await this.inst.setGoal(sumToReach, {from: acc.anyone});
		await this.inst.setGoal(sumToReach, {from: acc.anyone}).should.be.rejected;
		await expectThrow(this.inst.setGoal(sumToReach, {from: acc.anyone}));

		const largerSumToReach = sumToReach + web3.toWei('1', 'finney');
		await this.inst.setGoal(largerSumToReach, {from: acc.anyone});

		const updatedGoal = await this.inst.myGoal({from: acc.anyone});
		updatedGoal.should.be.bignumber.equal(largerSumToReach);
	});

	it('should refuse to accept money for non-existing account', async function() {
		const someEther = web3.toWei('10', 'finney');
		await expectThrow(this.inst.addMoney({from: acc.anyone, value: someEther}));
	});

	it('should accept money if goal is set but not reached', async function() {
		const goalAmount = web3.toWei('1000', 'finney');
		await this.inst.setGoal(goalAmount, {from: acc.anyone});
		const paymentAmount = web3.toWei('10', 'finney');
		await this.inst.addMoney({from: acc.anyone, value: paymentAmount});

		const contractBalance = web3.eth.getBalance(this.inst.address)
		contractBalance.should.be.bignumber.equal(paymentAmount);

		const balance = await this.inst.myBalance({from: acc.anyone});
		balance.should.be.bignumber.equal(paymentAmount);
	});

	it('should increase account balance after few payments', async function() {
		const goalAmount = web3.toWei('1000', 'finney');
		await this.inst.setGoal(goalAmount, {from: acc.anyone});
		const paymentAmount = web3.toWei('10', 'finney');
		await this.inst.addMoney({from: acc.anyone, value: paymentAmount});
		await this.inst.addMoney({from: acc.anyone, value: paymentAmount});
		await this.inst.addMoney({from: acc.anyone, value: paymentAmount});

		const balance = await this.inst.myBalance({from: acc.anyone});
		const expectedBalance = web3.toWei('30', 'finney');
		balance.should.be.bignumber.equal(expectedBalance);
	});

	it('should refuse to accept money after goal has been reached', async function() {
		const goalAmount = web3.toWei('1000', 'finney');
		await this.inst.setGoal(goalAmount, {from: acc.anyone});
		await this.inst.addMoney({from: acc.anyone, value: goalAmount});
		const smallAmount = web3.toWei('1', 'wei');
		await expectThrow(this.inst.addMoney({from: acc.anyone, value: smallAmount}));
	});

	it('should refuse to withdraw if there is no account', async function() {
		await expectThrow(this.inst.withdraw({from: acc.anyone}));
	});

	it('should refuse to withdraw if account has no money', async function() {
		const goalAmount = web3.toWei('1000', 'finney');
		await this.inst.setGoal(goalAmount, {from: acc.anyone});

		await expectThrow(this.inst.withdraw({from: acc.anyone}));
	});

	it('should refuse to withdraw unless goal is reached', async function() {
		const goalAmount = web3.toWei('1000', 'finney');
		await this.inst.setGoal(goalAmount, {from: acc.anyone});
		const someEther = web3.toWei('10', 'finney')
		await this.inst.addMoney({from: acc.anyone, value: someEther});

		await expectThrow(this.inst.withdraw({from: acc.anyone}));
	});

	it('should let withdraw if goal is reached', async function() {
		const goalAmount = web3.toWei('1000', 'finney');
		await this.inst.setGoal(goalAmount, {from: acc.anyone});
		const goalAndSomeMoreAmount = web3.toWei('1001', 'finney')
		await this.inst.addMoney({from: acc.anyone, value: goalAndSomeMoreAmount});

		await this.inst.withdraw({from: acc.anyone});
		const contractBalance = web3.eth.getBalance(this.inst.address)
		contractBalance.should.be.bignumber.zero;

		const balanceAfterWithdrawal = await this.inst.myBalance({from: acc.anyone});
		balanceAfterWithdrawal.should.be.bignumber.zero;

		const goalAfterWithdrawal = await this.inst.myGoal({from: acc.anyone})
		goalAfterWithdrawal.should.be.bignumber.zero;
	});

});

