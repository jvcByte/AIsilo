// src/components/Dashboard.tsx
import { useState } from 'react';
// import { useAccount } from 'wagmi';
import { useDocuments } from '../hooks/use-documents';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function UploadFile() {
  // const { address } = useAccount();
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
    if (!file) return;

    await uploadDocument(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-foreground md:leading-20 md:tracking-wide">Upload File</h1>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mb-8 p-6 bg-card rounded-lg border border-border shadow-sm bg-gradient-to-br from-muted to-background">
        <h2 className="text-xl font-semibold mb-4 text-card-foreground">Upload New Document</h2>

        <div className="mb-4 space-y-2">
          <Label htmlFor="file" className="text-foreground">Select File</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="w-full md:h-12"
          />
        </div>

        <Button
          type="submit"
          disabled={!file || isLoading}
          className="w-full md:h-12"
        >
          {isLoading ? 'Uploading...' : 'Encrypt & Upload'}
        </Button>

        {error && <p className="text-destructive mt-3 text-sm">{error}</p>}
      </form>
    </div>
  );
}