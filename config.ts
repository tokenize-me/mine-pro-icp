interface DisplayOptions {
  showLogoTopLeft: boolean;
  showCompanyNameTopLeft: boolean;
  showProjectNameTopLeft: boolean;
  showPrimaryDescription: boolean;
  showSecondaryDescription: boolean;
  showBackgroundImage: boolean;
}

interface Socials {
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  youtube?: string;
  reddit?: string;
}

interface PresaleInstructions {
  stepNumber: number;
  action: string;
  description: string;
  icon: string;
}

interface PresaleDetails {
  minContribution: string;
  maxContribution: string;
  presaleStatus: string;
  affiliateId: number;
  chainName: string;
  token: string;
  hasHardcap: boolean;
}

interface Config {
  siteTitle: string;
  siteDescription: string;
  companyName: string;
  projectName?: string;
  primaryDescription?: string;
  secondaryDescription?: string;
  displayOptions?: DisplayOptions;
  socials: Socials;
  logoPath: string;
  logoWidth: number;
  logoHeight: number;
  backgroundImagePath?: string;
  backgroundImageOpacity: number;
  presaleInstructions: PresaleInstructions[];
  presaleDetails: PresaleDetails;
}

// set values for config here
const config: Config = {
  siteTitle: "MinePro",
  siteDescription: "Bitcoin Mining For The People",
  companyName: "MinePro",
  projectName: "MinePro Public Sale",
  primaryDescription: "Bitcoin Mining For The People",
  // secondaryDescription: "Default Secondary Description",
  displayOptions: {
    showLogoTopLeft: true,
    showCompanyNameTopLeft: false, // note: only showCompanyNameTopLeft or showProjectNameTopLeft should be true
    showProjectNameTopLeft: true,
    showPrimaryDescription: true,
    showSecondaryDescription: true,
    showBackgroundImage: false,
  },
  socials: {
    website: "https://www.mineprobusiness.net/",
    twitter: "https://twitter.com/MineProBusiness",
    telegram: "https://t.me/MineProBitcoin",
    discord: "https://discord.com/invite/dWtWJjwNYy",
  },
  logoPath: "/logo.svg",
  logoWidth: 50,
  logoHeight: 50,
  backgroundImagePath: "/background.jpg",
  backgroundImageOpacity: 50, // 0 - 100 (increments of 5)
  presaleInstructions: [
    {
      stepNumber: 1,
      action: "Connect",
      description: "Connect your wallet and enter an amount to contribute.",
      icon: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244",
    },
    {
      stepNumber: 2,
      action: "Contribute",
      description:
        "Enter the amount you want to contribute and click 'Contribute'.",
      icon: "M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9",
    },
    {
      stepNumber: 3,
      action: "Confirm",
      description:
        "Confirm The Transaction To Secure Your Spot In The Presale.",
      icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
  ],
  presaleDetails: {
    minContribution: "0.1 ETH",
    maxContribution: "1 ETH",
    presaleStatus: "Live", // "Upcoming" | "Live" | "Ended"
    affiliateId: 0,
    chainName: "Ethereum",
    token: "ETH",
    hasHardcap: true, // when true, replace maxContribution with hardcap
  },
};

export default config;
