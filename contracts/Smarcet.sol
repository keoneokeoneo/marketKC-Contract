pragma solidity >=0.4.25 <0.7.0;

contract Smarcet {
    address payable platform;

    // 하나의 거래 객체
    struct Trade {
        address payable seller;
        address payable buyer;
        uint256 price;
        uint8 stage;
        bool isOpen;
    }

    mapping(uint256 => Trade) Trades;

    // 생성자
    constructor() public {
        platform = tx.origin;
    }

    // 해당 인덱스를 사용할 수 있는지 검사
    modifier creatable(uint256 _id) {
        require(
            Trades[_id].isOpen == false && Trades[_id].stage == 0,
            "This trade is using now"
        );
        _;
    }

    // 플랫폼만 이용 가능
    modifier onlyPlatform() {
        require(msg.sender == platform, "Only platform is available");
        _;
    }

    // 구매자만 이용 가능
    modifier onlyBuyer(uint256 _id) {
        require(
            msg.sender == Trades[_id].buyer,
            "You are not the buyer in this trade"
        );
        _;
    }

    event CreateTrade(
        uint256 _id,
        address indexed _seller,
        address indexed _buyer,
        uint256 _price
    );

    event Transfer(
        uint256 _id,
        address indexed _from,
        address indexed _to,
        uint256 _price
    );

    // 새로운 거래 생성 함수
    function createTrade(
        uint256 _id,
        address payable _seller,
        address payable _buyer,
        uint256 _price
    ) public onlyPlatform creatable(_id) {
        Trades[_id] = Trade(_seller, _buyer, _price, 1, true);
        emit CreateTrade(_id, _seller, _buyer, _price);
    }

    // 구매자 -> 플랫폼 송금 함수 (거래 시작)
    function transferFromBuyerToPlatform(uint256 _id)
        public
        payable
        onlyBuyer(_id)
    {
        require(
            Trades[_id].isOpen == true && Trades[_id].stage == 1,
            "It's not available"
        );
        Trades[_id].stage = 2;
        platform.transfer(msg.value);
        emit Transfer(_id, msg.sender, platform, msg.value);
    }

    // 플랫폼 -> 판매자 송금 함수 (거래 정상 종료)
    function transferFromPlatformToSeller(uint256 _id)
        public
        payable
        onlyPlatform
    {
        require(
            Trades[_id].isOpen == true && Trades[_id].stage == 2,
            "It's not available"
        );
        Trades[_id].stage = 3;
        Trades[_id].isOpen = false;
        Trades[_id].seller.transfer(msg.value);
        emit Transfer(_id, msg.sender, Trades[_id].seller, msg.value);
    }

    // 플랫폼 -> 구매자 송금 함수 (거래 불발)
    function transferFromPlatformToBuyer(uint256 _id)
        public
        payable
        onlyPlatform
    {
        require(
            Trades[_id].isOpen == true && Trades[_id].stage == 2,
            "It's not available"
        );
        Trades[_id].stage = 3;
        Trades[_id].isOpen = false;
        Trades[_id].buyer.transfer(msg.value);
        emit Transfer(_id, msg.sender, Trades[_id].buyer, msg.value);
    }

    // 플랫폼 지갑 주소 조회
    function getOwner() public view onlyPlatform returns (address) {
        return platform;
    }

    /* 거래 상태 (진행상황, 구매자/판매자 주소 등) 조회 - 플랫폼만 가능 */
    function getTradeStage(uint256 _id)
        public
        view
        onlyPlatform
        returns (uint8)
    {
        return Trades[_id].stage;
    }

    function getTradeIsOpen(uint256 _id)
        public
        view
        onlyPlatform
        returns (bool)
    {
        return Trades[_id].isOpen;
    }

    function getTradeBuyer(uint256 _id)
        public
        view
        onlyPlatform
        returns (address)
    {
        return Trades[_id].buyer;
    }

    function getTradeSeller(uint256 _id)
        public
        view
        onlyPlatform
        returns (address)
    {
        return Trades[_id].seller;
    }

    function getTradePrice(uint256 _id)
        public
        view
        onlyPlatform
        returns (uint256)
    {
        return Trades[_id].price;
    }
}
