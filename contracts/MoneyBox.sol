pragma solidity ^0.4.23;

contract MoneyBox {

	function myBalance() pure public returns (uint256) {
		return uint256(1);
	}

	function neverWork() pure public {
		revert();
	}
}
