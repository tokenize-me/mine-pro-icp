"use client";
import { ConnectKitButton } from "connectkit";
import { Button } from "@/components/ui/button";
import { LogOutIcon, Wallet2Icon } from "lucide-react";

// CUSTOM CONNECT WALLET BUTTON
// This is a custom Connect Wallet button that uses the ConnectKitButton component. You can customize the button to your liking.
// ConnectKit gives a list of props to use for the button like ensName, truncatedAddress, isConnected, isConnecting, unsupported, and much more.
// You can use these props to customize the button as you like, as well as use any styling conventions you prefer.

export function ConnectWallet() {
  return (
    <ConnectKitButton.Custom>
      {({
        isConnected,
        show,
        ensName,
        truncatedAddress,
        isConnecting,
        unsupported,
      }) => {
        return (
          <>
            {isConnected ? (
              <Button className="orangeButton w-full" onClick={show}>
                {ensName || truncatedAddress}{" "}
                <LogOutIcon className="h-6 w-6 pl-2" />
              </Button>
            ) : (
              <Button className="orangeButton w-full" onClick={show}>
                Connect Wallet <Wallet2Icon className="h-6 w-6 pl-2" />
              </Button>
            )}
          </>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
