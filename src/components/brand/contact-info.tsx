
import { Brand } from "@/types";
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle } from "lucide-react";

interface ContactInfoProps {
  brand: Brand;
}

export function ContactInfo({ brand }: ContactInfoProps) {
  const formatSupportHours = (hours: any) => {
    if (!hours || typeof hours !== 'object') return null;
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map((day, index) => {
      const dayHours = hours[day];
      if (!dayHours) return null;
      
      if (dayHours === 'closed') {
        return (
          <div key={day} className="flex justify-between">
            <span className="font-medium">{dayNames[index]}</span>
            <span className="text-gray-500">Closed</span>
          </div>
        );
      }
      
      return (
        <div key={day} className="flex justify-between">
          <span className="font-medium">{dayNames[index]}</span>
          <span>{dayHours.open} - {dayHours.close}</span>
        </div>
      );
    }).filter(Boolean);
  };

  const formatAddress = (address: any) => {
    if (!address || typeof address !== 'object') return null;
    
    return [
      address.street,
      address.city,
      address.state,
      address.zip,
      address.country
    ].filter(Boolean).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Primary Contact Information */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Contact Information
        </h3>
        
        <div className="space-y-3">
          {brand.toll_free_number && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-3 text-gray-500" />
              <a href={`tel:${brand.toll_free_number}`} className="text-blue-600 hover:underline">
                {brand.toll_free_number}
              </a>
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Primary</span>
            </div>
          )}
          
          {brand.additional_phone_numbers?.map((phone, index) => (
            <div key={index} className="flex items-center">
              <Phone className="h-4 w-4 mr-3 text-gray-500" />
              <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
                {phone}
              </a>
            </div>
          ))}
          
          {brand.support_email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-3 text-gray-500" />
              <a href={`mailto:${brand.support_email}`} className="text-blue-600 hover:underline">
                {brand.support_email}
              </a>
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Primary</span>
            </div>
          )}
          
          {brand.additional_emails?.map((email, index) => (
            <div key={index} className="flex items-center">
              <Mail className="h-4 w-4 mr-3 text-gray-500" />
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                {email}
              </a>
            </div>
          ))}
          
          {brand.website_url && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-3 text-gray-500" />
              <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Visit Website
              </a>
            </div>
          )}
          
          {brand.chatbot_url && (
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-3 text-gray-500" />
              <a href={brand.chatbot_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Live Chat Support
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Support Hours */}
      {brand.support_hours && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Support Hours
          </h3>
          <div className="space-y-2 text-sm">
            {formatSupportHours(brand.support_hours)}
          </div>
        </div>
      )}

      {/* Head Office Address */}
      {brand.head_office_address && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Head Office
          </h3>
          <p className="text-gray-600">
            {formatAddress(brand.head_office_address)}
          </p>
        </div>
      )}
    </div>
  );
}
