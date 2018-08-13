pragma solidity ^0.4.20;

import "./SimpleCoupons.sol";

contract SimpleShopping is SafeMath {

    address public owner;
    address public exchanging_fake_token_addr;
    uint256 public exchangeRate = 10**16;
    uint256 public constant decimals = 18;
    uint8 constant defaultCoupon = 168; // you buy stuff, we give you tokens ^_^
    uint8 constant defaultRecord = 1; // inventory is 1 for each product
    mapping (address => string) private bought;
    mapping (string => address) private sold_to;

    modifier restricted() {
        if (msg.sender != owner) {
            revert("caller is not contract owner");
        }
        _;
    }

    event GiveTokens(address indexed buyer, uint256 qtumSent, uint256 giveTokens);
    event SaleRecord(address indexed buyer, string product);

    constructor(address _ex_tok_addr) public {
        if (_ex_tok_addr == 0x0) revert("cannot interact with null contract");
        owner = msg.sender;
        exchanging_fake_token_addr = _ex_tok_addr;
        if(exchangeRate < 0) revert("exchange rate cannot be negative");
    }

    function current_currency() public view returns (address tok_addr) {
        return exchanging_fake_token_addr;
    }

    // return what you buy with the wallet address
    function you_bought(address wallet) external view returns (string) {
        require(wallet != 0, "null address cannot be queried");
        return bought[wallet];
    }

    function sell_to(string product) external payable returns (bool) {
        require(bytes(product).length > 0, "cannot sell empty product, scam");
        require(sold_to[product] == 0, "product still available in stock"); // new sale only
        bought[msg.sender] = product; // you buy product
        sold_to[product] = msg.sender; // product sold to address
        emit SaleRecord(msg.sender, product);
        if (InterfaceExample(exchanging_fake_token_addr).transfer(msg.sender, defaultCoupon)) {
            emit GiveTokens(msg.sender, msg.value, defaultCoupon);
        }
    }

    function givemetokens() public payable {
        uint256 tokens = safeDiv(safeMul(msg.value, 10**decimals), exchangeRate);
        require(tokens > 0, "something went wrong on our math, token value negative");
        if (InterfaceExample(exchanging_fake_token_addr).transfer(msg.sender, tokens)) {
            emit GiveTokens(msg.sender, msg.value, tokens);
        }
    }

    function () public payable {
        givemetokens();
    }

    function ownerKill() public restricted {
        selfdestruct(owner);
    }
}
