
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Lightbulb, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Brandthropic</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building a fair and transparent consumer-brand ecosystem through authentic reviews and insights.
          </p>
        </div>

        {/* Story Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Brandthropic started with a personal struggle—our founder faced multiple customer service issues across several brands. Some were escalated, a few were resolved, and most were forgotten.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              That's when she saw the need for a central platform where such issues could be tracked, addressed, and turned into real brand insights.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Encouraged by early appreciation, we built the foundation of Brandthropic.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In Phase 1, we are launching a recommendation system showcasing the top 3 brands in each category, with the reason why they're ranked that way.
            </p>
            <p className="text-gray-700 leading-relaxed font-medium">
              This is just the beginning of building a fair and transparent consumer-brand ecosystem.
            </p>
          </CardContent>
        </Card>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To create a transparent platform where consumers can make informed decisions about brands based on authentic experiences and comprehensive insights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To become the most trusted platform for brand reviews and consumer insights, helping brands improve their services while empowering consumers with knowledge.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Do */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <TrendingUp className="h-6 w-6" />
              What We Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Collect Reviews</h3>
                <p className="text-gray-600 text-sm">
                  Gather authentic customer experiences and feedback across various brands and categories.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Analyze Data</h3>
                <p className="text-gray-600 text-sm">
                  Transform customer feedback into actionable insights and comprehensive brand ratings.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Recommend Brands</h3>
                <p className="text-gray-600 text-sm">
                  Provide transparent recommendations based on real customer experiences and performance metrics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Get In Touch</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-6">
              Have feedback or suggestions? We'd love to hear from you as we continue building this platform together.
            </p>
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Email:</strong> info@brandthropic.com
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> 9769969668
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> 102, Fiona Commercial Park, Near Viviana Mall, Mumbai – 400606
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
