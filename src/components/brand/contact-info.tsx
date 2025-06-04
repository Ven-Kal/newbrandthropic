
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { 
  Phone, 
  Mail, 
  Globe, 
  MessageCircle, 
  AlertTriangle, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Twitter,
  MapPin,
  Clock
} from "lucide-react";
import { Brand } from "@/types";

interface ContactInfoProps {
  brand: Brand;
}

export function ContactInfo({ brand }: ContactInfoProps) {
  const socialLinks = [
    { url: brand.instagram_url, icon: Instagram, label: "Instagram", color: "text-pink-600" },
    { url: brand.linkedin_url, icon: Linkedin, label: "LinkedIn", color: "text-blue-600" },
    { url: brand.facebook_url, icon: Facebook, label: "Facebook", color: "text-blue-700" },
    { url: brand.twitter_url, icon: Twitter, label: "Twitter", color: "text-blue-400" },
  ].filter(link => link.url);

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              <OptimizedImage
                src={brand.logo_url}
                alt={brand.logo_alt || `${brand.brand_name} logo`}
                className="w-full h-full object-contain"
                width={96}
                height={96}
                priority={true}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{brand.brand_name}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="capitalize">{brand.category}</Badge>
                {brand.subcategory && (
                  <Badge variant="secondary" className="capitalize">{brand.subcategory}</Badge>
                )}
                {brand.special_tags && brand.special_tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
              {brand.legal_entity_name && (
                <p className="text-sm text-gray-600">Legal Entity: {brand.legal_entity_name}</p>
              )}
              {brand.holding_company_name && (
                <p className="text-sm text-gray-600">Parent Company: {brand.holding_company_name}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Contact Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Primary Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {brand.toll_free_number && (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Toll-Free Number</p>
                  <p className="text-lg font-mono">{brand.toll_free_number}</p>
                </div>
              </div>
            </div>
          )}

          {brand.additional_phone_numbers && brand.additional_phone_numbers.length > 0 && (
            <div className="space-y-2">
              <p className="font-semibold text-gray-700">Additional Phone Numbers:</p>
              {brand.additional_phone_numbers.map((phone, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span className="font-mono">{phone}</span>
                </div>
              ))}
            </div>
          )}

          {brand.support_email && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Support Email</p>
                  <p className="text-blue-600">{brand.support_email}</p>
                </div>
              </div>
            </div>
          )}

          {brand.additional_emails && brand.additional_emails.length > 0 && (
            <div className="space-y-2">
              <p className="font-semibold text-gray-700">Additional Email Addresses:</p>
              {brand.additional_emails.map((email, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span className="text-blue-600">{email}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Hours */}
      {brand.support_hours && Object.keys(brand.support_hours).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Support Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(brand.support_hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium capitalize">{day}</span>
                  <span className="text-gray-600">
                    {typeof hours === 'string' ? hours : 
                     hours ? `${(hours as any).open} - ${(hours as any).close}` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Head Office Address */}
      {brand.head_office_address && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Head Office Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              {(brand.head_office_address as any).street && (
                <p>{(brand.head_office_address as any).street}</p>
              )}
              <p>
                {(brand.head_office_address as any).city && `${(brand.head_office_address as any).city}, `}
                {(brand.head_office_address as any).state && `${(brand.head_office_address as any).state} `}
                {(brand.head_office_address as any).zip}
              </p>
              {(brand.head_office_address as any).country && (
                <p>{(brand.head_office_address as any).country}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Digital Contact Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Support Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {brand.website_url && (
            <a
              href={brand.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Official Website</p>
                  <p className="text-purple-600">Visit website</p>
                </div>
              </div>
            </a>
          )}

          {brand.chatbot_url && (
            <a
              href={brand.chatbot_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-semibold text-gray-900">Live Chat</p>
                  <p className="text-indigo-600">Start chatting</p>
                </div>
              </div>
            </a>
          )}

          {brand.complaint_page_url && (
            <a
              href={brand.complaint_page_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-gray-900">File a Complaint</p>
                  <p className="text-red-600">Submit complaint</p>
                </div>
              </div>
            </a>
          )}

          {brand.grievance_portal_url && (
            <a
              href={brand.grievance_portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-gray-900">Grievance Portal</p>
                  <p className="text-orange-600">File grievance</p>
                </div>
              </div>
            </a>
          )}
        </CardContent>
      </Card>

      {/* Social Media */}
      {socialLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialLinks.map(({ url, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-sm font-medium">{label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      {(brand.top_products || brand.company_notes) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {brand.top_products && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Top Products/Services</h4>
                <p className="text-gray-600">{brand.top_products}</p>
              </div>
            )}
            {brand.company_notes && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Company Notes</h4>
                <p className="text-gray-600">{brand.company_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
