// src/components/DownloadFile.tsx
import { useState } from "react";
import { type Address } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Download,
  FileText,
  Lock,
  AlertTriangle,
  PenTool,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { decryptFile } from "../lib/encryption";
import { pinata } from "@/lib/ipfs";
import { toast } from "react-hot-toast";
import { Alert, AlertDescription } from "./ui/alert";
import { useSearch } from "@tanstack/react-router";

type DownloadStep = "input" | "download" | "complete";

interface DownloadState {
  step: DownloadStep;
  cid: string;
  iv: string | null;
  signature: Address | null;
  decryptedFile: Blob | null;
  fileName: string;
  isDownloading: boolean;
  isDecrypting: boolean;
  error: string | null;
}

export function DownloadFile() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { cid: urlCid } = useSearch({ from: "/_authenticated/download-file" });

  const [state, setState] = useState<DownloadState>({
    step: "input",
    cid: urlCid || "",
    iv: null,
    signature: null,
    decryptedFile: null,
    fileName: "",
    isDownloading: false,
    isDecrypting: false,
    error: null,
  });

  // Handle CID input
  const handleCidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      cid: e.target.value.trim(),
    }));
  };

  // Handle signature
  const handleSignMessage = async () => {
    if (!address) {
      toast.error("Wallet not connected");
      return;
    }

    setState((prev) => ({ ...prev, error: null }));
    try {
      const signature = await signMessageAsync({
        message: "Encrypt My File",
      });

      setState((prev) => ({
        ...prev,
        signature,
        step: "download",
      }));

      toast.success("Message signed successfully", {
        className: "toast-success",
      });
    } catch (error) {
      toast.error(`Failed to sign message: ${error}`, {
        className: "toast-error",
      });
      setState((prev) => ({ ...prev, error: "Failed to sign message" }));
    }
  };

  // Handle file download and decryption
  const handleDownload = async () => {
    if (!state.cid || !state.signature) {
      toast.error("Missing required data", {
        className: "toast-error",
      });
      return;
    }

    setState((prev) => ({ ...prev, isDownloading: true, error: null }));

    try {
      // Step 1: Download from IPFS using gateway
      const { data: file } = await pinata.gateways.public.get(state.cid);
      if (!file) {
        toast.error("File not found", {
          className: "toast-error",
        });
        return;
      }
      const url = `https://api.pinata.cloud/v3/files/public?cid=${state.cid}`;
      const options = {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5Yzc3YjZiNC04NmRkLTQ2NmEtODAyZi1iOTIzNjA2ZGE3ODUiLCJlbWFpbCI6Imp2Yzg0NjNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImY2ZjlhYjMwMDY4MjU3OWQ5ODdjIiwic2NvcGVkS2V5U2VjcmV0IjoiYjQ1MjkzNzRkYTU3NmY2NWFlMGI0OTc4MDFjMjA4MTFjM2NkMWU1NTllNWE4OTZmOTNiOTNhZGMxMGQwNjg1ZiIsImV4cCI6MTc5MTAxMzg2M30.44PxLwpxN89qoLeqyvTcWRAtGYSbK4ZfbGS3HPJHqLg",
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        toast.error(
          `Failed to fetch from Pinata API: ${response.status} ${response.statusText}`,
          {
            className: "toast-error",
          },
        );
        return;
      }
      const result = await response.json();

      // Check if we have files in the response
      if (!result.data?.files || result.data.files.length === 0) {
        toast.error("No files found for this CID", {
          className: "toast-error",
        });
        return;
      }
      const fileMetaData = result.data.files[0];
      const iv = fileMetaData.keyvalues.iv;

      if (!iv) {
        toast.error("IV (Initialization Vector) not found.", {
          className: "toast-error",
        });
        return;
      }

      // Step 2: Decrypt the file
      setState((prev) => ({ ...prev, isDecrypting: true }));

      const decryptedFile = await decryptFile(
        file as string,
        iv,
        state.signature,
        state.fileName || "FileIt",
        "application/octet-stream",
      );

      setState((prev) => ({
        ...prev,
        decryptedFile,
        step: "complete",
        isDownloading: false,
        isDecrypting: false,
      }));

      toast.success("File decrypted successfully!", {
        className: "toast-success",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Download/Decryption failed: ${errorMessage}`, {
        className: "toast-error",
      });
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isDownloading: false,
        isDecrypting: false,
      }));
    }
  };

  // Handle file download
  const handleFileDownload = () => {
    if (!state.decryptedFile) return;

    const url = URL.createObjectURL(state.decryptedFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = state.fileName || "FileIt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("File downloaded successfully!", {
      className: "toast-success",
    });
  };

  // Reset function
  const resetDownload = () => {
    setState({
      step: "input",
      cid: "",
      iv: null,
      signature: null,
      decryptedFile: null,
      fileName: "",
      isDownloading: false,
      isDecrypting: false,
      error: null,
    });
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-4 bg-gradient-to-tl from-muted to-background">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to download and decrypt files.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <Download className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-foreground">
          Decrypt & Download File
        </h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* CID Input Card */}
        <Card className="bg-gradient-to-br from-muted to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              File CID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cid" className="text-foreground">
                  Enter IPFS CID
                </Label>
                <Input
                  id="cid"
                  type="text"
                  value={state.cid}
                  onChange={handleCidChange}
                  placeholder="QmXxx... or bafyxxx..."
                  className="w-full mt-2 font-mono text-sm"
                />
              </div>
              {state.step === "input" && state.cid && !state.signature && (
                <Button onClick={handleSignMessage} className="w-full">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-5 h-5" />
                    Sign Message to Continue
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Signature Step */}
        {state.step === "download" && state.signature && (
          <Card className="bg-gradient-to-br from-muted to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Ready to Download
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Message signed successfully. Ready to decrypt and download
                    your file.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label htmlFor="fileName">Output File Name (Optional)</Label>
                  <Input
                    id="fileName"
                    placeholder="Enter desired file name..."
                    value={state.fileName}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        fileName: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={handleDownload}
                  disabled={state.isDownloading || state.isDecrypting}
                  className="w-full h-12 text-lg"
                >
                  {state.isDownloading || state.isDecrypting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {state.isDownloading ? "Decrypting..." : "Decrypting..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Decrypt File
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Card */}
        {state.step === "complete" && state.decryptedFile && (
          <Card className="bg-gradient-to-tr from-muted to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                Download Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-500">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Your file has been successfully decrypted!
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>File Name:</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">
                    {state.fileName || "FileIt"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleFileDownload}
                  variant="default"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
                <Button
                  onClick={resetDownload}
                  variant="outline"
                  className="flex-1"
                >
                  Decrypt Another File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {state.error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
