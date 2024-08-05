# Presale Notes
#### Getting Started 

This is a template application for presale sites. 

![screenshot](https://github.com/tokenize-me/presale-seed-app/assets/78001767/76f46c44-0a0c-47d1-ac57-ea044de7e07f)

## How to configure for each presale
### Front-End
1. Add assets to the 'public' folder, including: 
    - logo
    - background image (if necessary)
    - font folder (if necessary)
2. Create a favicon
    - use https://cloudconvert.com/png-to-ico and set the dimensions to 256 x 256
    - rename this file 'favicon.ico'
    - add to the /app folder
3. Edit the config.ts file to include crucial information such as company name, project name, social links, image locations, etc. 
4. Edit 'globals.css' to configure theme values. 
    - Currently, the ShadCN color palette uses light and dark mode. This may not be compatible with some brands, so opt in or out of this by using or removing the :root light and dark styles. 
    - presaleCardComponent is the styling for the presale component - edit the background or text styling here

### Web3 Connection
1. Create a WalletConnect Project ID (see 'WalletConnect' section below), paste it in the .env
2. Edit constants > index.ts to configure presale contract.
3. Edit the config.ts and configure presaleDetails
4. If some chains are not in use, remove them from app -> provider.tsx
    NOTE: We should move this to config.ts if possible. 


## Presale Features
- Min / Max Contribution info
- Presale status (live / upcoming)
- Instructions list
- Contribute
- Total raised + amount contributed

*Features to Add:*
- ...

# Web3SeedApp Notes
#### Getting Started

This is a template application for a basic web3 application. It gives the basic configuration for a web3 connection, reusable components and easy styling via Shadcnui, and a customizable connect wallet button.

## WalletConnect Project ID

A WalletConnect Project ID is needed and has to be places in the .env file. Please head over to the walletconnect website and grab a project ID -> https://cloud.walletconnect.com/sign-in

note: be sure to delete the .env file from this repo, and configure the env variable with hosting provider. 

## Chains

To add or removed chains, head over to the provider.tsx and either import or remove the import for the chain you would like to add or remove. As well as removing or adding it in the chains array in the getDefaultConfig and removing or adding the associated RPC URL in the transports. View the list of available chains here ->
https://github.com/wevm/viem/blob/main/src/chains/index.ts

## Styling

The styling is handled via Shadcn and tailwindcss. If you want to change the colors, head to the globals.css and update the hsl valutes, or head to the Shadcn website and copy and paste the theme templates they provide.

## Custom ConnectKit Button

You can customize the connect wallet button to your liking in the connect-wallet.tsx component. This button can use any styling convention and library. If you want to customize the actual modal from ConnectKit, head over to the providers.tsx file and follow the instructions in the notes. The ConnectKit components are fully customizable from top to bottom so you can tailor this to whatever design you'd like or need.

## Components

The components used are from Shadcnui. I would HIGHLY recommend sticking with it for adding more components. A simple npx install will bring in any component from the available library -> https://ui.shadcn.com/docs

## User Balance

You can change the user balance to show the balance for either native or an ERC20 token.

## Invalidating queries

With the latest version of wagmi, the watch flag has been removed and replaced with a new system to handle invalidating queries based on transactions. Here is the recommended method to handle that. When you want to run a transaction, and have a read state updated right after, you will need to import the queryClient from the provider.tsx and the useBlockNumber hook from wagmi. You will create a new blockNumber from the useBlockNumber hook, make sure to set that to watch: true, and within a useEffect, run the queryClient.invalidateQueries with a queryKey. The queryKey is a new param accessible in all read functions via wagmi, you simply destructure the read hook like { data: stuff, queryKey: stuffKey } = useReadContract and then pass the stuffKey into the queryKey of the queryClient.invalidateQueries({ queryKey: stuffKey }). And for the dependency of that useEffect for the invalidate queries, you NEED to ONLY pass the blockNumber from above. This will update the values whenever a new block number is created.
