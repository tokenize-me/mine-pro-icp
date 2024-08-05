import { NextRequest, NextResponse } from "next/server";
import { signSmartContractData } from "@wert-io/widget-sc-signer";

export async function GET(req: NextRequest, res: NextResponse) {
  // get the user's address, the amount of the commodity that should be sent to the contract method, and the input data of the contract method
//   const { address, buyAmount, inputData } = await req.json();

  // get the private key for WERT
  
    // default state
    let buyAmount = 5;
    let address = "0x579aCc09d9783400A4e0777C62Bd1fC693564F3D"
    let inputData = "0x94bf804d0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000579acc09d9783400a4e0777c62bd1fc693564f3d"

  try {

    const addressParam = req.nextUrl.searchParams.get("address");
    const buyAmountParam = req.nextUrl.searchParams.get("buyAmount");
    const inputDataParam = req.nextUrl.searchParams.get("inputData");

    const PRIVATE_KEY = process.env.WERT_PRIVATE_KEY;

    if (buyAmountParam != null) {
        buyAmount = parseFloat(buyAmountParam);
    }

    if (addressParam != null) {
        address = addressParam;
    }

    if (inputDataParam != null) {
        inputData = inputDataParam;
    }

    // create wert widget
    const signedData = signSmartContractData(
      {
        address: address, // user's address
        commodity: "BNB",
        commodity_amount: buyAmount, // the crypto amount that should be sent to the contract method
        network: "bsc",
        sc_address: "0xF8423C0CbAaBAdF5987a9D8fd340152B6262616D", // your SC address
        sc_input_data: inputData,
      },
      PRIVATE_KEY!
    );

    return new NextResponse(JSON.stringify(signedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error GetSignedData:", error);
    return new NextResponse(
      JSON.stringify({
        message: error,
      }),
      { status: 500 }
    );
  }
}
