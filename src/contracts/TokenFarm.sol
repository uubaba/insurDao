pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";
import "./DaoToken.sol";
import "./DoppToken.sol";
import "./SafeMath.sol";

contract TokenFarm {
    string public name = "InsPound";
    address private owner;
    DappToken public dappToken;
    DaiToken public daiToken;
    DaoToken public daoToken;
    DoppToken public doppToken;

    using SafeMath for uint256;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    address[] public stakers;

    constructor(
        DappToken _dappToken,
        DaiToken _daiToken,
        DaoToken _daoToken,
        DoppToken _doppToken
    ) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        daoToken = _daoToken;
        doppToken = _doppToken;
        owner = msg.sender;
    }

    function stakeDaiToken(uint256 _daiamount) public {
        require(_daiamount > 0, "daiamount cannot be 0");
        daiToken.transferFrom(msg.sender, address(this), _daiamount);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _daiamount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    function stakeDaoToken(uint256 _daoamount) public {
        require(_daoamount > 0, "daoamount cannot be 0");
        daoToken.transferFrom(msg.sender, address(this), _daoamount);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _daoamount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    function unstakeToken(uint count) public{
        uint256 balance = stakingBalance[msg.sender];
        if(balance == count){
            unstakeTokens();
        }else if(balance > count){
                daiToken.transfer(msg.sender, count);
                stakingBalance[msg.sender] = balance - count;  
        }       
    }


    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance cannot be 0");
        daiToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }


    function issueToken(uint256 Ratio) public returns(uint256 feed){
        require(msg.sender == owner, "caller must be the owner");
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            uint256 DAPPFENHONG = balance.mul(Ratio);
            uint256 DOPPFENHONG = balance.mul(Ratio);
            if (balance > 0) {
                dappToken.transfer(recipient, (DAPPFENHONG / 100));
                doppToken.transfer(recipient, (DOPPFENHONG / 100));
                if(msg.sender == recipient){
                    feed = DAPPFENHONG / 100;
                }
            }
        }

    }

    function issueToken(uint256 Ratio, uint256 Ratio2)
        public
        returns (uint256)
    {
        require(msg.sender == owner, "caller must be the owner");
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            uint256 DAPPFENHONG = balance.mul(Ratio);
            uint256 DOPPFENHONG = balance.mul(Ratio2);
            if (balance > 0) {
                dappToken.transfer(recipient, (DAPPFENHONG / 100));
                doppToken.transfer(recipient, (DOPPFENHONG / 100));
            }
        }
    }



}
