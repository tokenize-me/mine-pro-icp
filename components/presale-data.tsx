import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { presaleContract, CreditCardSale, PriceOracle } from "@/constants";
import {
  Address,
  parseEther,
  formatEther,
  formatUnits,
  parseUnits,
  zeroAddress,
} from "viem";
import { Progress } from "@/components/ui/progress";

export const PresaleData: React.FC = () => {
  type Donation = {
    amountETH: string;
    amountUSDC: string;
    amountUSDT: string;
  };
  const DEFAULT_DONATION: Donation = {
    amountETH: "0",
    amountUSDC: "0",
    amountUSDT: "0",
  };

  type ChainDonation = {
    amountETH: bigint;
    amountUSDC: bigint;
    amountUSDT: bigint;
  };

  const prices: number[] = [
    0.03, 0.0333, 0.0366, 0.04, 0.0433, 0.0466, 0.05, 0.0533, 0.0566, 0.06,
  ];

  const countDownDate = 1719421200;

  const [currentTier, setCurrentTier] = useState<number>(0);

  const { address, isConnected } = useAccount();

  // Token Prices
  const [priceOfBNB, setPriceOfBNB] = useState<number>(575);
  const [priceOfETH, setPriceOfETH] = useState<number>(3360);

  // Totals
  const [ethDonations, setETHDonations] = useState<Donation>(DEFAULT_DONATION);
  const [bnbDonations, setBNBDonations] = useState<Donation>(DEFAULT_DONATION);
  const [baseDonations, setBASEDonations] =
    useState<Donation>(DEFAULT_DONATION);
  const [arbDonations, setARBDonations] = useState<Donation>(DEFAULT_DONATION);
  const [cardDonations, setCardDonations] =
    useState<Donation>(DEFAULT_DONATION);

  // User Donations
  const [userETHDonations, setUserETHDonations] =
    useState<Donation>(DEFAULT_DONATION);
  const [userBNBDonations, setUserBNBDonations] =
    useState<Donation>(DEFAULT_DONATION);
  const [userBASEDonations, setUserBASEDonations] =
    useState<Donation>(DEFAULT_DONATION);
  const [userARBDonations, setUserARBDonations] =
    useState<Donation>(DEFAULT_DONATION);
  const [userCardDonations, setUserCardDonations] =
    useState<Donation>(DEFAULT_DONATION);

  const { data: priceOfBNBCall, refetch: refetchBNBPrice } = useReadContract({
    abi: PriceOracle.abi,
    address: PriceOracle.address as Address,
    functionName: "priceOfBNB",
    chainId: 56,
  });

  const { data: priceOfETHCall, refetch: refetchETHPrice } = useReadContract({
    abi: PriceOracle.abi,
    address: PriceOracle.address as Address,
    functionName: "priceOf",
    args: ["0x2170Ed0880ac9A755fd29B2688956BD959F933F8"],
    chainId: 56,
  });

  useEffect(() => {
    if (priceOfBNBCall) {
      const data = priceOfBNBCall as bigint;
      setPriceOfBNB(parseFloat(formatUnits(data, 18)));
    }
  }, [priceOfBNBCall]);

  useEffect(() => {
    if (priceOfETHCall) {
      const data = priceOfETHCall as bigint;
      setPriceOfETH(parseFloat(formatUnits(data, 18)));
    }
  }, [priceOfETHCall]);

  const { data: totalDonatedETH, refetch: r0 } = useReadContract({
    abi: presaleContract.abi,
    address: presaleContract.address as Address,
    functionName: "getDonatedTotals",
    chainId: 1,
  });

  const { data: totalDonatedBNB, refetch: r1 } = useReadContract({
    abi: presaleContract.abi,
    address: presaleContract.address as Address,
    functionName: "getDonatedTotals",
    chainId: 56,
  });

  const { data: totalDonatedBASE, refetch: r2 } = useReadContract({
    abi: presaleContract.abi,
    address: presaleContract.address as Address,
    functionName: "getDonatedTotals",
    chainId: 8453,
  });

  const { data: totalDonatedARB, refetch: r3 } = useReadContract({
    abi: presaleContract.abi,
    address: presaleContract.address as Address,
    functionName: "getDonatedTotals",
    chainId: 42161,
  });

  const { data: totalDonatedCARD, refetch: r4 } = useReadContract({
    abi: CreditCardSale.abi,
    address: CreditCardSale.address as Address,
    functionName: "getDonatedTotals",
    chainId: 56,
  });

  useEffect(() => {
    if (totalDonatedETH) {
      const data = totalDonatedETH as [bigint, bigint, bigint];
      setETHDonations({
        amountETH: formatEther(data[0] as bigint),
        amountUSDC: formatUnits(data[1] as bigint, 6),
        amountUSDT: formatUnits(data[2] as bigint, 6),
      });
    }
  }, [totalDonatedETH]);

  useEffect(() => {
    if (totalDonatedBNB) {
      const data = totalDonatedBNB as [bigint, bigint, bigint];
      setBNBDonations({
        amountETH: formatEther(data[0] as bigint),
        amountUSDC: formatEther(data[1] as bigint),
        amountUSDT: formatEther(data[2] as bigint),
      });
    }
  }, [totalDonatedBNB]);

  useEffect(() => {
    if (totalDonatedBASE) {
      const data = totalDonatedBASE as [bigint, bigint, bigint];
      setBASEDonations({
        amountETH: formatEther(data[0] as bigint),
        amountUSDC: formatUnits(data[1] as bigint, 6),
        amountUSDT: formatUnits(data[2] as bigint, 6),
      });
    }
  }, [totalDonatedBASE]);

  useEffect(() => {
    if (totalDonatedARB) {
      const data = totalDonatedARB as [bigint, bigint, bigint];
      setARBDonations({
        amountETH: formatEther(data[0] as bigint),
        amountUSDC: formatUnits(data[1] as bigint, 6),
        amountUSDT: formatUnits(data[2] as bigint, 6),
      });
    }
  }, [totalDonatedARB]);

  useEffect(() => {
    if (totalDonatedCARD) {
      const data = totalDonatedCARD as [bigint, bigint, bigint];
      setCardDonations({
        amountETH: formatEther(data[0] as bigint),
        amountUSDC: formatEther(data[1] as bigint),
        amountUSDT: formatEther(data[2] as bigint),
      });
    }
  }, [totalDonatedCARD]);

  // User Donations
  const { data: userDonatedETH, refetch: r00 } = useReadContract({
    abi: presaleContract.abi,
    address: presaleContract.address as Address,
    functionName: "donated",
    chainId: 1,
    args: [address],
  });

  const { data: userDonatedBNB, refetch: r11 } = useReadContract({
    abi: presaleContract.abi,
    address: presaleContract.address as Address,
    functionName: "donated",
    chainId: 56,
    args: [address],
  });

  const { data: userDonatedBASE, refetch: r22 } = useReadContract({
    abi: presaleContract.abi,
    address: presaleContract.address as Address,
    functionName: "donated",
    chainId: 8453,
    args: [address],
  });

  const { data: userDonatedARB, refetch: r33 } = useReadContract({
    abi: presaleContract.abi,
    address: presaleContract.address as Address,
    functionName: "donated",
    chainId: 42161,
    args: [address],
  });

  const { data: userDonatedCARD, refetch: r44 } = useReadContract({
    abi: CreditCardSale.abi,
    address: CreditCardSale.address as Address,
    functionName: "donated",
    chainId: 56,
    args: [address],
  });

  useEffect(() => {
    if (userDonatedETH) {
      const data = userDonatedETH as ChainDonation;
      setUserETHDonations({
        amountETH: formatEther(data?.amountETH || BigInt(0)),
        amountUSDC: formatUnits(data?.amountUSDC || BigInt(0), 6),
        amountUSDT: formatUnits(data?.amountUSDT || BigInt(0), 6),
      });
    }
  }, [userDonatedETH]);

  useEffect(() => {
    if (userDonatedBNB) {
      const data = userDonatedBNB as ChainDonation;
      setUserBNBDonations({
        amountETH: formatEther(data?.amountETH || BigInt(0)),
        amountUSDC: formatEther(data?.amountUSDC || BigInt(0)),
        amountUSDT: formatEther(data?.amountUSDT || BigInt(0)),
      });
    }
  }, [userDonatedBNB]);

  useEffect(() => {
    if (userDonatedBASE) {
      const data = userDonatedBASE as ChainDonation;
      setUserBASEDonations({
        amountETH: formatEther(data?.amountETH || BigInt(0)),
        amountUSDC: formatUnits(data?.amountUSDC || BigInt(0), 6),
        amountUSDT: formatUnits(data?.amountUSDT || BigInt(0), 6),
      });
    }
  }, [userDonatedBASE]);

  useEffect(() => {
    if (userDonatedARB) {
      const data = userDonatedARB as ChainDonation;
      setUserARBDonations({
        amountETH: formatEther(data?.amountETH || BigInt(0)),
        amountUSDC: formatUnits(data?.amountUSDC || BigInt(0), 6),
        amountUSDT: formatUnits(data?.amountUSDT || BigInt(0), 6),
      });
    }
  }, [userDonatedARB]);

  useEffect(() => {
    if (userDonatedCARD) {
      const data = userDonatedCARD as ChainDonation;
      setUserCardDonations({
        amountETH: formatEther(data?.amountETH || BigInt(0)),
        amountUSDC: formatEther(data?.amountUSDC || BigInt(0)),
        amountUSDT: formatEther(data?.amountUSDT || BigInt(0)),
      });
    }
  }, [userDonatedCARD]);

  const totalDonated = (): string => {
    const totalETH =
      parseFloat(ethDonations.amountETH) +
      parseFloat(baseDonations.amountETH) +
      parseFloat(arbDonations.amountETH);
    const totalBNB =
      parseFloat(bnbDonations.amountETH) + parseFloat(cardDonations.amountETH);

    const totalUSDC =
      parseFloat(ethDonations.amountUSDC) +
      parseFloat(baseDonations.amountUSDC) +
      parseFloat(arbDonations.amountUSDC) +
      parseFloat(bnbDonations.amountUSDC) +
      parseFloat(cardDonations.amountUSDC);
    const totalUSDT =
      parseFloat(ethDonations.amountUSDT) +
      parseFloat(baseDonations.amountUSDT) +
      parseFloat(arbDonations.amountUSDT) +
      parseFloat(bnbDonations.amountUSDT) +
      parseFloat(cardDonations.amountUSDT);

    const ETH_VALUE = totalETH * priceOfETH;
    const BNB_VALUE = totalBNB * priceOfBNB;

    const TOTAL_VALUE = ETH_VALUE + BNB_VALUE + totalUSDC + totalUSDT;

    return TOTAL_VALUE.toFixed(2);
  };

  const userContribution = (): string => {
    const totalETH =
      parseFloat(userETHDonations.amountETH) +
      parseFloat(userBASEDonations.amountETH) +
      parseFloat(userARBDonations.amountETH);
    const totalBNB =
      parseFloat(userBNBDonations.amountETH) +
      parseFloat(userCardDonations.amountETH);

    const totalUSDC =
      parseFloat(userETHDonations.amountUSDC) +
      parseFloat(userBASEDonations.amountUSDC) +
      parseFloat(userARBDonations.amountUSDC) +
      parseFloat(userBNBDonations.amountUSDC) +
      parseFloat(userCardDonations.amountUSDC);
    const totalUSDT =
      parseFloat(userETHDonations.amountUSDT) +
      parseFloat(userBASEDonations.amountUSDT) +
      parseFloat(userARBDonations.amountUSDT) +
      parseFloat(userBNBDonations.amountUSDT) +
      parseFloat(userCardDonations.amountUSDT);

    const ETH_VALUE = totalETH * priceOfETH;
    const BNB_VALUE = totalBNB * priceOfBNB;

    const TOTAL_VALUE = ETH_VALUE + BNB_VALUE + totalUSDC + totalUSDT;

    return TOTAL_VALUE.toFixed(2);
  };

  useEffect(() => {
    // set timeout to run function every 3 seconds
    const interval = setInterval(() => {
      r0();
      r1();
      r2();
      r3();
      r4();
      r00();
      r11();
      r22();
      r33();
      r44();
      refetchBNBPrice();
      refetchETHPrice();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const progressBarFillAmount = (): number => {
    const tRaised = parseFloat(totalDonated()) + 220000;
    const raiseOffset = 150000;
    return 100 * (tRaised / (tRaised + raiseOffset));
  };

  const calculateTimeLeft = () => {
    const nowTime = new Date().getTime() / 1000;
    const difference =
      nowTime > countDownDate
        ? nowTime - countDownDate
        : countDownDate - nowTime;
    const days = Math.floor(difference / (60 * 60 * 24));
    const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((difference % (60 * 60)) / 60);
    const seconds = Math.floor(difference % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <h4 className="text-[14px] text-white/40">Your Contribution</h4>
        <p className="text-[14px]">
          $
          {parseFloat(userContribution()).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })}
        </p>
      </div>
      {/* total contribution */}
      <div className="mt-5">
        {/* <h4 className="text-sm">Total Contributed</h4> */}
        {/* <p className="text-lg">
            $
            {parseFloat(totalDonated()).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
            })}
            </p> */}
        <div className="mt-2 mb-2 relative w-full">
          <h4 className="grayTextGradient text-[16px]">Total Raised</h4>
          <div className="mt-5">
            <Progress value={progressBarFillAmount()} />
          </div>
          {/* remaining */}
          {/* <p className="text-[#1c81cf] sm:text-base absolute right-4 top-1/2 transform -translate-y-1/2 font-semibold">
            Total Raised: $
            {parseFloat(totalDonated()).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </p> */}
        </div>
        <div className="w-full flex justify-between items-center">
          {/* current price */}
          <div>
            <p className="text-[14px] text-white/40">Current Price</p>
            <p className="text-[14px] font-medium">
              1 $MINE = <span>${prices[currentTier]}</span>
            </p>
          </div>
          {/* next price */}
          <div>
            <p className="text-[14px] text-white/40">Next Price</p>
            <p className="text-[14px] font-medium">
              1 $MINE = <span>${prices[currentTier + 1]}</span>
            </p>
          </div>{" "}
        </div>
        <p className="mt-8 grayTextGradient text-[16px]">
          Time Since Last Price Increase:
        </p>
        <div className="mt-5 flex justify-evenly items-center">
          {/* days */}
          <div className="glassButtonContainer">
            <div className="glassButton">
              <p>{timeLeft.days}D</p>
            </div>
          </div>
          {/* semicolor */}
          <p className="text-[14px] font-medium">:</p>
          {/* hours */}
          <div className="glassButtonContainer">
            <div className="glassButton">
              <p>{timeLeft.hours}H</p>
            </div>
          </div>
          {/* semicolor */}
          <p className="text-[14px] font-medium">:</p>
          {/* minutes */}
          <div className="glassButtonContainer">
            <div className="glassButton">
              <p>{timeLeft.minutes}M</p>
            </div>
          </div>
          {/* semicolor */}
          <p className="text-[14px] font-medium">:</p>
          {/* seconds */}
          <div className="glassButtonContainer">
            <div className="glassButton">
              <p>{timeLeft.seconds}S</p>
            </div>
          </div>
        </div>
        {/* <p>
          {timeLeft.days > 0 ? timeLeft.days + "D " : ""}{" "}
          {timeLeft.hours > 0 ? timeLeft.hours + "H " : ""}{" "}
          {timeLeft.minutes > 0 ? timeLeft.minutes + "M " : ""}{" "}
          {timeLeft.seconds > 0 ? timeLeft.seconds + "S " : ""}
        </p> */}
      </div>
    </div>
  );
};
