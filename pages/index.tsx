import React from "react";
import QRCode from "react-qr-code";
import ReactDOM from "react-dom";
import { useWeb3React } from "@web3-react/core";
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";
// import contracts from "HardHat/artifacts/contracts/MyToken.sol/MyToken.json";
import contracts from "public/MyToken.json";
var crypto = require("crypto");

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });

function Deposit() {
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
    try {
      await activate(injected);
      setHasMetamask(true);
    } catch (e) {
      console.log(e);
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
        const balance = await contract.balances(
          "0x2298304e8e61051dC8AA7C619D6eC0E70137B4cb"
        );
        const tokenPrice = await contract.tokenPrice();
        const totalSale = await contract.totalSale();
        const tokenAmount = await ethers.utils.formatEther(tokenPrice);
        console.log("Total Sale", totalSale.toString());
        console.log("Acount Balance", balance.toString());
        const howManyToken: any = sendtoken;
        const tokenTotalPrice: any = howManyToken * tokenPrice;
        const parshValue = ethers.utils.formatUnits(tokenTotalPrice, "gwei");
        const parshToken = ethers.utils.formatUnits(howManyToken, "ether");
        console.log(
          "TOken Price",
          tokenTotalPrice,
          "parse Valaue",
          tokenTotalPrice,
          "How Many Token",
          parshToken
        );
        const buytoken = await contract.buyToken(
          ethers.utils.parseUnits(howManyToken),
          {
            value: ethers.utils.parseUnits(parshValue, "ether"),
          }
        );
        console.log("Ether Payment", buytoken);
        setSuccessMessage(
          "Successfully purchase " + howManyToken + " tokens to " + account
        );
      } catch (error: any) {
        setErrorMessage(error.message);
        console.log(error.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  const createAccount = async () => {
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
    // if (typeof window.ethereum !== "undefined") {
    //   setHasMetamask(true);
    // }
  }, [hasMetamask]);

  return (
    <>
      {/* {JSON.stringify(sendtoken)} */}

      {!account && (
        <div>
          <div className="flex items-center justify-center w-full">
            <button
              onClick={() => connect()}
              className="mt-9 text-base font-semibold leading-none text-white py-4 px-10 bg-indigo-700 rounded hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none"
            >
              Connect Now
            </button>
          </div>
          <p className=" text-center mt-2 text-red-500">
            Please conncet with your metamask!
          </p>
        </div>
      )}

      {account && (
        <div className="grid grid-cols-2 gap-4 justify-center justify-items-center py-40">
          <div className="justify-self-center ">
            {
              <QRCode
                value={account}
                bgColor="#fff"
                size={300}
              />
            }
            {/* <p className="mt-4 text-bold">Address: 0x2298304e8e61051dC8AA7C619D6eC0E70137B4cb</p> */}
          </div>
          <div className="justify-self-center items-center w-full">
            <label className="text-base text-center font-semibold leading-none text-gray-800 w-full">
              Your Address
            </label>
            <div className="md:flex items-center ">
              <button
                type="button"
                className="p-6 bg-[#4338ca] text-white mt-4 rounded-sm"
              >
                Copy
              </button>
              <div className="md:w-full flex flex-col">
                <input
                  type="text"
                  className="text-base leading-none text-gray-900 p-3 py-6 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 "
                  placeholder={account}
                />
              </div>
            </div>

            <div className="md:flex items-center justify-center justify-items-center">
              <div className="flex w-full flex-col">
                <input
                  type="text"
                  className="text-base leading-none text-gray-900 p-3 py-6 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded "
                  placeholder="Token Amount"
                  onChange={(e) => setSendtoken(e.currentTarget.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-center w-full">
              <button onClick={() => execute()} className="mt-9 text-base font-semibold leading-none text-white py-4 px-10 bg-indigo-700 rounded hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none">
                Send Token To Address
              </button>
            </div>
            {errorMessage && <p className="error text-center mt-3">{errorMessage}dfd</p>}
          {successMessage && <p className="success text-center mt-3">{successMessage}dfd</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default Deposit;


// import { useWeb3React } from "@web3-react/core";
// import type { NextPage } from "next";
// import { useState, useEffect } from "react";
// import { InjectedConnector } from "@web3-react/injected-connector";
// import { ethers } from "ethers";
// // import contracts from "HardHat/artifacts/contracts/MyToken.sol/MyToken.json";
// import contracts from "public/MyToken.json";
// var crypto = require("crypto");

// // creates: 0xA69818A43F06f39Db1A6b36eDAc1e216eFa88355;
// // address: 0xC095768Dd0FcD7Ba8f2Fbfb0DF6Ff8337113A5E3;
// // form: 0xC095768Dd0FcD7Ba8f2Fbfb0DF6Ff8337113A5E3

// // ethers.utils.parseUnits(ethers.utils.formatEther(tokenTotalPrice), "ether"),

// const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });

// const Home: NextPage = () => {
//   const [hasMetamask, setHasMetamask] = useState(false);
//   const [address, setAddress]: any= useState("");
//   const [sendaddress, setSendaddress] = useState("");
//   const [sendtoken, setSendtoken] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [privatekey, setPrivatekey] = useState("");
//   const [newaddress, setNewaddress] = useState("");
//   const contractAddress = "0x38a87f7F8Ce9188C51dB10366e96150C6326A0A9";
//   const {
//     active,
//     activate,
//     deactivate,
//     chainId,
//     account,
//     library: provider,
//   } = useWeb3React();

//   async function connect() {
//     // if (typeof window.ethereum !== "undefined") {
//     try {
//       await activate(injected);
//       setHasMetamask(true);
//     } catch (e) {
//       console.log(e);
//     }
//     // }
//   }

//   async function execute() {
//     if (active) {
//       console.log("exicute");
//       const signer = provider.getSigner();
//       const contractAddress = { account };
//       const contract = new ethers.Contract(
//         "0x38a87f7F8Ce9188C51dB10366e96150C6326A0A9",
//         contracts.abi,
//         signer
//       );
//       try {
//         const totalSupply = await contract.totalSupply();
//         const balance = await contract.balances(
//           "0x2298304e8e61051dC8AA7C619D6eC0E70137B4cb"
//         );
//         const tokenPrice = await contract.tokenPrice();
//         const totalSale = await contract.totalSale();
//         const tokenAmount = await ethers.utils.formatEther(tokenPrice);
//         console.log("Total Sale", totalSale.toString());
//         console.log("Acount Balance", balance.toString());
//         const howManyToken: any = sendtoken;
//         const tokenTotalPrice = howManyToken * tokenPrice;
//         const parshValue = ethers.utils.formatUnits(tokenTotalPrice, "gwei");
//         const parshToken = ethers.utils.formatUnits(howManyToken, "ether");
//         console.log(
//           "TOken Price",
//           tokenTotalPrice,
//           "parse Valaue",
//           tokenTotalPrice,
//           "How Many Token",
//           parshToken
//         );

//         // const dai = ethers.utils.parseUnits({ ethers.utils.formatEther(balance) }, "ether")
//         // const buytoken = await contract.buyToken(ethers.utils.parseUnits(ethers.utils.formatEther(howManyToken * 10 ** 18), "wei"), {
//         //   value: ethers.utils.parseUnits(parshValue, "ether"),
//         // });

//         const buytoken = await contract.buyToken(
//           ethers.utils.parseUnits(howManyToken),
//           {
//             value: ethers.utils.parseUnits(parshValue, "ether"),
//           }
//         );
//         console.log("Ether Payment", buytoken);
//         setSuccessMessage(
//           "Successfully purchase " + howManyToken + " tokens to " + account
//         );
//         // const transfer = await contract.transfer("0x2298304e8e61051dC8AA7C619D6eC0E70137B4cb", howManyToken.toString());
//         // if(buytoken.hash){

//         // const dai = (howManyToken * 10 ** 18).toString();
//         // const transfer = await contract.transferFrom(account.toString(), dai);
//         // console.log("Token Transfer",transfer);

//         // }
//         // const transfer = await contract.transfer(sendaddress.toString(), dai);
//         // Send tokens
//         // await contract.transfer("0x2298304e8e61051dC8AA7C619D6eC0E70137B4cb", dai).then((transferResult: any) => {
//         //   console.dir(transferResult)
//         //   alert("sent token")
//         // });

//         // console.log("Buy Token", transfer);
//         // const dai = (sendtoken * 10 ** 18).toString();
//         // const transfer = await contract.transfer(sendaddress.toString(), dai);
//         // console.log(transfer);
//         // setSuccessMessage(
//         //   "Successfully sent " + sendtoken + " tokens to " + sendaddress
//         // );
//         // console.log(ethers.utils.formatUnits(balance, 18));
//         // setAddress = await contract.address;
//       } catch (error: any) {
//         setErrorMessage(error.message);
//         console.log(error.message);
//       }
//     } else {
//       console.log("Please install MetaMask");
//     }
//   }

//   const createAccount = async () => {
//     // const wallet = ethers.Wallet.createRandom();
//     // web3.eth.accounts.create();

//     var id = crypto.randomBytes(32).toString("hex");
//     var privateKey = "0x" + id;
//     console.log("SAVE BUT DO NOT SHARE THIS:", privateKey);
//     setPrivatekey(privateKey);

//     var wallet = new ethers.Wallet(privateKey);
//     console.log("Address: " + wallet.address);
//     setNewaddress(wallet.address);

//     console.log(id);
//   };

//   useEffect(() => {
//     // if (typeof window.ethereum !== "undefined") {
//     setHasMetamask(true);
//     // }
//   });

//   return (
//     <>
//       <div>
//         {/* { JSON.stringify(sendtoken) } */}
//         <div>
//           <button className="connect connect-btn" onClick={() => connect()}>
//             Connect
//           </button>
//           <br />
//           {active ? account : ""}
//           {address ? setAddress(account) : ""}
//           <br />
//           {/* <input
//             className="inputField"
//             onChange={(e) => setSendaddress(e.currentTarget.value)}
//             type="text"
//             placeholder="0x..."
//           /> */}
//           {/* <br /> */}
//           <input
//             className="inputFieldToken"
//             onChange={(e) => setSendtoken(e.currentTarget.value)}
//             type="text"
//             placeholder="Token Amount"
//           />
//           <br />

//           <button className="exicute" onClick={() => execute()}>
//             Execute
//           </button>
//           <button className="exicute" onClick={() => createAccount()}>
//             Create Account
//           </button>

//           {errorMessage && <p className="error">{errorMessage}</p>}
//           {successMessage && <p className="success">{successMessage}</p>}

//           {newaddress && (
//             <div className="create-address">
//               <p>Address: {newaddress}</p>
//               <p>Private Key: {privatekey}</p>
//               <span>Note: Please save this data and do not shre this!</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;
