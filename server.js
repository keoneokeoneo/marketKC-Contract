const express = require("express");
const app = express();
const port = 3000;
const Web3 = require("web3");
const truffle_connect = require("./connection/newApp.js");

const OWNER = "0x7167145a3af0d906f8886389ac3c91a74078828f";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/getAccounts", (req, res) => {
  truffle_connect.getAccounts(function (accounts) {
    res.send(accounts);
  });
});

app.get("/getBalance", (req, res) => {
  console.log(req.query.addr, typeof req.query.addr);
  truffle_connect.getBalance(req.query.addr, (answer) => {
    res.send(answer);
  });
});

app.get("/getBlock", (req, res) => {
  const param = req.query.target ? req.query.target : "latest";
  truffle_connect.getBlock(param, (answer) => {
    res.send(answer);
  });
});

app.get("/getTransaction", (req, res) => {
  console.log(req.query.tx, typeof req.query.tx);
  truffle_connect.getTransaction(req.query.tx, (answer) => {
    res.send(answer);
  });
});

app.get("/getOwner", (req, res) => {
  truffle_connect.getOwner(OWNER, function (owner) {
    res.send(owner);
  });
});

app.get("/getStage", (req, res) => {
  truffle_connect.getStage(req.query.id, OWNER, (answer) => {
    res.send(answer);
  });
});

app.get("/getIsOpen", (req, res) => {
  truffle_connect.getIsOpen(req.query.id, OWNER, (answer) => {
    res.send(answer);
  });
});

app.get("/getBuyer", (req, res) => {
  truffle_connect.getBuyer(req.query.id, OWNER, (answer) => {
    res.send(answer);
  });
});

app.get("/getSeller", (req, res) => {
  truffle_connect.getSeller(req.query.id, OWNER, (answer) => {
    res.send(answer);
  });
});

app.get("/getPrice", (req, res) => {
  truffle_connect.getPrice(req.query.id, OWNER, (answer) => {
    res.send(answer);
  });
});

app.post("/createTrade", (req, res) => {
  console.log(req.body);
  const { id, seller, buyer, price } = req.body;

  truffle_connect.createTrade(id, seller, buyer, OWNER, price, (id) => {
    res.send(id);
  });
});

app.post("/transferToPlatform", (req, res) => {
  console.log(req.body);
  const { id, buyer, price } = req.body;

  truffle_connect.transferToPlatform(
    Number(id),
    buyer,
    OWNER,
    Number(price),
    (answer) => {
      res.send(answer);
    }
  );
});

app.post("/transferToSeller", (req, res) => {
  const { id, seller, price } = req.body;
  truffle_connect.transferToSeller(
    Number(id),
    seller,
    OWNER,
    Number(price),
    (answer) => {
      res.send(answer);
    }
  );
});

app.listen(port, () => {
  truffle_connect.web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
  );

  console.log("Server is running at http://127.0.0.1:", port);
});
