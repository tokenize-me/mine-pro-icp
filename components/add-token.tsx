"use client";
import Image from "next/image";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// useToken will be deprecated in the future, but is still available for now
import { useToken, useAccount } from "wagmi";
import { createWalletClient, custom, type Address } from "viem";
import { mainnet } from "viem/chains";
import { toast } from "sonner";

export const AddToken = () => {
  const { isConnected } = useAccount();
  const [tokenAddress, setTokenAddress] = useState<Address>("" as Address);
  // Get token information
  const { data: token } = useToken({
    address: tokenAddress,
  });

  // Instantiate the wallet client for Metamask
  const walletClient = createWalletClient({
    chain: mainnet,
    // The type for ethereum is handled in the types/globals.d.ts file
    transport: custom(window.ethereum!),
  });

  // Add an ERC20 token to Metamask
  const addToken = async () => {
    const success = await walletClient.watchAsset({
      type: "ERC20",
      options: {
        address: tokenAddress,
        decimals: token?.decimals!,
        symbol: token?.symbol!,
      },
    });
    if (success) {
      toast.success("Token added successfully!");
    }
    return success;
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"default"} disabled={!isConnected}>
          Add Token{" "}
          <Image
            src={"/metamask.webp"}
            width={16}
            height={16}
            alt="Metamask"
            className="ml-4"
          />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className=" h-[26rem] w-[25rem] rounded-md overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Token</AlertDialogTitle>
          <AlertDialogDescription>
            Enter in a token address to add to Metamask.
          </AlertDialogDescription>
          <div className="gap-2 flex flex-col">
            <Input
              placeholder="Token Address"
              id="token-address"
              onChange={(e) => setTokenAddress(e.target.value as Address)}
            />
            {token && (
              <>
                <Input id="token-name" disabled value={token?.name} />
                <Input id="token-symbol" disabled value={token?.symbol} />
                <Input id="token-decimals" disabled value={token?.decimals} />
              </>
            )}
            <Button onClick={addToken} disabled={!token}>
              Add Token
            </Button>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Button>Cancel</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
