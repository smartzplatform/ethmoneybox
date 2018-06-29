from smartz.api.constructor_engine import ConstructorInstance


class Constructor(ConstructorInstance):

    def get_version(self):
        return {
            "result": "success",
            "version": 1
        }

    def get_params(self):
        json_schema = {
            "type": "object",
            "required": [
                "name"
            ],
            "additionalProperties": False,

            "properties": {
                "name": {
                    "title": "Some text to make contract code unique",
                    "description": "type anything in english here",
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 200,
                    "pattern": "^[a-zA-Z0-9,\.\? ]+$"
                },

                #"variants": {
                #    "title": "Variants",
                #    "description": "List of answer variants. One account can vote only for one variant",
                #    "type": "array",
                #    "minItems": 1,
                #    "maxItems": 100,
                #    "items": {
                #        "title": "Variant",
                #        "type": "string",
                #        "minLength": 1,
                #        "maxLength": 200,
                #        "pattern": "^[a-zA-Z0-9,\.\? ]+$"
                #    }
                #}

            }
        }

        ui_schema = {}

        return {
            "result": "success",
            "schema": json_schema,
            "ui_schema": ui_schema
        }

    def construct(self, fields):
        #variants_code = ''

        #for variant_id, variant in enumerate(fields['variants']):
        #    variants_code += """
        #        variants.push('{variant_descr}');variantIds[sha256('{variant_descr}')] = {variant_id};
        #    """.format(
        #        variant_descr=variant,
        #        variant_id=variant_id+1
        #    )

        source = self.__class__._TEMPLATE \
            .replace('%name%', fields['name']) \
        #    .replace('%variants_code%', variants_code)

        return {
            "result": "success",
            'source': source,
            'contract_name': "MoneyBox"
        }

    def post_construct(self, fields, abi_array):

        function_titles = {
            'myBalance': {
                'title': 'My balance',
                'description': 'how much ether in my moneybox'
            },

            'myGoal': {
                'title': 'My goal',
                'description': 'how much ether I want to accumulate'
            },


            'addMoney': {
                'title': 'Add ether',
                'description': 'Add some ether to my balance to get closer to my goal',
            },

        }

        return {
            "result": "success",
            'function_specs': function_titles,
            'dashboard_functions': ['ballotName', 'getWinningVariantId', 'getWinningVariantName', 'getWinningVariantVotesCount']
        }


    # language=Solidity
    _TEMPLATE = """
pragma solidity ^0.4.20;

contract MoneyBox {

	mapping (address => uint256) public goals;
	mapping (address => uint256) public deposits;

	event GoalSet(uint256 amount, address account);
	event MoneyAdded(uint256 amount, uint256 deposit, address account);
	event MoneyTaken(uint256 amount, address account);

	function myBalance() view public returns (uint256) {
		return deposits[msg.sender];
	}

	function setGoal(uint256 _amount) public {
		require(goals[msg.sender] < _amount);
		goals[msg.sender] = _amount;
		GoalSet(_amount, msg.sender);
	}

	function myGoal() view public returns (uint256) {
		return goals[msg.sender];
	}

	function addMoney() public payable {
		require(goals[msg.sender] > 0);
		require(goals[msg.sender] > deposits[msg.sender]);
		deposits[msg.sender] += msg.value;
		MoneyAdded(msg.value, deposits[msg.sender], msg.sender);
	}

	function withdraw() public {
		require(goals[msg.sender] > 0);
		require(deposits[msg.sender] > 0);
		require(deposits[msg.sender] >= goals[msg.sender]);

		uint256 depositAmount = deposits[msg.sender];
		delete deposits[msg.sender];
		delete goals[msg.sender];

		msg.sender.transfer(depositAmount);
		MoneyTaken(depositAmount, msg.sender);
	}

}
    """
