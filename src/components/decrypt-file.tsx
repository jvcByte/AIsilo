// src/components/DecryptFile.tsx
import { useState } from 'react';
import { type Address } from 'viem';
import { useAccount, useSignMessage } from 'wagmi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
    Download,
    FileText,
    Lock,
    AlertTriangle,
    PenTool,
    Key
} from 'lucide-react';
import { decryptFile } from '../lib/encryption';

export function DecryptFile() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [encryptedData, setEncryptedData] = useState('');
    const [iv, setIv] = useState('');
    const [fileName, setFileName] = useState('');
    const [mimeType, setMimeType] = useState('');
    const [signature, setSignature] = useState<Address | null>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [decryptedFile, setDecryptedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSignMessage = async () => {
        if (!address) return;

        setIsSigning(true);
        setError(null);
        try {
            const signature = await signMessageAsync({
                message: "Encrypt My File"
            });
            setSignature(signature);
        } catch (error) {
            console.error('Signing failed:', error);
            setError('Failed to sign message');
        } finally {
            setIsSigning(false);
        }
    };

    const handleDecrypt = async () => {
        if (!signature || !encryptedData || !iv || !fileName || !mimeType) return;

        setIsDecrypting(true);
        setError(null);
        try {
            const file = await decryptFile(
                encryptedData,
                iv,
                signature,
                fileName,
                mimeType
            );

            setDecryptedFile(file);
        } catch (error) {
            console.error('Decryption failed:', error);
            setError('Decryption failed - signature may not match or data corrupted');
        } finally {
            setIsDecrypting(false);
        }
    };

    const handleDownload = () => {
        if (!decryptedFile) return;

        const url = URL.createObjectURL(decryptedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = decryptedFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isConnected) {
        return (
            <>
                <div className="container mx-auto p-4">
                    <Card className="max-w-2xl mx-auto">
                        <CardContent className="p-8 text-center">
                            <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
                            <p className="text-muted-foreground">
                                Please connect your wallet to decrypt files.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="flex items-center gap-2 mb-6">
                    <Key className="w-6 h-6" />
                    <h1 className="text-2xl font-bold text-foreground">Decrypt File</h1>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Input Data */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Encrypted File Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="encrypted" className="text-foreground">Encrypted Data (Hex)</Label>
                                    <Input
                                        id="encrypted"
                                        placeholder="Enter encrypted file data..."
                                        value={encryptedData}
                                        onChange={(e) => setEncryptedData(e.target.value)}
                                        className="w-full mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="iv" className="text-foreground">IV (Initialization Vector)</Label>
                                    <Input
                                        id="iv"
                                        placeholder="Enter IV..."
                                        value={iv}
                                        onChange={(e) => setIv(e.target.value)}
                                        className="w-full mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="fileName" className="text-foreground">Output File Name</Label>
                                    <Input
                                        id="fileName"
                                        placeholder="Enter file name (e.g., document.pdf)..."
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                        className="w-full mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="mimeType" className="text-foreground">MIME Type</Label>
                                    <Input
                                        id="mimeType"
                                        placeholder="Enter MIME type (e.g., application/pdf)..."
                                        value={mimeType}
                                        onChange={(e) => setMimeType(e.target.value)}
                                        className="w-full mt-2"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Signature Step - Show when any data is entered */}
                    {(encryptedData || iv || fileName || mimeType) && !signature && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PenTool className="w-5 h-5" />
                                    Sign Message
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-muted-foreground">
                                        To decrypt your file, please sign this message with your wallet:
                                    </p>
                                    <div className="p-3 bg-muted rounded-lg">
                                        <code className="text-sm">"Encrypt My File"</code>
                                    </div>
                                    <Button
                                        onClick={handleSignMessage}
                                        disabled={isSigning}
                                        className="w-full"
                                    >
                                        {isSigning ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
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

                    {/* Decrypt Button - Show when all data is entered and signature is available */}
                    {(encryptedData && iv && fileName && mimeType && signature) && (
                        <Card>
                            <CardContent className="p-6">
                                <Button
                                    onClick={handleDecrypt}
                                    disabled={!encryptedData || !iv || !signature || !fileName || !mimeType || isDecrypting}
                                    className="w-full h-12 text-lg"
                                >
                                    {isDecrypting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                            Decrypting...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Key className="w-5 h-5" />
                                            Decrypt File
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
                    )}

                    {/* Decrypted File */}
                    {decryptedFile && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Decrypted File Ready
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-green-600" />
                                            <span className="font-medium">{decryptedFile.name}</span>
                                            <Badge variant="outline">{decryptedFile.type}</Badge>
                                            <Badge variant="secondary">{(decryptedFile.size / 1024).toFixed(2)} KB</Badge>
                                        </div>
                                    </div>
                                    <Button onClick={handleDownload} className="w-full gap-2">
                                        <Download className="w-5 h-5" />
                                        Download Decrypted File
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
