pragma solidity ^0.4.20;

contract SafeMath {
    function safeAdd(uint256 a, uint256 b) public pure returns (uint256 c) {
        c = a + b;
        require(c >= a, "an overflow occured");
    }
    function safeSub(uint256 a, uint256 b) public pure returns (uint256 c) {
        require(b <= a, "can't end up with negative value");
        c = a - b;
    }
    function safeMul(uint256 a, uint256 b) public pure returns (uint256 c) {
        c = a * b;
        require(a == 0 || c / a == b, "results exceeded 256 bits");
    }
    function safeDiv(uint256 a, uint256 b) public pure returns (uint256 c) {
        require(b > 0, "can't end up with negative value");
        c = a / b;
    }
}

contract SimpleGetSet is SafeMath {

    // contract creator address
    address public owner;
    // my own address
    address public myself;

    // Non-Compatible ERC20 simulator - just a random token book-keeping impl.
    mapping (address => uint256) _balances;
    string public name = "TestContract";
    string public symbol = "TDD";
    uint256 public constant TOTALSUPPLY = 1000000; // 1M
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

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenAmount);
    event Approval(address indexed _owner, address indexed _spender, uint256 _tokenAmount);
    event GiveTokens(address indexed buyer, uint256 qtumSent, uint256 giveTokens);
    event SaleRecord(address indexed buyer, string product);

    constructor() public {
        owner = msg.sender;
        myself = address(this);
        _balances[myself] = TOTALSUPPLY;
        if(exchangeRate < 0) revert("exchange rate cannot be negative");
    }

    // return what you buy with the wallet address
    function you_bought(address wallet) external view returns (string) {
        require(wallet != 0, "null address cannot be queried");
        return bought[wallet];
    }

    function sell_to(string product) external payable {
        require(bytes(product).length > 0, "cannot sell empty product, scam");
        require(sold_to[product] == 0, "product still available in stock"); // new sale only
        bought[msg.sender] = product; // you buy product
        sold_to[product] = msg.sender; // product sold to address
        emit SaleRecord(msg.sender, product);
        transfer(msg.sender, defaultCoupon);
    }

    function balanceOf(address _tokenOwner) public view returns (uint256) {
        return _balances[_tokenOwner];
    }

   // tokenAmount is by token, 1 qtum = 100 tokens
    function transfer(address toAddr, uint256 tokenAmount) public returns (bool) {
        if (tokenAmount == 0) {
            emit Transfer(msg.sender, toAddr, tokenAmount);    // Follow the spec to fire the event when transfer 0
            return;
        }
        
        // This overflow rarely happens or should never happen
        if (safeAdd(_balances[toAddr], tokenAmount) < _balances[toAddr]) {
            revert("the token receiver balance overflow and result in negative balance");
            return false;
        }
        
        _balances[myself] = safeSub(_balances[myself], tokenAmount);
        _balances[toAddr] = safeAdd(_balances[toAddr], tokenAmount);
        emit Transfer(myself, toAddr, tokenAmount);
        return true;
    }

    function givemetokens() public payable {
        uint256 tokens = safeDiv(safeMul(msg.value, 10**decimals), exchangeRate);
        require(tokens > 0, "something went wrong on our math, token value negative");
        transfer(msg.sender, tokens);
    }

    function () public payable {
        givemetokens();
    }

    function ownerKill() public restricted {
        selfdestruct(owner);
    }
}
