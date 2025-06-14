
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, AlertTriangle } from "lucide-react";
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
      {/* Additional Phone Numbers */}
      {brand.additional_phone_numbers && brand.additional_phone_numbers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Additional Phone Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {brand.additional_phone_numbers.map((phone, index) => (
                <a 
                  key={index}
                  href={`tel:${phone}`}
                  className="block text-lg font-medium text-gray-900 hover:text-gray-700"
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
            <CardTitle className="text-lg font-medium text-gray-900">Additional Email Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {brand.additional_emails.map((email, index) => (
                <a 
                  key={index}
                  href={`mailto:${email}`}
                  className="block text-lg font-medium text-gray-900 hover:text-gray-700"
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
            <CardTitle className="text-lg font-medium flex items-center text-orange-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Escalation Contact
            </CardTitle>
            {brand.escalation_contact_name && (
              <p className="text-gray-700">Contact: {brand.escalation_contact_name}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {brand.escalation_phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <a 
                  href={`tel:${brand.escalation_phone}`}
                  className="text-lg font-medium text-gray-900 hover:text-gray-700"
                >
                  {brand.escalation_phone}
                </a>
              </div>
            )}
            {brand.escalation_email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <a 
                  href={`mailto:${brand.escalation_email}`}
                  className="text-lg font-medium text-gray-900 hover:text-gray-700"
                >
                  {brand.escalation_email}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Head Office Address */}
      {brand.head_office_address && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center text-gray-900">
              <MapPin className="w-5 h-5 mr-2 text-gray-600" />
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

      {/* Additional Resources - Only show chatbot and grievance portal */}
      {(brand.grievance_portal_url || brand.chatbot_url) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Additional Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
      )}
    </div>
  );
}
