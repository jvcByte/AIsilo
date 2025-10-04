import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "./header";
import {
  Shield,
  Lock,
  Database,
  Cloud,
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Github,
  BookOpen,
  Key,
} from "lucide-react";

export default function DocumentationPage() {
  const sections = [
    {
      id: "overview",
      title: "Overview",
      icon: BookOpen,
      content: "FileIt combines AES-256-GCM encryption, Hedera blockchain, and IPFS to provide strong security for your files with zero-knowledge architecture."
    },
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Zap,
      content: "Connect your wallet, sign a message for encryption, and upload files. All encryption happens in your browser before upload."
    },
    {
      id: "architecture",
      title: "Architecture",
      icon: Database,
      content: "Decentralized system with client-side encryption, IPFS storage, and Hedera blockchain for immutable audit trails."
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      content: "AES-256-GCM encryption (uses NSA Suite B approved algorithm) with Keccak256 key derivation from wallet signatures. Files are encrypted before leaving your browser."
    },
    {
      id: "smart-contracts",
      title: "Smart Contracts",
      icon: Lock,
      content: "DocumentRegistry contract on Hedera Testnet manages document metadata, access control, and emits events for audit trails."
    },
    {
      id: "technology",
      title: "Technology Stack",
      icon: Key,
      content: "Built with React 19, TypeScript, Wagmi, Viem, TanStack Router/Query, Tailwind CSS, and Pinata for IPFS storage."
    }
  ];

  return (
    <div className="p-2">
      <HeroHeader />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-6 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Documentation</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              FileIt Documentation
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Complete guide to using FileIt - the decentralized file storage platform
              with enterprise-grade AES-256-GCM encryption, built on blockchain and IPFS.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Zap className="w-5 h-5" />
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Github className="w-5 h-5" />
                View Source
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="pt-0 pb-16 px-6">
          <div className="mx-auto max-w-6xl">
            {/* <h2 className="text-2xl font-bold mb-8 text-center">Documentation Sections</h2> */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <Card key={section.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{section.content}</p>
                    <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto font-medium">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose FileIt?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                FileIt combines the best of blockchain technology and modern encryption
                to provide unparalleled security for your digital assets.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg">Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AES-256-GCM encryption (NSA Suite B approved algorithm) combined with blockchain verification
                    provides strong protection for your sensitive files.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Decentralized Storage</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Files are stored on IPFS with metadata recorded on blockchain.
                    Cloudflare Workers secure presigned URLs, keeping JWT tokens server-side.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">User-Controlled Access</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You maintain complete control over who can access your files,
                    with no third-party involvement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CIA Security Model */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Security First Approach</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                FileIt implements the industry-standard CIA triad to ensure comprehensive protection
                of your digital assets.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle>Confidentiality</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Files are encrypted with 256-bit AES encryption before storage.
                    Only you control the decryption keys.
                  </p>
                  <Badge variant="secondary">Encrypted Access</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle>Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Blockchain verification ensures files cannot be tampered with or altered
                    without detection.
                  </p>
                  <Badge variant="secondary">Blockchain Verified</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    IPFS distributed storage ensures your files are always accessible
                    from anywhere in the world.
                  </p>
                  <Badge variant="secondary">IPFS Network</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Technical Implementation</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Deep dive into the technical architecture and implementation details of FileIt.
              </p>
            </div>

            <div className="space-y-8">
              {/* Encryption Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Encryption Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <div className="space-y-2">
                      <div>1. User signs message: "Encrypt My File"</div>
                      <div>2. Derive key: Keccak256(signature) → 32-byte AES key</div>
                      <div>3. Generate random 16-byte IV</div>
                      <div>4. Encrypt with AES-256-GCM</div>
                      <div>5. Request presigned URL from Cloudflare Worker</div>
                      <div>6. Upload encrypted file to IPFS via presigned URL</div>
                      <div>7. Store CID + IV on Hedera blockchain</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Badge className="mb-2">Algorithm</Badge>
                      <p className="text-sm text-muted-foreground">AES-256-GCM (Galois/Counter Mode)</p>
                    </div>
                    <div>
                      <Badge className="mb-2">Key Derivation</Badge>
                      <p className="text-sm text-muted-foreground">Keccak256 hash of wallet signature</p>
                    </div>
                    <div>
                      <Badge className="mb-2">Key Length</Badge>
                      <p className="text-sm text-muted-foreground">256-bit (32 bytes)</p>
                    </div>
                    <div>
                      <Badge className="mb-2">IV Generation</Badge>
                      <p className="text-sm text-muted-foreground">Cryptographically secure random</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Smart Contract Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Smart Contract Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold">Contract:</span>
                        <span className="font-mono">DocumentRegistry</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Network:</span>
                        <span>Hedera Testnet (Chain ID: 296)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Address:</span>
                        <span className="font-mono text-xs">0x41c88BE9a1A761657E7B4569b89C5A20700F9f8A</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Functions:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• uploadDocument(docID, cid) - Register new document</li>
                      <li>• getAllDocuments() - Retrieve all documents</li>
                      <li>• getDocumentsByOwner(address) - Get user's documents</li>
                      <li>• getDocumentByCid(cid) - Find document by CID</li>
                      <li>• grantRole/revokeRole - Access control management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Events Emitted:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• DocumentUploaded(user, docID, cid)</li>
                      <li>• RoleGranted(role, account, sender)</li>
                      <li>• RoleRevoked(role, account, sender)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Technology Stack */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Technology Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Frontend</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• React 19.1.1</li>
                        <li>• TypeScript 5.8.3</li>
                        <li>• Vite 7.1.2</li>
                        <li>• TanStack Router</li>
                        <li>• TanStack Query</li>
                        <li>• Tailwind CSS v4</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Web3</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Wagmi 2.16.9</li>
                        <li>• Viem 2.37.6</li>
                        <li>• ConnectKit 1.9.1</li>
                        <li>• Hedera Network</li>
                        <li>• ethereum-cryptography</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Storage</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• IPFS Protocol</li>
                        <li>• Pinata SDK 2.5.1</li>
                        <li>• Cloudflare Workers</li>
                        <li>• Web Crypto API</li>
                        <li>• Content Addressing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Flow */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Upload & Download Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">Upload Process</h4>
                      <ol className="space-y-2 text-sm text-muted-foreground">
                        <li>1. Select file in browser</li>
                        <li>2. Sign message with wallet</li>
                        <li>3. Derive encryption key</li>
                        <li>4. Encrypt file (AES-256-GCM)</li>
                        <li>5. Request presigned URL (Cloudflare)</li>
                        <li>6. Upload to IPFS via presigned URL</li>
                        <li>7. Record CID on blockchain</li>
                        <li>8. Event logged on-chain</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Download Process</h4>
                      <ol className="space-y-2 text-sm text-muted-foreground">
                        <li>1. Enter IPFS CID</li>
                        <li>2. Sign same message</li>
                        <li>3. Derive same key</li>
                        <li>4. Fetch from IPFS</li>
                        <li>5. Decrypt with key + IV</li>
                        <li>6. Verify integrity</li>
                        <li>7. Download to device</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Compliance Standards */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Security Standards Alignment</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                FileIt is designed following industry security best practices and standards.
                Not formally certified or audited.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>NIST Algorithm Standards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Badge variant="secondary" className="mb-2">NIST SP 800-175B</Badge>
                    <p className="text-sm text-muted-foreground">
                      Uses AES-256-GCM approved algorithm (not FIPS validated)
                    </p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">NIST SP 800-53</Badge>
                    <p className="text-sm text-muted-foreground">
                      Design aligns with: Access Enforcement, Cryptographic Protection, Audit Events
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ISO 27001 Design Alignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p className="text-xs italic mb-2">Architecture aligns with these controls (not certified):</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>A.9 - Access Control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>A.10 - Cryptography</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>A.12 - Operations Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>A.14 - System Acquisition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>A.18 - Compliance</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Getting Started CTA */}
        <section className="py-16 px-6 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Experience enterprise-grade AES-256-GCM encryption with zero-knowledge architecture.
              Your files, your keys, your control.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <Zap className="w-5 h-5" />
                Upload Your First File
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                <Github className="w-5 h-5" />
                View on GitHub
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
