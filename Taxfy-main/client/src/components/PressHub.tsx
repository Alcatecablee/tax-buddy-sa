import React, { useState } from 'react';
import { Calendar, Download, ExternalLink, Mail, Phone, User, Building2, Trophy, TrendingUp, FileText, Image, Video, Mic } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PressRelease {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: 'product' | 'funding' | 'partnership' | 'award' | 'milestone';
  readTime: string;
  downloadUrl?: string;
}

interface ExecutiveProfile {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

interface MediaAsset {
  id: string;
  type: 'logo' | 'screenshot' | 'photo' | 'video';
  title: string;
  description: string;
  downloadUrl: string;
  previewUrl: string;
  format: string;
  size: string;
}

const PressHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const pressReleases: PressRelease[] = [
    {
      id: '1',
      title: 'Taxfy Launches AI-Powered Tax Processing Platform for South African Market',
      date: '2024-01-15',
      excerpt: 'Revolutionary AI technology simplifies tax compliance for individuals and businesses across South Africa, processing IRP5 documents with 99.5% accuracy.',
      category: 'product',
      readTime: '3 min read'
    },
    {
      id: '2',
      title: 'Taxfy Secures R15 Million Series A Funding to Expand Tax Technology Platform',
      date: '2024-01-10',
      excerpt: 'Leading South African VC firm invests in Taxfy to accelerate growth and enhance AI capabilities for tax processing automation.',
      category: 'funding',
      readTime: '4 min read'
    },
    {
      id: '3',
      title: 'Partnership with Major South African Accounting Firms Drives 300% Growth',
      date: '2024-01-05',
      excerpt: 'Strategic partnerships with top-tier accounting practices position Taxfy as the leading tax technology solution for professionals.',
      category: 'partnership',
      readTime: '2 min read'
    },
    {
      id: '4',
      title: 'Taxfy Wins Best FinTech Innovation Award at SA Tech Awards 2024',
      date: '2023-12-20',
      excerpt: 'Recognition for outstanding contribution to financial technology and tax compliance automation in South Africa.',
      category: 'award',
      readTime: '2 min read'
    },
    {
      id: '5',
      title: 'Taxfy Processes Over 100,000 Tax Documents, Saves South Africans R50 Million',
      date: '2023-12-15',
      excerpt: 'Platform milestone demonstrates significant impact on tax compliance efficiency and cost savings for users nationwide.',
      category: 'milestone',
      readTime: '3 min read'
    }
  ];

