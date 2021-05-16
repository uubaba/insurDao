pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";
import "./SafeMath.sol";
import "./TokenFarm.sol";

contract InsuranceFarm {
    string public name = "Insur Token Farm";
    address private owner;
    DappToken public dappToken;
    DaiToken public daiToken;
    TokenFarm public tokenFarm;


    using SafeMath for uint256;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    address[] public stakers;

    constructor(
        DappToken _dappToken,
        DaiToken _daiToken,
        TokenFarm _tokenFarm
    ) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        tokenFarm = _tokenFarm;
        owner = msg.sender;
    }
    
    //当前用户所有抵押的保单 及 开始日期
    mapping(string=>bool) insur_mapping;

    //这是保险公司委托,其实是用户委托，
    function delegateStakeDaiToken(address user,string memory insur_id,uint256 _daiamount) public{
        require(_daiamount > 0, "daiamount cannot be 0");
        require(insur_mapping[insur_id] == false,'insurance already stake');
        //给用户质押股份占比
        stakingBalance[user] = stakingBalance[user] + _daiamount;

        if (!hasStaked[user]) {
            stakers.push(user);
        }
        insur_mapping[insur_id] = true;
        hasStaked[user] = true;
        isStaking[user] = true;
        tokenFarm.stakeDaiToken(_daiamount);
        tokenFarm.stakeDaoToken(_daiamount);

    }

    function untakeTokens(address user,string memory insur_id) public {
        uint256 balance = stakingBalance[user];
        require(balance > 0, "staking balance cannot be 0");

        stakingBalance[user] = 0;
        isStaking[user] = false;
        delete insur_mapping[insur_id];
        tokenFarm.unstakeTokens();
    }

    function issueToken(uint Ratio)
        public
        returns (uint256)
    {
        require(msg.sender == owner, "caller must be the owner");
        uint amount =  tokenFarm.issueToken(Ratio);
        require(amount > 0, "Nothing");
        uint total = 0;
        for(uint256 j=0;j<stakers.length;j++){
            address recipient = stakers[j];
            uint256 balance = stakingBalance[recipient];
            total = SafeMath.add(total,balance);
        }
        Ratio = total / amount;

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            uint256 DAPPFENHONG = balance.mul(Ratio);
            if (balance > 0) {
                dappToken.transfer(recipient, (DAPPFENHONG / 100));
            }
        }
    }



}  