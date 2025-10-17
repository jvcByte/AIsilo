import { ConnectButton, lightTheme } from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdweb/thirdweb-client";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { User } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import { truncateAddress } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateColorFromAddress } from "@/lib/utils";

interface SignInButtonProps {
  label?: string;
  connectButtonStyle?: React.CSSProperties;
  detailsButtonStyle?: React.CSSProperties;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
}

const SignInButton: React.FC<SignInButtonProps> = ({
  label = "Sign In",
  connectButtonStyle = {
    fontSize: "0.875rem sm:text-base",
    fontWeight: "normal",
    color: "var(--primary)",
    backgroundColor: "var(--background)",
    border: "2px solid var(--border)",
    height: "2.25rem",
    minWidth: "auto",
  },
  detailsButtonStyle = {
    fontSize: "0.875rem sm:text-base",
    fontWeight: "semibold",
    color: "hsl(var(--primary-foreground))",
    background:
      "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "var(--radius)",
    height: "2.25rem",
    transition: "all 0.3s ease",
    minWidth: "auto",
  },
  termsOfServiceUrl = "https://sealedtrust.com",
  privacyPolicyUrl = "https://sealedtrust.com",
}) => {
  const activeAccount = useActiveAccount();
  const avatarBg = generateColorFromAddress(activeAccount?.address);

  const wallets = [
    inAppWallet({
      auth: {
        options: ["google", "email", "passkey", "phone", "facebook", "apple"],
      },
      hidePrivateKeyExport: false,
    }),
    createWallet("io.metamask"),
    createWallet("xyz.argent"),
  ];

  const displayName = truncateAddress(activeAccount?.address);

  return (
    <ConnectButton
      client={thirdwebClient}
      wallets={wallets}
      theme={lightTheme({
        colors: {
          modalBg:
            "linear-gradient(to bottom, var(--background), var(--muted)) !important;",
          borderColor: "var(--border)",
          accentText: "var(--primary)",
          separatorLine: "var(--muted)",
          tertiaryBg: "var(--muted)",
          skeletonBg: "var(--muted-foreground)",
          primaryText: "var(--foreground)",
          secondaryText: "var(--muted-foreground)",
          selectedTextColor: "var(--primary)",
          inputAutofillBg: "var(--background)",
          secondaryButtonBg: "var(--muted)",
        },
      })}
      connectButton={{
        label,
        style: connectButtonStyle,
      }}
      connectModal={{
        size: "wide",
        title: "Welcome",
        titleIcon: "/logo.svg",
        showThirdwebBranding: false,
        termsOfServiceUrl,
        privacyPolicyUrl,
      }}
      detailsButton={{
        style: detailsButtonStyle,
        render: () => (
          <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 cursor-pointer border rounded-md p-1 sm:p-2">
            <Avatar className="w-4 h-4 sm:w-5 sm:h-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${activeAccount?.address}`}
              />
              <AvatarFallback
                className="text-xs"
                style={{ backgroundColor: avatarBg }}
              >
                <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </AvatarFallback>
            </Avatar>
            <User className="w-5 h-5 md:hidden" />
            <span className="text-xs sm:text-sm font-medium hidden xs:inline-block sm:inline-block">
              {displayName}
            </span>
          </div>
        ),
      }}
      detailsModal={{
        hideBuyFunds: true,
        hideReceiveFunds: true,
        hideSendFunds: true,
        payOptions: {
          buyWithCrypto: { testMode: true },
          buyWithFiat: { testMode: true },
        },
      }}
    />
  );
};

export default SignInButton;
