
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Globe, MapPin, AlertTriangle } from "lucide-react";
import { Brand } from "@/types";

interface ContactInfoProps {
  brand: Brand;
}

export function ContactInfo({ brand }: ContactInfoProps) {
  const formatAddress = (address: any) => {
    if (!address || typeof address !== 'object') return null;
    
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zip,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Primary Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-green-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Phone */}
          {brand.toll_free_number && (
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600">Toll Free Number</p>
                <a 
                  href={`tel:${brand.toll_free_number}`}
                  className="text-lg font-semibold text-gray-900 hover:text-gray-700"
                >
                  {brand.toll_free_number}
                </a>
              </div>
            </div>
          )}

          {/* Primary Email */}
          {brand.support_email && (
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600">Support Email</p>
                <a 
                  href={`mailto:${brand.support_email}`}
                  className="text-lg font-semibold text-gray-900 hover:text-gray-700"
                >
                  {brand.support_email}
                </a>
              </div>
            </div>
          )}

          {/* Website */}
          {brand.website_url && (
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600">Website</p>
                <a 
                  href={brand.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-gray-900 hover:text-gray-700"
                >
                  Visit Website
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Contact Numbers */}
      {brand.additional_phone_numbers && brand.additional_phone_numbers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-gray-900">Additional Phone Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {brand.additional_phone_numbers.map((phone, index) => (
                <a 
                  key={index}
                  href={`tel:${phone}`}
                  className="block text-lg font-semibold text-gray-900 hover:text-gray-700"
                >
                  {phone}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Email Addresses */}
      {brand.additional_emails && brand.additional_emails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-gray-900">Additional Email Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {brand.additional_emails.map((email, index) => (
                <a 
                  key={index}
                  href={`mailto:${email}`}
                  className="block text-lg font-semibold text-gray-900 hover:text-gray-700"
                >
                  {email}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Escalation Contact */}
      {(brand.escalation_phone || brand.escalation_email) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center text-orange-800">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Escalation Contact
            </CardTitle>
            {brand.escalation_contact_name && (
              <p className="text-sm text-orange-700">Contact: {brand.escalation_contact_name}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {brand.escalation_phone && (
              <a 
                href={`tel:${brand.escalation_phone}`}
                className="block text-lg font-semibold text-gray-900 hover:text-gray-700"
              >
                {brand.escalation_phone}
              </a>
            )}
            {brand.escalation_email && (
              <a 
                href={`mailto:${brand.escalation_email}`}
                className="block text-lg font-semibold text-gray-900 hover:text-gray-700"
              >
                {brand.escalation_email}
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Head Office Address */}
      {brand.head_office_address && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center text-gray-900">
              <MapPin className="w-4 h-4 mr-2 text-gray-600" />
              Head Office Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {formatAddress(brand.head_office_address)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Special Tags */}
      {brand.special_tags && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-gray-900">Special Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {brand.special_tags.split(',').map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-900">Additional Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brand.complaint_page_url && (
            <a 
              href={brand.complaint_page_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-700 font-medium"
            >
              → Complaint Page
            </a>
          )}
          {brand.grievance_portal_url && (
            <a 
              href={brand.grievance_portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-700 font-medium"
            >
              → Grievance Portal
            </a>
          )}
          {brand.chatbot_url && (
            <a 
              href={brand.chatbot_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-700 font-medium"
            >
              → Live Chat Support
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
