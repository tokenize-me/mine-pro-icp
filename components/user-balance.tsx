"use client";
import { useState, useEffect } from "react";
import { useBalance, useAccount, useChainId, useChains } from "wagmi";
import { formatEther, Address, zeroAddress } from "viem";

interface UserBalanceProps {
  isConnected: boolean;
  address: Address;
  chainId: number;
  token: string;
}

export const UserBalance: React.FC<UserBalanceProps> = ({
  isConnected,
  address,
  chainId,
  token,
}) => {
  // const { address, isConnected } = useAccount();
  // const chainId = useChainId();
  const chains = useChains();
  // const [nativeTokenSymbol, setNativeTokenSymbol] = useState<string>("");

  // UPDATE THIS
  const getTokenAddressFromString = (): Address => {
    if (token == "usdc") {
      if (chainId == 1) return "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      if (chainId == 56) return "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
      if (chainId == 8453) return "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
      if (chainId == 42161) return "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
      else return zeroAddress;
    } else if (token == "usdt") {
      if (chainId == 1) return "0xdAC17F958D2ee523a2206206994597C13D831ec7";
      if (chainId == 56) return "0x55d398326f99059fF775485246999027B3197955";
      if (chainId == 8453) return "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
      if (chainId == 42161) return "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
      else return zeroAddress;
    } else return zeroAddress;
  };

  // Get's the native balance of the account
  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    // To get an ERC20 balance, you can pass the token address here.
    token: getTokenAddressFromString(),
    chainId: chainId
  });

  // Get's the native balance of the account
  const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({
    address,
    chainId: chainId
  });

  useEffect(() => {
    // set timeout to run function every 3 seconds
    const interval = setInterval(() => {
      refetchBalance();
      refetchNativeBalance();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Get the native token symbol from the chains array based on the chainId
  // useEffect(() => {
  //   if (chains) {
  //     const chain = chains.find((chain) => chain.id === chainId);
  //     setNativeTokenSymbol(chain?.nativeCurrency.symbol!);
  //   }
  // }, [chainId, chains]);

  if (!isConnected) return null;

  return (
    <div>
      <h4>
        Balance: {
          (token == "bnb" || token == "eth" || token == "arb" || token == "base") ?
          parseFloat(formatEther(nativeBalance?.value! || BigInt("0"))).toFixed(5) :
        Number((balance?.formatted || "0")).toFixed(5)
        }{" "}
        {token.toUpperCase()}
      </h4>
    </div>
  );
};
