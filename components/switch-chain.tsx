"use client";
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
import { useChains, useAccount } from "wagmi";
import { Card, CardContent } from "./ui/card";
import { useSwitchChain } from "wagmi";
import { toast } from "sonner";
import { RecycleIcon } from "lucide-react";

export const SwitchChain = () => {
  const { isConnected } = useAccount();
  const chains = useChains();
  const { switchChain } = useSwitchChain();

  // Switch chain
  const handleChainSwitch = (id: number) => {
    switchChain(
      { chainId: id },
      {
        onSuccess: (data) => {
          toast.success(`Switched to ${data.name}`);
        },
        onError: (error) => {
          console.error("Error switching chain:", error.message);
          toast.error("Failed to switch chain.");
        },
        onSettled: () => {
          toast.dismiss();
        },
      }
    );
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"default"} disabled={!isConnected}>
          Switch Chain <RecycleIcon className="w-4 h-4 ml-2" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className=" h-[36rem] w-[25rem] rounded-lg overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Switch Chains</AlertDialogTitle>
          <AlertDialogDescription>
            Switch from the available list of chains. <br /> You can configure
            chains in the{" "}
            <code className="bg-accent p-1 rounded-md">provider.tsx</code> file.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {chains &&
          chains.map((chain, index) => (
            <Card
              key={index}
              onClick={() => handleChainSwitch(chain.id)}
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <CardContent>
                <div className="grid justify-start items-center">
                  <p className="text-xl pt-5">{chain.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">
            <Button className="w-full">Cancel</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
