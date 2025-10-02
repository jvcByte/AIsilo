// src/components/UploadFile.tsx
import { useState } from 'react';
import { useAccount } from 'wagmi';
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
  AlertTriangle
} from 'lucide-react';

export function UploadFile() {
  const { address, isConnected } = useAccount();
  const [file, setFile] = useState<File | null>(null);

  const {
    isLoading,
    error,
    uploadDocument
  } = useDocuments();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !address) return;

    try {
      await uploadDocument({
        file
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-foreground">Upload Secure Document</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* File Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              File Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file" className="text-foreground">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full mt-2"
                />
                {file && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">{file.name}</span>
                      <Badge variant="outline">{file.type}</Badge>
                      <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Button */}
        <Card>
          <CardContent className="p-6">
            <Button
              onClick={handleSubmit}
              disabled={!file || isLoading}
              className="w-full h-12 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Encrypting & Uploading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Encrypt & Upload to IPFS
                </div>
              )}
            </Button>

            {error && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}