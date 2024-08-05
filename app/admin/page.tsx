"use client"
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { presaleContract, CreditCardSale, PriceOracle } from "@/constants";
import { Address, parseEther, formatEther, formatUnits, parseUnits, zeroAddress } from "viem";

export default function Admin() {

    type Donation = {
        amountETH: string;
        amountUSDC: string;
        amountUSDT: string;
    }
    const DEFAULT_DONATION: Donation = { amountETH: "0", amountUSDC: "0", amountUSDT: "0" }

    // Token Prices
    const [priceOfBNB, setPriceOfBNB] = useState<number>(575);
    const [priceOfETH, setPriceOfETH] = useState<number>(3360);

    // Totals
    const [ethDonations, setETHDonations] = useState<Donation>(DEFAULT_DONATION);
    const [bnbDonations, setBNBDonations] = useState<Donation>(DEFAULT_DONATION);
    const [baseDonations, setBASEDonations] = useState<Donation>(DEFAULT_DONATION);
    const [arbDonations, setARBDonations] = useState<Donation>(DEFAULT_DONATION);
    const [cardDonations, setCardDonations] = useState<Donation>(DEFAULT_DONATION);

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
    }, [priceOfBNBCall])

    useEffect(() => {
        if (priceOfETHCall) {
            const data = priceOfETHCall as bigint;
            setPriceOfETH(parseFloat(formatUnits(data, 18)));
        }
    }, [priceOfETHCall])

    

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
    }, [totalDonatedETH])

    useEffect(() => {
        if (totalDonatedBNB) {
            const data = totalDonatedBNB as [bigint, bigint, bigint];
            setBNBDonations({
                amountETH: formatEther(data[0] as bigint),
                amountUSDC: formatEther(data[1] as bigint),
                amountUSDT: formatEther(data[2] as bigint),
            });
        }
    }, [totalDonatedBNB])


    useEffect(() => {
        if (totalDonatedBASE) {
            const data = totalDonatedBASE as [bigint, bigint, bigint];
            setBASEDonations({
                amountETH: formatEther(data[0] as bigint),
                amountUSDC: formatUnits(data[1] as bigint, 6),
                amountUSDT: formatUnits(data[2] as bigint, 6),
            });
        }
    }, [totalDonatedBASE])


    useEffect(() => {
        if (totalDonatedARB) {
            const data = totalDonatedARB as [bigint, bigint, bigint];
            setARBDonations({
                amountETH: formatEther(data[0] as bigint),
                amountUSDC: formatUnits(data[1] as bigint, 6),
                amountUSDT: formatUnits(data[2] as bigint, 6),
            });
        }
    }, [totalDonatedARB])

    useEffect(() => {
        if (totalDonatedCARD) {
            const data = totalDonatedCARD as [bigint, bigint, bigint];
            setCardDonations({
                amountETH: formatEther(data[0] as bigint),
                amountUSDC: formatEther(data[1] as bigint),
                amountUSDT: formatEther(data[2] as bigint),
            });
        }
    }, [totalDonatedCARD])


    const totalDonated = (): string => {
        
        const totalETH = parseFloat(ethDonations.amountETH) + parseFloat(baseDonations.amountETH) + parseFloat(arbDonations.amountETH);
        const totalBNB = parseFloat(bnbDonations.amountETH) + parseFloat(cardDonations.amountETH);

        const totalUSDC = parseFloat(ethDonations.amountUSDC) + parseFloat(baseDonations.amountUSDC) + parseFloat(arbDonations.amountUSDC) + parseFloat(bnbDonations.amountUSDC) + parseFloat(cardDonations.amountUSDC);
        const totalUSDT = parseFloat(ethDonations.amountUSDT) + parseFloat(baseDonations.amountUSDT) + parseFloat(arbDonations.amountUSDT) + parseFloat(bnbDonations.amountUSDT) + parseFloat(cardDonations.amountUSDT);

        const ETH_VALUE = totalETH * priceOfETH;
        const BNB_VALUE = totalBNB * priceOfBNB;

        const TOTAL_VALUE = ETH_VALUE + BNB_VALUE + totalUSDC + totalUSDT;

        return TOTAL_VALUE.toFixed(2)
    };

    const showdonation = (donation: Donation, donationName: string) => {

        return(
            <div className="mb-6">
                <h4 className="text-lg font-bold">{donationName}</h4>
                <p className="text-base">
                {parseFloat(donation.amountETH).toFixed(4)} {(donationName == "BNB Contributions" || donationName == "Card Contributions") ? 'BNB' : 'ETH'}
                </p>
                {
                    donationName !== "Card Contributions" &&
                    <>
                        <p className="text-base">
                        {parseFloat(donation.amountUSDC).toFixed(4)} USDC
                        </p>
                        <p className="text-base">
                        {parseFloat(donation.amountUSDT).toFixed(4)} USDT
                        </p>
                    </>
                }
                
            </div>
        )
    }

    useEffect(() => {
        // set timeout to run function every 3 seconds
        const interval = setInterval(() => {
        r0();
        r1();
        r2();
        r3();
        r4();
        refetchBNBPrice();
        refetchETHPrice();
        }, 3000);
        return () => clearInterval(interval);
    }, []);


    return (
        <main className="min-h-screen mt-28 mx-4 lg:mx-8">
            <div className="flex flex-col md:flex-row-reverse justify-center gap-12 lg:gap-20 xl:gap-24 md:items-center">
            
        </div>

        {/* total contribution */}
        <div className="mt-4">
            <div>
                {showdonation(ethDonations, "ETH Contributions")}
                {showdonation(bnbDonations, "BNB Contributions")}
                {showdonation(baseDonations, "BASE Contributions")}
                {showdonation(arbDonations, "ARB Contributions")}
                {showdonation(cardDonations, "Card Contributions")}
            </div>
            <h4 className="text-2xl font-bold">Total Contributed</h4>
            <p className="text-lg font-bold">
            $
            {parseFloat(totalDonated()).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
            })}
            </p>
        </div>
        </main>
    );
};
