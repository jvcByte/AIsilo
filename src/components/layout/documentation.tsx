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
      content: "A comprehensive overview of the FileIt platform and its core features."
    },
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Zap,
      content: "Step-by-step guide to set up and start using FileIt for secure file storage."
    },
    {
      id: "features",
      title: "Features",
      icon: CheckCircle,
      content: "Detailed breakdown of all FileIt features and capabilities."
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      content: "In-depth explanation of FileIt's security model and encryption standards."
    },
    {
      id: "api",
      title: "API Reference",
      icon: Database,
      content: "Complete API documentation for developers integrating with FileIt."
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
              Complete guide to using FileIt - the decentralized, encrypted file storage platform
              built on blockchain technology and IPFS.
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
                    <CardTitle className="text-lg">Military-Grade Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    256-bit AES encryption combined with blockchain verification ensures
                    your files are protected against any threats.
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
                    Files are stored on IPFS with metadata recorded on blockchain,
                    ensuring no single point of failure.
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

        {/* Getting Started CTA */}
        <section className="py-16 px-6 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Join thousands of users who trust FileIt with their most important files.
              Start uploading securely today.
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              <Zap className="w-5 h-5" />
              Upload Your First File
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
