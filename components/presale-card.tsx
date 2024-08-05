"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// import { SwitchChain } from "@/components/switch-chain";
// import { ConnectWallet } from "@/components/connect-wallet";
// import { AddToken } from "@/components/add-token";
import { UserBalance } from "@/components/user-balance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useChainId,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  presaleContract,
  PresaleNFT,
  USDT_ETH_ABI,
  PriceOracle,
} from "@/constants";
import {
  Address,
  parseEther,
  parseUnits,
  formatUnits,
  zeroAddress,
  encodeFunctionData,
  erc20Abi,
  maxUint256,
  maxUint32,
  maxUint16,
} from "viem";
// import { useQuery } from "@tanstack/react-query";
import config from "@/config";
import { useSearchParams } from "next/navigation";
import { useSignMessage, useSwitchChain, useBalance } from "wagmi";
import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectIcon } from "@radix-ui/react-select";
import Countdown from "./countdown";
import WertWidget from "@wert-io/widget-initializer";
import type { Options } from "@wert-io/widget-initializer/types";
import { PresaleData } from "./presale-data";
import { useTransactionToast } from "./useTransactionToast";
import { ConnectWallet } from "./connect-wallet";

const PresaleCard: React.FC = () => {
  const searchParams = useSearchParams();
  const referrer = searchParams.get("referrer");
  const {
    data: signMessageData,
    error,
    signMessage,
    variables,
  } = useSignMessage();

  const { switchChain } = useSwitchChain();

  const [countdownDate, setCountdownDate] = useState<number>(1719421200); // June 26th, 2024

  const [chainToPayWith, setChainToPayWith] = useState("bsc");
  const [tokenToPayWith, setTokenToPayWith] = useState("bnb");
  const [selectComponentLoading, setSelectComponentLoading] = useState(false);

  const [userIsReferrer, setUserIsReferrer] = useState<boolean>(false);
  const [userReferralLink, setUserReferralLink] = useState<string | undefined>(
    undefined
  );
  const [isValid, setIsValid] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isReferralCodeTaken, setIsReferralCodeTaken] =
    useState<boolean>(false);

  const [nonceData, setNonceData] = useState<string>("");

  const { address, isConnected } = useAccount();
  const [contributionAmount, setContributionAmount] = useState<string>("");

  const [isUsingCreditCard, setIsUsingCreditCard] = useState<boolean>(false);
  const [bnbPrice, setBNBPrice] = useState<number>(575);

  const [signedData, setSignedData] = useState<any>({});

  const [referralAddress, setReferralAddress] = useState<string>("");
  const [allowance, setAllowance] = useState<string>("0");
  const chainId = useChainId();

  useEffect(() => {
    if (chainId === 1) {
      setChainToPayWith("eth");
      setTokenToPayWith("eth");
    } else if (chainId === 56) {
      setChainToPayWith("bsc");
      setTokenToPayWith("bnb");
    } else if (chainId === 8453) {
      setChainToPayWith("base");
      setTokenToPayWith("eth");
    } else if (chainId === 42161) {
      setChainToPayWith("arb");
      setTokenToPayWith("eth");
    }
  }, [chainId]);

  const getCustomChainId = () => {
    switch (chainToPayWith) {
      case "eth":
        return 1;
      case "bsc":
        return 56;
      case "arb":
        return 42161;
      case "base":
        return 8453;
      default:
        return 1;
    }
  };

  // create dictionary mapping chainIds to usdc addresses
  const usdcAddresses = {
    1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    56: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  };

  // create dictionary mapping chainIds to usdc addresses
  const usdtAddresses = {
    1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    56: "0x55d398326f99059fF775485246999027B3197955",
    42161: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  };

  const { data: getAllowanceCall, refetch: refetchAllowance } = useReadContract(
    {
      abi: erc20Abi,
      address:
        tokenToPayWith === "usdt"
          ? (usdtAddresses[
              getCustomChainId() as keyof typeof usdtAddresses
            ] as Address)
          : (usdcAddresses[
              getCustomChainId() as keyof typeof usdcAddresses
            ] as Address),
      functionName: "allowance",
      args: [address || zeroAddress, presaleContract.address as Address],
      chainId: getCustomChainId(),
    }
  );

  const { data: bnbPriceRaw, refetch: refetchBNBPrice } = useReadContract({
    abi: PriceOracle.abi,
    address: PriceOracle.address as Address,
    functionName: "priceOfBNB",
    chainId: 56,
  });

  useEffect(() => {
    if (bnbPriceRaw) {
      setBNBPrice(
        parseFloat(formatUnits((bnbPriceRaw as bigint) || BigInt("0"), 18))
      );
    }
  }, [bnbPriceRaw]);

  useEffect(() => {
    if (getAllowanceCall) {
      const decimals = chainToPayWith == "bsc" ? 18 : 6;
      setAllowance(formatUnits(getAllowanceCall, decimals));
    }
  }, [getAllowanceCall]);

  const encodedMintData = encodeFunctionData({
    abi: PresaleNFT.abi,
    functionName: "mint",
    args: [
      1,
      address || ("0x579aCc09d9783400A4e0777C62Bd1fC693564F3D" as Address),
    ],
  });

  // get signature from backend
  const getSignature = async () => {
    const url = `/api/secure-route?address=${
      address || "0x579aCc09d9783400A4e0777C62Bd1fC693564F3D"
    }&buyAmount=${Number(
      (parseFloat(contributionAmount || "5") / bnbPrice).toFixed(6)
    )}&inputData=${encodedMintData}`;
    const resp = await fetch(url);

    if (resp.ok) {
      const data = await resp.json();
      return data;
    }
    return null;
  };

  // const partnerID = process.env.NEXT_PUBLIC_WERT_PARTNER_ID_SANDBOX; // SANDBOX ID
  const partnerID = process.env.NEXT_PUBLIC_WERT_PARTNER_ID_PRODUCTION;

  const otherWidgetOptions: Options = {
    partner_id: partnerID || "", // your partner id
    // click_id: uuidv4(), // unique id of purhase in your system
    // origin: "https://sandbox.wert.io", // sandbox origin
    origin: "https://widget.wert.io", // prodiction origin
    theme: "dark",
    // extra: nftOptions,
  };

  const openWertWidget = async () => {
    if (!contributionAmount) {
      toast.error("Please enter a valid USD Amount");
      return;
    }
    if (parseFloat(contributionAmount) < 5) {
      toast.error("Minimum Card Purchase Of $5 USD");
      return;
    }

    try {
      const signature = await getSignature();
      if (!signature) {
        toast.error("Error Getting Signature");
        return;
      }
      const wertWidget = new WertWidget({
        ...signature,
        ...otherWidgetOptions,
      });
      wertWidget.open();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // address, amount tokens, ref
  // note, ref is `userReferralLink`

  const {
    writeContract: donateWrite,
    error: donateError,
    data: donateHash,
  } = useWriteContract();

  // Get the status receipt for transaction for more precise loading and success toasts
  const { status: donateStatus, fetchStatus: donateFetchStatus } =
    useWaitForTransactionReceipt({
      hash: donateHash,
    });

  useTransactionToast({
    txFetchStatus: donateFetchStatus,
    txStatus: donateStatus,
    txHash: donateHash,
    loading: "Contributing...",
    success: "Contribution Successful!",
    error: "Contribution Error",
  });

  const {
    writeContract: approveWrite,
    error: approveError,
    data: approveHash,
  } = useWriteContract();

  // Get the status receipt for transaction for more precise loading and success toasts
  const { status: approveStatus, fetchStatus: approveFetchStatus } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  useTransactionToast({
    txFetchStatus: approveFetchStatus,
    txStatus: approveStatus,
    txHash: approveHash,
    loading: "Approving...",
    success: "Approval Successful!",
    error: "Approval Error",
  });

  useEffect(() => {
    // set timeout to run function every 3 seconds
    const interval = setInterval(() => {
      refetchAllowance();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const donate = () => {
    if (tokenToPayWith === "usdc") {
      const decimals = chainId == 56 ? 18 : 6;

      if (parseFloat(contributionAmount) > parseFloat(allowance)) {
        approveWrite({
          abi: erc20Abi,
          address: usdcAddresses[
            chainId as keyof typeof usdcAddresses
          ] as Address,
          functionName: "approve",
          args: [
            presaleContract.address as Address,
            parseUnits(contributionAmount, decimals),
          ],
          chainId: chainId,
        });
      } else {
        donateWrite({
          abi: presaleContract.abi,
          address: presaleContract.address as Address,
          functionName: "donateUSDC",
          args: [
            parseUnits(contributionAmount, decimals),
            referralAddress || zeroAddress,
          ],
        });
      }
    } else if (tokenToPayWith === "usdt") {
      const decimals = chainId == 56 ? 18 : 6;

      if (parseFloat(contributionAmount) > parseFloat(allowance)) {
        approveWrite({
          abi: getCustomChainId() == 1 ? USDT_ETH_ABI : erc20Abi,
          address: usdtAddresses[
            chainId as keyof typeof usdtAddresses
          ] as Address,
          functionName: "approve",
          args: [
            presaleContract.address as Address,
            parseUnits(contributionAmount, decimals),
          ],
          chainId: chainId,
        });
      } else {
        donateWrite({
          abi: presaleContract.abi,
          address: presaleContract.address as Address,
          functionName: "donateUSDT",
          args: [
            parseUnits(contributionAmount, decimals),
            referralAddress || zeroAddress,
          ],
        });
      }
    } else {
      donateWrite({
        abi: presaleContract.abi,
        address: presaleContract.address as Address,
        functionName: "donateETH",
        args: [referralAddress || zeroAddress],
        value: parseEther(contributionAmount || "0"), // CHANGE THIS FOR USDC / USDT
      });
    }
  };

  const switchChainTo = (chain: string) => {
    if (chain === "eth" && chainId !== 1) {
      switchChain({ chainId: 1 });
    } else if (chain === "bsc" && chainId !== 56) {
      switchChain({ chainId: 56 });
    } else if (chain === "arb" && chainId !== 42161) {
      switchChain({ chainId: 42161 });
    } else if (chain === "base" && chainId !== 8453) {
      switchChain({ chainId: 8453 });
    }
  };

  //use effect to check if referrer in url is valid + get address of that referrer
  useEffect(() => {
    if (referrer) {
      // GET request to endpoint to check if referrer is valid
      try {
        fetch(`https://api.presale.mineprobusiness.net/referral/${referrer}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.status === 200) {
              // If the status code is 200, process the response
              response.text().then((data) => {
                if (data.length > 0) {
                  setReferralAddress(data || (zeroAddress as string));
                }
              });
            } else if (response.status === 404) {
              // If the status code is 404, handle the not found error
            } else {
              // Handle other status codes
            }
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          });
      } catch (error) {
        console.error("Try-catch error:", error);
      }
    }
  }, [referrer]);

  // use effect to check if user is a referrer
  useEffect(() => {
    if (!address) {
      setUserIsReferrer(false);
      setUserReferralLink(undefined);
      return;
    }
    // GET request to endpoint to check if user is a referrer
    // this will happen upon connecting wallet
    try {
      fetch(
        `https://api.presale.mineprobusiness.net/referrals?created_by=${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            // If the status code is 200, process the response
            response.json().then((data) => {
              if (data.length > 0) {
                setUserIsReferrer(true);
                setUserReferralLink(data[0].name);
              }
            });
          } else if (response.status === 404) {
            // If the status code is 404, handle the not found error
          } else {
            // Handle other status codes
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    } catch (error) {
      console.error("Try-catch error:", error);
    }
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value.replace(/\s/g, ""); // Remove whitespace
    value = value.toLowerCase(); // set to lower case
    setUserReferralLink(value.replace(/\s/g, "")); // Remove spaces from the input value

    // if value is more than 64 characters, return
    if (value.length > 64) {
      setIsValid(false);
      return;
    }

    // Check for reserved words
    // const containsReservedWord = reservedWords.some((word) =>
    //   value.toLowerCase().includes(word.toLowerCase())
    // );

    // Check for special characters
    const containsSpecialChars = /[^a-zA-Z0-9\s]/.test(value);

    // Update validity state
    setIsValid(!containsSpecialChars);

    // Update input value state
    setUserReferralLink(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent the default behavior when space key is pressed
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const createReferralLink = async () => {
    if (!isValid) {
      toast.error("Please enter a valid contribution amount");
      return;
    }

    setLoading(true);

    // first, get nonce from GET /auth/nonce
    // NONCE LASTS 5 MINUTES
    try {
      const response = await fetch(
        "https://api.presale.mineprobusiness.net/auth/nonce",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const nonceData = await response.json();
      setNonceData(nonceData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const backendUrl = "https://api.presale.mineprobusiness.net";

    const scheme = window.location.protocol.slice(0, -1);
    const domain = window.location.host;
    const origin = window.location.origin;

    try {
      // Await the signing of the message
      const nonceRes = await fetch(`${backendUrl}/auth/nonce`);

      const message = new SiweMessage({
        scheme,
        domain,
        address,
        statement: "string hello",
        uri: origin,
        version: "1",
        chainId: chainId,
        nonce: nonceData,
      });

      const signature = await signer.signMessage(message.prepareMessage());

      // POST /auth/login with body {message: <the message>, signature: <signature generated by wagmi>}
      const response = await fetch(
        "https://api.presale.mineprobusiness.net/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message.prepareMessage(),
            signature: signature,
          }),
        }
      );

      // Check the response status and handle accordingly
      let token = "";
      if (response.ok) {
        const authData = await response.json();
        // setAuthData(authData.token);
        token = authData.token;
        // Handle the successful response data
      } else {
        console.error(`POST Error ${response.status}: ${response.statusText}`);
        // Handle the error response
      }

      try {
        const referralResponse = await fetch(
          "https://api.presale.mineprobusiness.net/referral",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              name: userReferralLink,
              eth_address: address || zeroAddress,
            }),
          }
        );

        if (!referralResponse.ok) {
          if (referralResponse.statusText == "AddressExisted") {
            setIsReferralCodeTaken(true);
          }
          throw new Error(
            `POST Error ${referralResponse.status}: ${referralResponse.statusText}`
          );
        }

        const referralData = await referralResponse.json();
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }

    setUserIsReferrer(true);
    setLoading(false);
  };

  const updateChainToPayWith = (chain: string) => {
    setChainToPayWith(chain);

    switchChainTo(chain); // prompt a switch chain in wallet

    setSelectComponentLoading(true);

    // default tokenToPayWith based on chain
    switch (chain) {
      case "bsc":
        updateTokenToPayWith("bnb");
        break;
      case "eth":
        updateTokenToPayWith("eth");
        break;
      case "arb":
        updateTokenToPayWith("eth");
        break;
      case "base":
        updateTokenToPayWith("eth");
        break;
      case "solana":
        updateTokenToPayWith("solana");
        break;
      default:
        updateTokenToPayWith("eth");
        break;
    }

    // set timeout to set component loading to false
    setTimeout(() => {
      setSelectComponentLoading(false);
    }, 500);
  };

  useEffect(() => {
    setSelectComponentLoading(false);
  }, [tokenToPayWith]);

  useEffect(() => {
    refetchAllowance();
  }, [tokenToPayWith, chainToPayWith]);

  const updateTokenToPayWith = (value: string) => {
    setTokenToPayWith(value);
  };

  const getSelectOptions = (chain: string) => {
    {
      /* 

        bnb, eth, arb, base 

        BSC is bnb, usdc, usdt, ID = 56
        ETH is eth, usdc, usdt ID = 1
        ARB is eth, usdc, usdt ID = 42161
        BASE is eth and usdc ID = 8453

        */
    }

    switch (chain) {
      case "bsc":
        return (
          <>
            <SelectGroup>
              <SelectLabel>Pay with</SelectLabel>
              <SelectItem value="bnb">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/bnb.png"
                      alt="BNB Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>BNB</p>
                </div>
              </SelectItem>
              <SelectItem value="usdc">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/usdc.png"
                      alt="USDC Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>USDC</p>
                </div>
              </SelectItem>
              <SelectItem value="usdt">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/usdt.png"
                      alt="USDT Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>USDT</p>
                </div>
              </SelectItem>
            </SelectGroup>
          </>
        );
      case "eth":
        return (
          <>
            <SelectGroup>
              <SelectLabel>Pay with</SelectLabel>
              <SelectItem value="eth">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/eth.png"
                      alt="ETH Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>ETH</p>
                </div>
              </SelectItem>
              <SelectItem value="usdc">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/usdc.png"
                      alt="USDC Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>USDC</p>
                </div>
              </SelectItem>
              <SelectItem value="usdt">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/usdt.png"
                      alt="USDT Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>USDT</p>
                </div>
              </SelectItem>
            </SelectGroup>
          </>
        );

      case "arb":
        return (
          <>
            <SelectGroup>
              <SelectLabel>Pay with</SelectLabel>
              <SelectItem value="eth">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/eth.png"
                      alt="ETH Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>ETH</p>
                </div>
              </SelectItem>
              <SelectItem value="usdc">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/usdc.png"
                      alt="USDC Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>USDC</p>
                </div>
              </SelectItem>
              <SelectItem value="usdt">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/usdt.png"
                      alt="USDT Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>USDT</p>
                </div>
              </SelectItem>
            </SelectGroup>
          </>
        );
      case "base":
        return (
          <>
            <SelectGroup>
              <SelectLabel>Pay with</SelectLabel>
              <SelectItem value="eth">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/eth.png"
                      alt="ETH Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>ETH</p>
                </div>
              </SelectItem>
              <SelectItem value="usdc">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/usdc.png"
                      alt="USDC Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>USDC</p>
                </div>
              </SelectItem>
            </SelectGroup>
          </>
        );
      default:
        return (
          <>
            <SelectGroup>
              <SelectLabel>Pay with</SelectLabel>
              <SelectItem value="eth">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/eth.png"
                      alt="ETH Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>ETH</p>
                </div>
              </SelectItem>
              <SelectItem value="usdc">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/usdc.png"
                      alt="USDC Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>USDC</p>
                </div>
              </SelectItem>
              <SelectItem value="usdt">
                <div className="flex items-center gap-2">
                  <SelectIcon>
                    <Image
                      src="/icons/tokens/usdt.png"
                      alt="USDT Icon"
                      width="16"
                      height="16"
                    />
                  </SelectIcon>
                  <p>USDT</p>
                </div>
              </SelectItem>
            </SelectGroup>
          </>
        );
    }
  };

  const handleCopy = (isReferralCode: boolean, text?: string) => {
    if (isReferralCode) {
      navigator.clipboard
        .writeText(
          "https://presale.mineprobusiness.net?referrer=".concat(
            userReferralLink || ""
          )
        )
        .then(() => {
          toast.success("Referral Link Copied!");
        })
        .catch((error) => {
          console.error("Failed to copy:", error);
        });
    } else {
      if (text) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            toast.success("Address Copied!");
          })
          .catch((error) => {
            console.error("Failed to copy:", error);
          });
      }
    }
  };

  const getChainName = () => {
    switch (chainId) {
      case 1:
        return "ETH";
      case 56:
        return "BNB";
      case 43114:
        return "AVAX";
      case 8453:
        return "ETH";
      case 42161:
        return "ETH";
      default:
        return "ETH";
    }
  };

  const getCustomChainName = () => {
    switch (getCustomChainId()) {
      case 1:
        return "ETH";
      case 56:
        return "BNB";
      case 8453:
        return "ETH";
      case 42161:
        return "ETH";
      default:
        return "ETH";
    }
  };

  const isValidNumber = (value: string) => {
    const regex = /^\d+\.?\d*$/;
    return regex.test(value);
  };

  const updateContribution = (newValue: string) => {
    if (newValue === ".") {
      setContributionAmount("0.");
    }
    if (newValue === "" || isValidNumber(newValue)) {
      setContributionAmount(newValue);
    }
  };

  const scrollToSection = (section: string) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderSolanaComponent = () => {
    return (
      <div className="mt-8 mb-4">
        <p className="grayTextGradient text-[16px]">
          Send SOL Here To Enter Presale:
        </p>
        <div className="hidden sm:flex items-center justify-between gap-2 mt-2 border border-[#F2DEF7] border-opacity-[12%] rounded-lg bg-white bg-opacity-[8%] glassyInput">
          <p className="max-w-[300px] text-[14px] text-wrap text-white/60">
            2TXyxVzqhZeonTbcVvUPTDogranZKg9vV44N
            <br />
            ZzqFQBBW
          </p>
          <div className="relative w-14 h-14">
            <Button
              className="glassButton shrink-0"
              onClick={() =>
                handleCopy(
                  false,
                  "2TXyxVzqhZeonTbcVvUPTDogranZKg9vV44NZzqFQBBW"
                )
              }
            >
              <div className="w-5 h-5">
                <Image
                  src="/icons/copy.svg"
                  alt="Copy Icon"
                  width={20}
                  height={20}
                />
              </div>
            </Button>
          </div>
        </div>
        <div className="mt-2 sm:hidden">
          <div className="border border-[#F2DEF7] border-opacity-[12%] bg-white bg-opacity-[8%] glassyInput">
            <p className="max-w-[300px] text-[14px] text-wrap text-white/60">
              2TXyxVzqhZeonTbcVvUPTDogranZKg
              <br />
              9vV44NZzqFQBBW
            </p>
          </div>
          <Button
            className="mt-2 glassButtonRelative"
            onClick={() =>
              handleCopy(false, "2TXyxVzqhZeonTbcVvUPTDogranZKg9vV44NZzqFQBBW")
            }
          >
            <Image
              src="/icons/copy.svg"
              alt="Copy Icon"
              width={20}
              height={20}
            />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="mx-4 sm:mx-0 z-20 lg:w-full h-min lg:max-w-xl glassCard">
      {/* title */}
      <CardHeader>
        <CardTitle className={`text-center grayTextGradient text-[24px]`}>
          Public Sale
        </CardTitle>
      </CardHeader>

      <CardContent className="">
        <h4 className="grayTextGradient text-[16px]">Contribute Below:</h4>
      </CardContent>

      {/* chain selector */}
      <CardContent className="flex flex-col">
        <div className="grid grid-cols-3 grid-rows-2 sm:grid-cols-6 sm:grid-rows-1 gap-4 gap-y-4 row-gap-12 sm:px-8 sm:h-20 place-items-center justify-items-stretch">
          <button
            onClick={() => {
              setIsUsingCreditCard(false);
              updateChainToPayWith("bsc");
            }}
            className={`transition-all scale-110 hover:scale-105 flex justify-center items-center place-self-center relative ${
              chainToPayWith === "bsc" ? "w-16 h-16" : "w-14 h-14"
            }`}
          >
            <Image
              src="/icons/chains/bsc.png"
              alt="Binance Smart Chain Icon"
              fill
              className={`transition-all ${
                chainToPayWith === "bsc" &&
                "border-2 border-accent rounded-full"
              }`}
            />
          </button>
          <button
            onClick={() => {
              setIsUsingCreditCard(false);
              updateChainToPayWith("eth");
            }}
            className={`transition-all hover:scale-105 flex justify-center items-center place-self-center relative ${
              chainToPayWith === "eth" ? "w-16 h-16" : "w-14 h-14"
            }`}
          >
            <Image
              src="/icons/chains/ethereum.png"
              alt="Ethereum Chain Icon"
              fill
              className={`transition-all ${
                chainToPayWith === "eth" &&
                "border-2 border-accent rounded-full"
              }`}
            />
          </button>
          <button
            onClick={() => {
              setIsUsingCreditCard(false);
              updateChainToPayWith("arb");
            }}
            className={`transition-all hover:scale-105 flex justify-center items-center place-self-center relative ${
              chainToPayWith === "arb" ? "w-16 h-16" : "w-14 h-14"
            }`}
          >
            <Image
              src="/icons/chains/arbitrum.svg"
              alt="arbitrum Chain Icon"
              fill
              className={`transition-all ${
                chainToPayWith === "arb" &&
                "border-2 border-accent rounded-full"
              }`}
            />
          </button>
          <button
            onClick={() => {
              setIsUsingCreditCard(false);
              updateChainToPayWith("base");
            }}
            className={`transition-all hover:scale-105 flex justify-center items-center place-self-center relative ${
              chainToPayWith === "base" ? "w-16 h-16" : "w-14 h-14"
            }`}
          >
            <Image
              src="/icons/chains/base.png"
              alt="Base Chain Icon"
              fill
              className={`transition-all ${
                chainToPayWith === "base" &&
                "border-2 border-accent rounded-full"
              }`}
            />
          </button>
          <button
            onClick={() => {
              setIsUsingCreditCard(false);
              updateChainToPayWith("solana");
            }}
            className={`transition-all hover:scale-105 flex justify-center items-center place-self-center relative ${
              chainToPayWith === "solana" ? "w-16 h-16" : "w-14 h-14"
            }`}
          >
            <Image
              src="/icons/chains/solana.png"
              alt="Solana Chain Icon"
              fill
              className={`transition-all ${
                chainToPayWith === "solana" &&
                "border-2 border-accent rounded-full"
              }`}
            />
          </button>
          {/* credit card button */}
          {/* pay with credit card button */}
          <Button
            onClick={() => {
              setChainToPayWith("");
              setIsUsingCreditCard(!isUsingCreditCard);
            }}
            disabled={!isConnected}
            className={`transition-all relative hover:scale-105 rounded-full mx-auto flex justify-center items-center ${
              isUsingCreditCard ? "w-[64px] h-[64px]" : "w-[54px] h-[54px]"
            }`}
          >
            <Image
              src="/icons/card.png"
              alt="Credit Card Icon"
              fill
              className={`transition-all ${
                isUsingCreditCard && "rounded-full"
              }`}
            />
          </Button>
        </div>
        {/* <h4 className="text-sm">Total Raised</h4>
        <p className="text-lg">${totalDonated()}</p> */}
      </CardContent>

      <CardContent className="flex flex-col">
        {!isConnected ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ConnectWallet />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs text-white">
                  Please Connect to Contribute
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : isUsingCreditCard ? (
          <div className="mt-2 flex flex-col sm:flex-row w-full sm:items-center gap-2 sm:gap-0 sm:space-x-2">
            <div className="relative w-full h-full">
              <Input
                type="text"
                placeholder="100.00"
                prefix="$"
                value={contributionAmount}
                onChange={(e) => {
                  updateContribution(e.target.value || "");
                }}
                className="pl-8 glassyInputNoPadding h-12"
              />
              <p className="text-white/60 text-lg absolute top-1/2 transform -translate-y-1/2 left-4 -translate-x-1/2">
                $
              </p>
            </div>
            <Button
              onClick={() => openWertWidget()}
              disabled={!isConnected}
              className="orangeButton"
            >
              Pay With Card
            </Button>
          </div>
        ) : chainToPayWith !== "solana" ? (
          <>
            <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-start sm:items-center gap-2">
              <div className="">
                {!selectComponentLoading ? (
                  <Select
                    defaultValue={tokenToPayWith}
                    onValueChange={updateTokenToPayWith}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getSelectOptions(chainToPayWith)}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="animate-pulse rounded-lg w-[168px] h-8 bg-slate-200"></div>
                )}
              </div>
              <UserBalance
                isConnected={isConnected}
                address={address || zeroAddress}
                chainId={getCustomChainId()}
                token={tokenToPayWith}
              />
            </div>
            {/* contribution input */}
            <div className="mt-2 flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter an amount..."
                value={contributionAmount}
                onChange={(e) => {
                  updateContribution(e.target.value || "");
                }}
                className="glassyInput h-[48px]"
              />
              {!isConnected ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="opacity-50"
                      >
                        Contribute
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs text-white">
                        Please Connect to Contribute
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  onClick={() => {
                    getCustomChainId() !== chainId
                      ? switchChainTo(chainToPayWith)
                      : donate();
                  }}
                  disabled={!isConnected}
                  className="orangeButton"
                >
                  {getCustomChainId() !== chainId
                    ? "Switch Chain"
                    : parseFloat(contributionAmount) > parseFloat(allowance) &&
                      (tokenToPayWith == "usdc" || tokenToPayWith == "usdt")
                    ? "Approve"
                    : "Contribute"}
                </Button>
              )}
            </div>
          </>
        ) : (
          renderSolanaComponent()
        )}

        {chainToPayWith !== "solana" ? (
          <div className="mt-8 mb-4">
            <p className="grayTextGradient text-[16px]">
              Or Send {getCustomChainName()} Here:{" "}
            </p>
            <div className="hidden sm:flex items-center justify-between gap-2 mt-2 glassyInput">
              <p className="max-w-[300px] text-wrap">
                0x8E051643C049635AC45C69aDB343CC5
                <br />
                7EAf9179C
              </p>
              <div className="relative w-14 h-14">
                <Button
                  className="glassButton shrink-0"
                  onClick={() =>
                    handleCopy(
                      false,
                      "0x8E051643C049635AC45C69aDB343CC57EAf9179C"
                    )
                  }
                >
                  <div className="w-5 h-5">
                    <Image
                      src="/icons/copy.svg"
                      alt="Copy Icon"
                      width={20}
                      height={20}
                    />
                  </div>
                </Button>
              </div>
            </div>
            <div className="mt-2 sm:hidden ">
              <div className="border border-[#F2DEF7] p-2 rounded-lg bg-white bg-opacity-[8%] glassyInput">
                <p className="max-w-[300px] text-[14px] text-wrap text-white/60">
                  0x8E051643C049635AC45C69aDB343CC5
                  <br />
                  7EAf9179C
                </p>
              </div>
              <Button
                className="mt-2 glassButtonRelative"
                onClick={() =>
                  handleCopy(
                    false,
                    "0x8E051643C049635AC45C69aDB343CC57EAf9179C"
                  )
                }
              >
                <Image
                  src="/icons/copy.svg"
                  alt="Copy Icon"
                  width={20}
                  height={20}
                />
              </Button>
            </div>
          </div>
        ) : (
          isConnected == false && renderSolanaComponent()
        )}

        {/* total raised */}
        {/* <div className="mt-4">
          <h4 className="text-sm">Total Raised</h4>
          <p className="text-lg">{totalDonated()} {config.presaleDetails.token}</p>
        </div> */}

        {/* your contribution */}
        <PresaleData />

        <div className="grow"></div>

        <div className="my-8 flex flex-col">
          {userIsReferrer ? (
            <>
              <h4 className="grayTextGradient text-[16px]">
                Your Referral Link
              </h4>
              <div className="mt-2 flex flex-col sm:flex-row w-full sm:items-center gap-2">
                <p className="grow text-[14px] text-white/40 text-wrap">
                  https://presale.mineprobusiness.net?referrer=
                  {userReferralLink}
                </p>
                <Button
                  onClick={() => handleCopy(true)}
                  className="orangeButton"
                >
                  Copy Link
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="grayTextGradient text-[14px]">
                Generate a referral link to earn 10% of all sales generated by
                you
              </p>
              <div className="mt-4 lg:mt-2 flex flex-col sm:flex-row w-full items-center gap-2">
                <Input
                  type="text"
                  placeholder="Enter Unique Code"
                  value={userReferralLink || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`glassyInput focus:ring ${
                    isValid
                      ? "border-gray-300 focus:ring-gray-500"
                      : "border-red-500 focus:ring-red-500"
                  }`}
                />
                <Button
                  className="w-full sm:w-auto orangeButton"
                  onClick={() => createReferralLink()}
                  disabled={
                    !isConnected ||
                    !isValid ||
                    userReferralLink === "" ||
                    !userReferralLink
                  }
                >
                  {loading ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-[#2e84bd] animate-spin fill-gray-400"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <p>Create Referral Link</p>
                  )}
                </Button>
              </div>
              {!isValid && (
                <p className="mt-1 text-red-500 text-sm">
                  This referral code contains invalid characters.
                </p>
              )}
              {isReferralCodeTaken && (
                <p className="mt-1 text-red-500 text-sm">
                  This referral code is already taken.
                </p>
              )}
              {error && (
                <p className="mt-1 text-red-500 text-sm">{error.message}</p>
              )}
            </>
          )}
        </div>

        {/* instructions hover info */}
        <div className="flex justify-end">
          <button
            onClick={() => scrollToSection("how-to-buy")}
            className="underline cursor-pointer text-[14px] text-white/40"
          >
            How do I contribute?
          </button>
          {/* hover card on desktop */}
          {/* <div className="hidden sm:block">
            <HoverCard>
              {/* hover trigger 
              <HoverCardTrigger asChild>
                <p className="underline cursor-pointer text-[14px] text-white/40">
                  How do I contribute?
                </p>
              </HoverCardTrigger>
              {/* hover content 
              <HoverCardContent className="w-80">
                <div className="flex flex-col space-y-1.5 pt-6 px-2 pb-3">
                  <h3 className="font-semibold leading-none tracking-tight">
                    How to Join the Presale
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Follow these three sinmple steps to join the presale!
                  </p>
                </div>
                <div className="p-2 pt-0 grid gap-1">
                  {config.presaleInstructions.map((instruction) => (
                    <div
                      key={instruction.stepNumber}
                      className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all" /* hover:bg-accent hover:text-accent-foreground 
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="black"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={instruction.icon}
                        />
                      </svg>

                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Step {instruction.stepNumber} - {instruction.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {instruction.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          </div> */}
          {/* popover on mobile */}
          {/* <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <p className="underline cursor-pointer text-[14px] text-white/40">
                  How do I contribute?
                </p>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col space-y-1.5 pt-6 px-2 pb-3">
                  <h3 className="font-semibold leading-none tracking-tight">
                    How to Join the Presale
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Follow these three simple steps to join the presale!
                  </p>
                </div>
                <div className="p-2 pt-0 grid gap-1">
                  {config.presaleInstructions.map((instruction) => (
                    <div
                      key={instruction.stepNumber}
                      className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all" /* hover:bg-accent hover:text-accent-foreground 
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="black"
                        className="w-8 h-8"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d={instruction.icon}
                        />
                      </svg>

                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Step {instruction.stepNumber} - {instruction.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {instruction.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  *After entering an amount and contributing, your wallet should
                  pop-up. If it doesn't, check your wallet to confirm.{" "}
                </p>
              </PopoverContent>
            </Popover>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default PresaleCard;
