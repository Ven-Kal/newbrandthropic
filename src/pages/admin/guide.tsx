
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Building, 
  Users, 
  Settings, 
  Download,
  ExternalLink
} from "lucide-react";
import { AdminGuide } from "@/components/admin/admin-guide";
import { BrandBenefitsGuide } from "@/components/admin/brand-benefits-guide";
import { ConsumerBenefitsGuide } from "@/components/admin/consumer-benefits-guide";

export default function AdminGuidePage() {
  const [activeTab, setActiveTab] = useState("admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Complete Platform Guide</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive documentation for all platform features, benefits, and usage guidelines.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Admin Features</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Brand Tools</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Consumer Features</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Documentation</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Guide Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Platform Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Admin Console
              </TabsTrigger>
              <TabsTrigger value="brands" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                For Brands
              </TabsTrigger>
              <TabsTrigger value="consumers" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                For Consumers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin" className="mt-6">
              <AdminGuide />
            </TabsContent>
            
            <TabsContent value="brands" className="mt-6">
              <BrandBenefitsGuide />
            </TabsContent>
            
            <TabsContent value="consumers" className="mt-6">
              <ConsumerBenefitsGuide />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Guide
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Share Link
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Admin Settings
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Print Guide
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Information */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                Version 1.0 - Complete Platform Guide
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Documentation</Badge>
              <Badge variant="secondary">Admin Guide</Badge>
              <Badge variant="secondary">User Manual</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