  const executiveTeam: ExecutiveProfile[] = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      position: 'Chief Executive Officer & Co-Founder',
      bio: 'Former PwC Tax Director with 15+ years experience in South African tax compliance. Led digital transformation initiatives for major corporates.',
      image: '/api/placeholder/200/200',
      linkedin: 'https://linkedin.com/in/sarahmitchell',
      email: 'sarah@taxfy.co.za'
    },
    {
      id: '2',
      name: 'David Chen',
      position: 'Chief Technology Officer & Co-Founder',
      bio: 'AI/ML expert and former Google engineer. Specialized in document processing and natural language understanding for financial services.',
      image: '/api/placeholder/200/200',
      linkedin: 'https://linkedin.com/in/davidchen',
      email: 'david@taxfy.co.za'
    },
    {
      id: '3',
      name: 'Nomsa Dlamini',
      position: 'Chief Financial Officer',
      bio: 'Former Standard Bank executive with expertise in fintech scaling and regulatory compliance. CA(SA) with deep SA market knowledge.',
      image: '/api/placeholder/200/200',
      linkedin: 'https://linkedin.com/in/nomsadlamini',
      email: 'nomsa@taxfy.co.za'
    },
    {
      id: '4',
      name: 'Michael Roberts',
      position: 'Head of Partnerships',
      bio: 'Former KPMG partner with extensive networks in SA accounting and tax advisory industry. Drives strategic partnerships and channel development.',
      image: '/api/placeholder/200/200',
      linkedin: 'https://linkedin.com/in/michaelroberts',
      email: 'michael@taxfy.co.za'
    }
  ];

  const mediaAssets: MediaAsset[] = [
    {
      id: '1',
      type: 'logo',
      title: 'Taxfy Logo - Full Color',
      description: 'Primary brand logo with full color scheme',
      downloadUrl: '/assets/logos/taxfy-logo-full-color.svg',
      previewUrl: '/api/placeholder/300/150',
      format: 'SVG, PNG',
      size: 'Vector, Various'
    },
    {
      id: '2',
      type: 'logo',
      title: 'Taxfy Logo - White',
      description: 'White version for dark backgrounds',
      downloadUrl: '/assets/logos/taxfy-logo-white.svg',
      previewUrl: '/api/placeholder/300/150',
      format: 'SVG, PNG',
      size: 'Vector, Various'
    },
    {
      id: '3',
      type: 'screenshot',
      title: 'Platform Dashboard',
      description: 'Main user dashboard interface',
      downloadUrl: '/assets/screenshots/dashboard.png',
      previewUrl: '/api/placeholder/400/300',
      format: 'PNG',
      size: '1920x1080'
    },
    {
      id: '4',
      type: 'screenshot',
      title: 'Document Processing',
      description: 'AI-powered document processing interface',
      downloadUrl: '/assets/screenshots/processing.png',
      previewUrl: '/api/placeholder/400/300',
      format: 'PNG',
      size: '1920x1080'
    },
    {
      id: '5',
      type: 'photo',
      title: 'Executive Team Photo',
      description: 'Professional team photo for media use',
      downloadUrl: '/assets/photos/team-photo.jpg',
      previewUrl: '/api/placeholder/400/300',
      format: 'JPG',
      size: '3000x2000'
    },
    {
      id: '6',
      type: 'video',
      title: 'Product Demo Video',
      description: '2-minute platform overview and demo',
      downloadUrl: '/assets/videos/product-demo.mp4',
      previewUrl: '/api/placeholder/400/300',
      format: 'MP4',
      size: '1080p, 120MB'
    }
  ];

  const companyFacts = [
    { label: 'Founded', value: '2023' },
    { label: 'Headquarters', value: 'Cape Town, South Africa' },
    { label: 'Employees', value: '25+' },
    { label: 'Documents Processed', value: '100,000+' },
    { label: 'Active Users', value: '15,000+' },
    { label: 'Partner Firms', value: '150+' },
    { label: 'Processing Accuracy', value: '99.5%' },
    { label: 'Customer Satisfaction', value: '4.8/5' }
  ];

  const filteredReleases = selectedCategory === 'all' 
    ? pressReleases 
    : pressReleases.filter(release => release.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      product: 'bg-blue-100 text-blue-800',
      funding: 'bg-green-100 text-green-800',
      partnership: 'bg-purple-100 text-purple-800',
      award: 'bg-yellow-100 text-yellow-800',
      milestone: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'logo': return <Image className="h-5 w-5" />;
      case 'screenshot': return <FileText className="h-5 w-5" />;
      case 'photo': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Taxfy Press Hub</h1>
              <p className="text-xl text-muted-foreground mt-2">Media resources and company information</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Media Inquiries</p>
              <p className="font-semibold text-foreground">press@taxfy.co.za</p>
              <p className="text-sm text-muted-foreground">+27 21 123 4567</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="news">Press Releases</TabsTrigger>
            <TabsTrigger value="team">Leadership</TabsTrigger>
            <TabsTrigger value="media">Media Kit</TabsTrigger>
            <TabsTrigger value="facts">Company Facts</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    About Taxfy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Taxfy is South Africa's leading AI-powered tax processing platform, revolutionizing how individuals and businesses handle tax compliance. Our cutting-edge technology processes IRP5 documents with 99.5% accuracy, saving users time and money while ensuring perfect SARS compliance.
                  </p>
                  <p className="text-muted-foreground">
                    Founded in 2023 by tax professionals and AI experts, Taxfy has quickly become the trusted choice for over 15,000 users nationwide, including major accounting firms and enterprise clients.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>AI-Powered</Badge>
                    <Badge>SARS Compliant</Badge>
                    <Badge>99.5% Accuracy</Badge>
                    <Badge>Enterprise Ready</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span>Best FinTech Innovation Award 2024</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span>R15M Series A Funding Raised</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span>100,000+ Documents Processed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-purple-500" />
                      <span>15,000+ Active Users</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest News */}
            <Card>
              <CardHeader>
                <CardTitle>Latest News</CardTitle>
                <CardDescription>Recent press releases and company updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pressReleases.slice(0, 3).map((release) => (
                    <div key={release.id} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getCategoryColor(release.category)}>
                          {release.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(release.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{release.title}</h3>
                      <p className="text-muted-foreground text-sm">{release.excerpt}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Press Releases Tab */}
          <TabsContent value="news" className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              {['product', 'funding', 'partnership', 'award', 'milestone'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            <div className="grid gap-6">
              {filteredReleases.map((release) => (
                <Card key={release.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getCategoryColor(release.category)}>
                            {release.category}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(release.date).toLocaleDateString()}
                          </div>
                          <span className="text-sm text-muted-foreground">{release.readTime}</span>
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">{release.title}</h2>
                        <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                        <div className="flex gap-2">
                          <Button size="sm">
                            Read More
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                          {release.downloadUrl && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leadership Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Leadership Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Meet the experienced professionals leading Taxfy's mission to revolutionize tax compliance in South Africa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {executiveTeam.map((executive) => (
                <Card key={executive.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={executive.image}
                        alt={executive.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{executive.name}</h3>
                        <p className="text-primary font-medium mb-2">{executive.position}</p>
                        <p className="text-muted-foreground text-sm mb-3">{executive.bio}</p>
                        <div className="flex gap-2">
                          {executive.linkedin && (
                            <Button size="sm" variant="outline">
                              LinkedIn
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                          {executive.email && (
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Media Kit Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Media Kit</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Download high-resolution logos, product screenshots, executive photos, and other media assets for your stories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaAssets.map((asset) => (
                <Card key={asset.id}>
                  <CardContent className="pt-6">
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <img
                        src={asset.previewUrl}
                        alt={asset.title}
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {getAssetIcon(asset.type)}
                      <h3 className="font-semibold text-foreground">{asset.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{asset.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                      <span>{asset.format}</span>
                      <span>{asset.size}</span>
                    </div>
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Brand Guidelines</h3>
                <p className="text-muted-foreground mb-4">
                  Please follow our brand guidelines when using Taxfy assets in your publications. 
                  For custom requests or specific usage questions, contact our media team.
                </p>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download Brand Guidelines (PDF)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Facts Tab */}
          <TabsContent value="facts" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Company Facts</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Key statistics and facts about Taxfy for use in your reporting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companyFacts.map((fact, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{fact.value}</div>
                    <div className="text-muted-foreground">{fact.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Market Position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Industry Leadership</h4>
                    <p className="text-muted-foreground text-sm">
                      Taxfy is the fastest-growing tax technology platform in South Africa, 
                      with a 300% year-over-year growth rate and the highest customer satisfaction 
                      scores in the industry.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Technology Innovation</h4>
                    <p className="text-muted-foreground text-sm">
                      Our proprietary AI algorithms achieve 99.5% accuracy in document processing, 
                      significantly higher than traditional methods and competitor solutions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Funding History</h4>
                    <ul className="text-muted-foreground text-sm space-y-1">
                      <li>• Series A: R15 Million (January 2024)</li>
                      <li>• Seed Round: R3.5 Million (June 2023)</li>
                      <li>• Pre-seed: R1.2 Million (February 2023)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Revenue Growth</h4>
                    <p className="text-muted-foreground text-sm">
                      Projected to reach R36.6M ARR by end of 2024, with strong unit economics 
                      and industry-leading customer retention rates.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Media Contact</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get in touch with our media team for interviews, quotes, and additional information.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Press Inquiries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-muted-foreground">press@taxfy.co.za</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-muted-foreground">+27 21 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-muted-foreground">
                        Cape Town Office<br />
                        123 Business District<br />
                        Cape Town, 8001<br />
                        South Africa
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interview Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Our executives are available for interviews, podcasts, and speaking opportunities. 
                    We can provide expert commentary on:
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Tax compliance technology</li>
                    <li>• AI in financial services</li>
                    <li>• South African fintech landscape</li>
                    <li>• Digital transformation in accounting</li>
                    <li>• Regulatory compliance automation</li>
                  </ul>
                  <div className="pt-4">
                    <Button>
                      <Mic className="h-4 w-4 mr-2" />
                      Request Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="font-semibold">LinkedIn</p>
                    <p className="text-muted-foreground">@taxfy-sa</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Twitter</p>
                    <p className="text-muted-foreground">@taxfy_sa</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Website</p>
                    <p className="text-muted-foreground">www.taxfy.co.za</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PressHub; 