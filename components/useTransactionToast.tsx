import { useEffect } from "react";
import { toast } from "sonner";
import { type Address } from "viem";

/**
 * Custom hook to show toast notifications based on transaction statuses and custom messages.
 *
 * @param {Object} params - The parameters for the custom hook.
 * @param {string} params.txFetchStatus - The current fetching status of the transaction.
 * @param {string} params.txStatus - The current status of the transaction.
 * @param {string} params.txHash - The transaction hash.
 * @param {string} params.loading - Custom message to show during the loading state.
 * @param {string} params.success - Custom message to show on success.
 * @param {string} params.error - Custom message to show on error.
 */
export const useTransactionToast = ({
  txFetchStatus,
  txStatus,
  txHash,
  loading,
  success,
  error,
}: {
  txFetchStatus: string;
  txStatus: string;
  txHash: Address | undefined;
  loading?: string;
  success?: string;
  error?: string;
}) => {
  // Chains and connected chain
  const url = `https://bscscan.com/tx/${txHash}`;

  // Show loading toast when fetching transaction
  useEffect(() => {
    if (txFetchStatus === "fetching") {
      toast.loading(loading || "Loading...", {
        action: {
          label: "View Transaction",
          onClick: () => window.open(url, "_blank"),
        },
        dismissible: false,
      });
    } else if (txFetchStatus === "idle") {
      toast.dismiss();
    }
  }, [txFetchStatus, loading]);

  // Show success or error toast when transaction status changes
  useEffect(() => {
    if (txStatus === "success") {
      toast.success(success || "Successful transaction!", {
        action: {
          label: "View Transaction",
          onClick: () => window.open(url, "_blank"),
        },
      });
    } else if (txStatus === "error") {
      toast.error(error || "Error", {
        action: {
          label: "View Transaction",
          onClick: () => window.open(url, "_blank"),
        },
      });
    }
  }, [txStatus, success, error]);
};