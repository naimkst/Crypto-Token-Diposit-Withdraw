import { useWeb3React } from "@web3-react/core";
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import contracts from "../HardHat/artifacts/contracts/MyToken.sol/MyToken.json";
var crypto = require("crypto");

// creates: 0xA69818A43F06f39Db1A6b36eDAc1e216eFa88355;
// address: 0xC095768Dd0FcD7Ba8f2Fbfb0DF6Ff8337113A5E3;
// form: 0xC095768Dd0FcD7Ba8f2Fbfb0DF6Ff8337113A5E3

// ethers.utils.parseUnits(ethers.utils.formatEther(tokenTotalPrice), "ether"),


const injected = new InjectedConnector();

const Home: NextPage = ({ web3 }) => {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [address, setAddress] = useState("");
  const [sendaddress, setSendaddress] = useState("");
  const [sendtoken, setSendtoken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [privatekey, setPrivatekey] = useState("");
  const [newaddress, setNewaddress] = useState("");
  const contractAddress = "0x38a87f7F8Ce9188C51dB10366e96150C6326A0A9";
  const {
    active,
    activate,
    deactivate,
    chainId,
    account,
    library: provider,
  } = useWeb3React();

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await activate(injected);
        setHasMetamask(true);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function execute() {
    if (active) {
      console.log("exicute");
      const signer = provider.getSigner();
      const contractAddress = { account };
      const contract = new ethers.Contract(
        "0x38a87f7F8Ce9188C51dB10366e96150C6326A0A9",
        contracts.abi,
        signer
      );
      try {
        const totalSupply = await contract.totalSupply();
        const balance = await contract.balances("0x2298304e8e61051dC8AA7C619D6eC0E70137B4cb");
        const tokenPrice = await contract.tokenPrice();
        const totalSale = await contract.totalSale();
        const tokenAmount = await ethers.utils.formatEther(tokenPrice);
        console.log("Total Sale", totalSale.toString());
        console.log("Acount Balance", balance.toString());
        const howManyToken = sendtoken;
        const tokenTotalPrice = howManyToken*tokenPrice;
        const parshValue = ethers.utils.formatUnits(tokenTotalPrice, "gwei");
        const parshToken = ethers.utils.formatUnits(howManyToken, "ether");
        console.log("TOken Price", tokenTotalPrice, "parse Valaue", tokenTotalPrice, "How Many Token", parshToken);

        // const dai = ethers.utils.parseUnits({ ethers.utils.formatEther(balance) }, "ether")
        // const buytoken = await contract.buyToken(ethers.utils.parseUnits(ethers.utils.formatEther(howManyToken * 10 ** 18), "wei"), {
        //   value: ethers.utils.parseUnits(parshValue, "ether"),
        // });

        const buytoken = await contract.buyToken(ethers.utils.parseUnits(howManyToken), {
          value: ethers.utils.parseUnits(parshValue, "ether"),
        });
        console.log("Ether Payment", buytoken)
        setSuccessMessage(
            "Successfully purchase " + howManyToken + " tokens to " +  account
        );
        // const transfer = await contract.transfer("0x2298304e8e61051dC8AA7C619D6eC0E70137B4cb", howManyToken.toString());
        // if(buytoken.hash){

        // const dai = (howManyToken * 10 ** 18).toString();
        // const transfer = await contract.transferFrom(account.toString(), dai);
        // console.log("Token Transfer",transfer);

        // }
        // const transfer = await contract.transfer(sendaddress.toString(), dai);
              // Send tokens
      // await contract.transfer("0x2298304e8e61051dC8AA7C619D6eC0E70137B4cb", dai).then((transferResult: any) => {
      //   console.dir(transferResult)
      //   alert("sent token")
      // });


        // console.log("Buy Token", transfer);
        // const dai = (sendtoken * 10 ** 18).toString();
        // const transfer = await contract.transfer(sendaddress.toString(), dai);
        // console.log(transfer);
        // setSuccessMessage(
        //   "Successfully sent " + sendtoken + " tokens to " + sendaddress
        // );
        // console.log(ethers.utils.formatUnits(balance, 18));
        // setAddress = await contract.address;
      } catch (error) {
        setErrorMessage(error.message);
        console.log(error.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  const createAccount = async () => {
    // const wallet = ethers.Wallet.createRandom();
    // web3.eth.accounts.create();

    var id = crypto.randomBytes(32).toString("hex");
    var privateKey = "0x" + id;
    console.log("SAVE BUT DO NOT SHARE THIS:", privateKey);
    setPrivatekey(privateKey);

    var wallet = new ethers.Wallet(privateKey);
    console.log("Address: " + wallet.address);
    setNewaddress(wallet.address);

    console.log(id);
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  return (
    <div>
      <>
        {/* { JSON.stringify(sendtoken) } */}
        <div
          style={{
            margin: "0 auto",
            width: "50%",
            textAlign: "center",
            marginTop: "5%",
          }}
        >
          <button className="connect" onClick={() => connect()}>
            Connect
          </button>
          <br />
          {active ? account : ""}
          { address ? setAddress(account) : '' }
          <br />
          {/* <input
            className="inputField"
            onChange={(e) => setSendaddress(e.currentTarget.value)}
            type="text"
            placeholder="0x..."
          /> */}
          {/* <br /> */}
          <input
            className="inputFieldToken"
            onChange={(e) => setSendtoken(e.currentTarget.value)}
            type="text"
            placeholder="Token Amount"
          />
          <br />

          <button className="exicute" onClick={() => execute()}>
            Execute
          </button>
          <button className="exicute" onClick={() => createAccount()}>
            Create Account
          </button>

          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}

          {newaddress && (
            <div className="create-address">
              <p>Address: {newaddress}</p>
              <p>Private Key: {privatekey}</p>
              <span>Note: Please save this data and do not shre this!</span>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default Home;
