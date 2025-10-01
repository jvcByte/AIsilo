// src/components/UploadFile.tsx
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useDocuments } from '../hooks/use-documents';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { EmergencyAccess } from './EmergencyAccess';
import { 
  Upload, 
  Shield, 
  AlertTriangle, 
  Users,
  FileText,
  Lock
} from 'lucide-react';

export function UploadFile() {
  const { address, isConnected } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [accessLevel, setAccessLevel] = useState<'private' | 'shared' | 'emergency'>('private');
  const [emergencyCode, setEmergencyCode] = useState('');
  const [expirationHours, setExpirationHours] = useState(24);
  const [allowedUsers, setAllowedUsers] = useState('');
  const [showEmergencyAccess, setShowEmergencyAccess] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);

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
      const result = await uploadDocument({
        file,
        accessLevel,
        emergencyCode: accessLevel === 'emergency' ? emergencyCode : undefined,
        expirationTime: accessLevel === 'emergency' ? Date.now() + (expirationHours * 60 * 60 * 1000) : undefined,
        allowedUsers: allowedUsers ? allowedUsers.split(',').map(addr => addr.trim()) : undefined
      });

      if (result.emergencyAccess) {
        setDocumentId(result.documentId);
        setShowEmergencyAccess(true);
      }
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

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="accessLevel">Access Level</Label>
              <Select value={accessLevel} onValueChange={(value: any) => setAccessLevel(value)}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Private - Only you can access
                    </div>
                  </SelectItem>
                  <SelectItem value="shared">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Shared - Grant access to specific users
                    </div>
                  </SelectItem>
                  <SelectItem value="emergency">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Emergency - Medical/emergency access
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {accessLevel === 'shared' && (
              <div>
                <Label htmlFor="allowedUsers">Allowed Users (comma-separated addresses)</Label>
                <Input
                  id="allowedUsers"
                  value={allowedUsers}
                  onChange={(e) => setAllowedUsers(e.target.value)}
                  placeholder="0x1234..., 0x5678..."
                  className="mt-2"
                />
              </div>
            )}

            {accessLevel === 'emergency' && (
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Emergency access creates a time-limited QR code for medical emergencies.
                    This should only be used for critical medical documents.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyCode">Emergency Code</Label>
                    <Input
                      id="emergencyCode"
                      value={emergencyCode}
                      onChange={(e) => setEmergencyCode(e.target.value)}
                      placeholder="EMG-ABC123"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expirationHours">Expiration (hours)</Label>
                    <Input
                      id="expirationHours"
                      type="number"
                      value={expirationHours}
                      onChange={(e) => setExpirationHours(Number(e.target.value))}
                      min="1"
                      max="168"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}
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
                  Encrypt & Upload to BlockDAG
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

      {/* Emergency Access Modal */}
      {showEmergencyAccess && documentId && (
        <EmergencyAccess
          documentId={documentId}
          onClose={() => {
            setShowEmergencyAccess(false);
            setDocumentId(null);
          }}
        />
      )}
    </div>
  );
}