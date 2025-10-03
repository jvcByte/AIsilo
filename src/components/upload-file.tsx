// src/components/UploadFile.tsx
import { useState } from 'react';
import { type Address } from 'viem';
import { useAccount, useSignMessage } from 'wagmi';
import { useDocuments } from '../hooks/use-documents';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  Upload,
  FileText,
  Lock,
  PenTool,
  CheckCircle2
} from 'lucide-react';
import { encryptFile } from '../lib/encryption';
import { pinata } from '@/lib/ipfs';
import { toast } from 'react-hot-toast';

type UploadStep = 'file' | 'sign' | 'upload' | 'complete';

interface UploadState {
  step: UploadStep;
  file: File | null;
  signature: Address | null;
  cid: string | null;
  iv: string | null;
}

export function UploadFile() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { uploadDocument, isLoading: isContractLoading } = useDocuments();

  const [state, setState] = useState<UploadState>({
    step: 'file',
    file: null,
    signature: null,
    cid: null,
    iv: null
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Reset function
  const resetUpload = () => {
    setState({
      step: 'file',
      file: null,
      signature: null,
      cid: null,
      iv: null
    });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error('File size must be less than 100MB', {
        className: "toast-error"
      });
      return;
    }

    setState(prev => ({
      ...prev,
      file: selectedFile,
      step: 'sign'
    }));
  };

  // Handle message signing
  const handleSignMessage = async () => {
    if (!address) {
      toast.error('Wallet not connected', {
        className: "toast-error"
      });
      return;
    }

    setIsProcessing(true);
    const signingToast = toast.loading('Waiting for signature...', {
      className: "toast-loading"
    });

    try {
      const signature = await signMessageAsync({
        message: 'Encrypt My File'
      });

      setState(prev => ({
        ...prev,
        signature,
        step: 'upload'
      }));

      toast.success('Message signed successfully', {
        id: signingToast,
        className: "toast-success"
      });
    } catch (error) {
      toast.error(`Failed to sign message: ${error}`, {
        id: signingToast,
        className: "toast-error"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file upload to IPFS
  const handleUpload = async () => {
    if (!state.file || !state.signature || !address) {
      toast.error('Missing required data for upload', {
        className: "toast-error"
      });
      return;
    }

    setIsProcessing(true);
    const uploadToast = toast.loading('Encrypting file...', { className: "toast-loading" });

    try {
      // Step 1: Encrypt file
      toast.loading('Encrypting file...', { id: uploadToast, className: "toast-loading" });
      const { encrypted, iv } = await encryptFile(state.file, state.signature);

      const encryptedFile = new File([encrypted], state.file.name, {
        type: state.file.type
      });

      // Step 2: Get presigned URL
      toast.loading('Getting upload URL...', { id: uploadToast, className: "toast-loading" });
      const serverUrl = import.meta.env.VITE_SERVER_URL;

      if (!serverUrl) {
        toast.error('Server URL not configured', {
          className: "toast-error"
        });
        return;
      }

      const urlResponse = await fetch(`${serverUrl}/presigned_url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!urlResponse.ok) {
        const errorText = await urlResponse.text();
        toast.error(`Server error: ${urlResponse.status} - ${errorText}`, {
          className: "toast-error"
        });
        return;
      }

      const contentType = urlResponse.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        toast.error('Invalid server response format', {
          className: "toast-error"
        });
        return;
      }

      const { url: presignedUrl } = await urlResponse.json();

      // Step 3: Upload to IPFS
      toast.loading('Uploading to IPFS...', { id: uploadToast, className: "toast-loading" });
      const upload = await pinata.upload
        .public.file(encryptedFile)
        .url(presignedUrl)
        .keyvalues({
          iv: iv,
          user: address
        });

      if (!upload.cid) {
        toast.error('Failed to get CID from upload', {
          className: "toast-error"
        });
        return;
      }

      // Update state with upload results
      setState(prev => ({
        ...prev,
        cid: upload.cid,
        iv,
        step: 'complete'
      }));

      toast.success('File uploaded to IPFS successfully!', {
        id: uploadToast,
        className: "toast-success"
      });

      // Step 4: Call smart contract
      await handleContractWrite(upload.id, upload.cid);

    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unknown error occurred';
      toast.error(`Upload failed: ${errorMessage}`, { id: uploadToast, className: "toast-error" });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle smart contract write
  const handleContractWrite = async (docId: string, cid: string) => {
    if (!uploadDocument) {
      toast.error('Contract write function not available', {
        className: "toast-error"
      });
      return;
    }

    const contractToast = toast.loading('Writing to blockchain...', {
      className: "toast-loading"
    });

    try {
      await uploadDocument({
        docId: docId,
        cId: cid,
      });

      toast.success('Document registered on blockchain!', {
        id: contractToast,
        className: "toast-success"
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Transaction failed';
      toast.error(`Blockchain registration failed: ${errorMessage}`, {
        id: contractToast,
        className: "toast-error"
      });
    }
  };

  // Render: Not connected state
  if (!isConnected) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto bg-gradient-to-tl from-muted to-background">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to upload files securely.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = isProcessing || isContractLoading;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-foreground">Upload Document</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* File Selection Card */}
        <Card className='bg-gradient-to-br from-muted to-background'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              File Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file" className="text-foreground">
                  Select File
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full mt-2"
                  disabled={state.step !== 'file' || isLoading}
                />
                {state.file && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 flex-wrap">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">{state.file.name}</span>
                      <Badge variant="outline">{state.file.type || 'unknown'}</Badge>
                      <Badge variant="secondary">
                        {(state.file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signature Card */}
        {state.step === 'sign' && state.file && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Sign Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    To encrypt your file securely, please sign this message with your wallet.
                    Your signature will be used to generate a unique encryption key.
                  </AlertDescription>
                </Alert>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-sm font-mono">"Encrypt My File"</code>
                </div>
                <Button
                  onClick={handleSignMessage}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Signing Message...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <PenTool className="w-5 h-5" />
                      Sign Message to Continue
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Card */}
        {state.step === 'upload' && state.signature && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload to IPFS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Your file is ready to be encrypted and uploaded to IPFS.
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleUpload}
                disabled={isLoading}
                className="w-full h-12 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Encrypt & Upload to IPFS
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success Card */}
        {state.step === 'complete' && state.cid && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                Upload Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-500">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Your file has been successfully encrypted, uploaded to IPFS, and registered on the blockchain.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>IPFS CID:</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-sm break-all">{state.cid}</code>
                </div>
              </div>
              <Button
                onClick={resetUpload}
                variant="outline"
                className="w-full"
              >
                Upload Another File
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}