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

interface InterfaceExample {
    function balanceOf(address _tokenOwner) external view returns (uint256 _balance);
    function transfer(address _toAddr, uint256 _tokenAmount) external returns (bool success);
    event Transfer(address indexed _from, address indexed _to, uint256 _tokenAmount);
    event Approval(address indexed _owner, address indexed _spender, uint256 _tokenAmount);
}

// Provides TDD tokens
contract SimpleCoupons is SafeMath, InterfaceExample {
    
    address public owner;
    mapping (address => uint256) _balances;
    string public name = "TestContract";
    string public symbol = "TDD";
    uint256 public constant TOTALSUPPLY = 10 ** 18 * 1000000; // !M
    uint8 public constant decimals = 18;
    uint256 exchangeRate = 10 ** 16; // 1 qtum - 100 fun

    modifier restricted() {
        if (msg.sender != owner) {
            revert("caller is not contract owner");
        }
        _;
    }

    constructor() public {
        owner = msg.sender;
        // creator gets 50% of token, contract keeps 50% token for trading
        _balances[msg.sender] = TOTALSUPPLY;
        emit Transfer(address(0), msg.sender, TOTALSUPPLY);
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

        if (_balances[msg.sender] < tokenAmount) {
            revert("caller does not have sufficient token");
            return false;
        }
        
        // This overflow rarely happens or should never happen
        if (safeAdd(_balances[toAddr], tokenAmount) < _balances[toAddr]) {
            revert("the token receiver balance overflow and result in negative balance");
            return false;
        }
        
        _balances[msg.sender] = safeSub(_balances[msg.sender], tokenAmount);
        _balances[toAddr] = safeAdd(_balances[toAddr], tokenAmount);
        emit Transfer(msg.sender, toAddr, tokenAmount);
        return true;
    }

    /**
     * Prevent Qtum coming in by accident
     */
    function () public payable {
        revert("somebody is sending me free qtum, i don't want it, really?");
    }

    function terminate() public restricted {
        selfdestruct(owner);
    }
}
