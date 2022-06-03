import React from "react";
import { useWeb3React } from "@web3-react/core";
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import contracts from "../HardHat/artifacts/contracts/MyToken.sol/MyToken.json";
var crypto = require("crypto");

const injected = new InjectedConnector();

function Withdraw() {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [address, setAddress] = useState("");
  const [sendaddress, setSendaddress] = useState("");
  const [sendtoken, setSendtoken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [privatekey, setPrivatekey] = useState("");
  const [newaddress, setNewaddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [tokenBalance, setBalance] = useState("");
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
        const balance = await contract.balanceOf(
          account.toString()
        );
        setBalance(ethers.utils.formatEther(balance));
        console.log("Token Balances", ethers.utils.formatEther(balance));
        const tokenPrice = await contract.tokenPrice();
        const totalSale = await contract.totalSale();
        const tokenAmount = await ethers.utils.formatEther(tokenPrice);
        console.log("Total Sale", totalSale.toString());
        console.log("Acount Balance", balance.toString());
        const howManyToken = sendtoken;
        const tokenTotalPrice = howManyToken * tokenPrice;
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

        const dai = (sendtoken * 10 ** 18).toString();
        const transfer = await contract.transfer(toAddress.toString(), dai);
        console.log(transfer);
        setSuccessMessage(
          "Successfully sent " + sendtoken + " tokens to " + toAddress
        );

      } catch (error) {
        setErrorMessage(error.message);
        console.log(error.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }


  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

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
        <div className="flex justify-center justify-items-center m-auto w-9/12">
          <div className="w-full">
            <div className="md:flex items-center space-x-5 mt-12">
              <div className="md:w-full flex flex-col">
                <label className="text-base font-semibold leading-none text-gray-800">
                  To Address
                </label>
                <input
                  tabIndex={0}
                  arial-label="Please input name"
                  type="text"
                  className="text-base leading-none text-gray-900 p-3 py-6 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100"
                  placeholder="Please input  name"
                  onChange={(e) => setToAddress(e.currentTarget.value)}
                />
              </div>
              <div className="md:w-full flex flex-col">
                <label className="text-base font-semibold leading-none text-gray-800">
                  Token Amount
                </label>
                <input
                  tabIndex={0}
                  arial-label="Please input name"
                  type="text"
                  className="text-base leading-none text-gray-900 p-3 py-6 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100"
                  placeholder="Please input  name"
                  onChange={(e) => setSendtoken(e.currentTarget.value)}
                />
              </div>
            </div>
            <p className=" text-center mt-6">Your total Token: {tokenBalance}</p>
            <div className="flex items-center justify-center w-full">
              <button onClick={() => execute()} className="mt-6 text-base font-semibold leading-none text-white py-4 px-10 bg-indigo-700 rounded hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none">
                Send Token
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

export default Withdraw;
