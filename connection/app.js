const contract = require("truffle-contract");

const smarcet_artifact = require("../build/contracts/Smarcet.json");
const Smarcet = contract(smarcet_artifact);

const GAS_LIMIT = 3000000;

module.exports = {
  // 로컬 상 존재하는 계좌 정보 조회
  getAccounts: function (callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    self.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        console.log("계좌 리스트 로딩중에 에러가 발생했습니다.");
        return;
      }

      if (accs.length == 0) {
        console.log("계좌 정보가 존재하지 않습니다.");
        return;
      }

      self.accounts = accs;

      callback(self.accounts);
    });
  },
  // 특정 계좌 잔액 조회
  getBalance: function (addr, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    self.web3.eth.getBalance(addr, function (err, result) {
      if (err) {
        console.log(err, typeof err);
        callback(err);
        return;
      }
      callback({ result: Number(result) });
    });
  },
  getBlock: function (param, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    self.web3.eth.getBlock(param, function (err, result) {
      console.log(err, result);
      callback(result);
    });
  },
  // 특정 트랜잭션 조회
  getTransaction: function (tx, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    self.web3.eth.getTransaction(tx, function (err, result) {
      console.log(err, result);
      callback(result);
    });
  },
  // 컨트랙트 소유자 주소 조회
  getOwner: function (owner, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    var smarcet;
    Smarcet.deployed()
      .then(function (instance) {
        smarcet = instance;

        return smarcet.getOwner();
      })
      .then(function (addr) {
        callback({ data: addr });
      })
      .catch(function (err) {
        console.log(err);
        callback("Error");
      });
  },
  getStage: function (id, owner, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    var smarcet;
    Smarcet.deployed()
      .then(function (instance) {
        smarcet = instance;
        return smarcet.getTradeStage(Number(id), { from: owner });
      })
      .then(function (data) {
        callback({ data: Number(data) });
      })
      .catch(function (e) {
        callback("Error");
      });
  },
  getIsOpen: function (id, owner, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    var smarcet;
    Smarcet.deployed()
      .then(function (instance) {
        smarcet = instance;
        return smarcet.getTradeIsOpen(Number(id), { from: owner });
      })
      .then(function (data) {
        callback(data);
      })
      .catch(function (e) {
        console.log(e);
        callback("Error");
      });
  },
  getBuyer: function (id, owner, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    var smarcet;
    Smarcet.deployed()
      .then(function (instance) {
        smarcet = instance;
        return smarcet.getTradeBuyer(Number(id), { from: owner });
      })
      .then(function (data) {
        callback({ data: data });
      })
      .catch(function (e) {
        console.log(e);
        callback("Error");
      });
  },
  getSeller: function (id, owner, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    var smarcet;
    Smarcet.deployed()
      .then(function (instance) {
        smarcet = instance;
        return smarcet.getTradeSeller(Number(id), { from: owner });
      })
      .then(function (data) {
        callback({ data: data });
      })
      .catch(function (e) {
        console.log(e);
        callback("Error");
      });
  },
  getPrice: function (id, owner, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    var smarcet;
    Smarcet.deployed()
      .then(function (instance) {
        smarcet = instance;
        return smarcet.getTradePrice(Number(id), { from: owner });
      })
      .then(function (data) {
        callback({ data: Number(data) });
      })
      .catch(function (e) {
        console.log(e);
        callback("Error");
      });
  },

  // 새로운 거래 열기
  createTrade: function (id, seller, buyer, owner, price, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    var smarcet;
    Smarcet.deployed()
      .then(function (instance) {
        smarcet = instance;
        return smarcet.createTrade(Number(id), seller, buyer, Number(price), {
          from: owner,
          gas: GAS_LIMIT,
        });
      })
      .then(function (data) {
        callback(data);
      })
      .catch(function (e) {
        callback("Error");
      });
  },

  // 구매자 -> 플랫폼 송금
  transferToPlatform: function (id, buyer, price, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    console.log(price);

    var smarcet;
    Smarcet.deployed()
      .then(function (instance) {
        smarcet = instance;
        return smarcet.transferFromBuyerToPlatform(Number(id), {
          from: buyer,
          value: Number(price),
          gas: GAS_LIMIT,
        });
      })
      .then(function (data) {
        callback({ data: data });
      })
      .catch(function (e) {
        callback("Error");
      });
  },
  // 플랫폼 -> 판매자 송금 (거래 종료)
  transferToSeller: function (id, owner, price, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    var smarcet;
    Smarcet.deployed()
      .then(function (instance) {
        smarcet = instance;
        return smarcet.transferFromPlatformToSeller(Number(id), {
          from: owner,
          value: Number(price),
          gas: GAS_LIMIT,
        });
      })
      .then(function (data) {
        callback({ data: data });
      })
      .catch(function (e) {
        callback("Error");
      });
  },

  // 플랫폼 -> 구매자 송금 (거래 불발)
  transferToBuyer: function (id, price, callback) {
    var self = this;

    Smarcet.setProvider(self.web3.currentProvider);

    var smarcet;
    Smarcet.deployed()
      .then(function (instance) {
        smarcet = instance;
        return smarcet.transferFromPlatformToBuyer(Number(id), {
          from: owner,
          value: Number(price),
          gas: GAS_LIMIT,
        });
      })
      .then(function (data) {
        callback({ data: data });
      })
      .catch(function (e) {
        callback("Error");
      });
  },
};
