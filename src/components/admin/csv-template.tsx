
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function CSVTemplate() {
  const downloadTemplate = () => {
    const headers = [
      'brand_name',
      'category', 
      'logo_url',
      'website_url',
      'support_email',
      'toll_free_number',
      'complaint_page_url',
      'chatbot_url',
      'grievance_portal_url',
      'instagram_url',
      'linkedin_url',
      'facebook_url',
      'twitter_url',
      'legal_entity_name',
      'holding_company_name',
      'top_products',
      'company_notes',
      'special_tags'
    ];
    
    const sampleData = [
      [
        'TeleStar Communications',
        'telecommunications',
        'https://example.com/logo1.png',
        'https://telestar.com',
        'support@telestar.com',
        '1-800-TELESTAR',
        'https://telestar.com/complaints',
        'https://telestar.com/chat',
        'https://telestar.com/grievance',
        'https://instagram.com/telestar',
        'https://linkedin.com/company/telestar',
        'https://facebook.com/telestar',
        'https://twitter.com/telestar',
        'TeleStar Communications Pvt Ltd',
        'TeleCorp Holdings',
        'Mobile Plans, Internet Services, Business Solutions',
        'Leading telecommunications provider with 24/7 customer support and nationwide coverage.',
        'featured,reliable'
      ],
      [
        'FastNet Services',
        'internet',
        'https://example.com/logo2.png',
        'https://fastnet.com',
        'help@fastnet.com',
        '1-800-FASTNET',
        'https://fastnet.com/complaints',
        'https://fastnet.com/support-chat',
        'https://fastnet.com/grievance-portal',
        'https://instagram.com/fastnet',
        'https://linkedin.com/company/fastnet',
        'https://facebook.com/fastnet',
        'https://twitter.com/fastnet_support',
        'FastNet Internet Services Ltd',
        'Digital Connect Group',
        'High-Speed Internet, WiFi Solutions, Enterprise Connectivity',
        'Premium internet service provider offering ultra-fast broadband connections across major cities.',
        'shark tank,fast'
      ]
    ];
    
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'brands_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Standard CSV Template for Brand Upload</h3>
        <p className="text-sm text-blue-700 mb-3">
          Download this standardized template to upload brands in bulk. Fill in the data and upload the CSV file.
        </p>
        <Button onClick={downloadTemplate} size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Download Standard Template
        </Button>
      </div>
      
      <div className="text-xs text-gray-600 space-y-2">
        <div className="bg-white p-3 rounded border">
          <p className="font-semibold mb-2">Upload Guidelines:</p>
          <ul className="space-y-1">
            <li><strong>Required fields:</strong> brand_name, category</li>
            <li><strong>File format:</strong> CSV only (.csv extension)</li>
            <li><strong>Encoding:</strong> UTF-8</li>
            <li><strong>First row:</strong> Must contain column headers</li>
            <li><strong>Brand names:</strong> Must be unique</li>
            <li><strong>URLs:</strong> Must include http:// or https://</li>
            <li><strong>Categories:</strong> telecommunications, internet, utilities, retail, banking, insurance, healthcare, food, automotive, technology</li>
            <li><strong>Special tags:</strong> Comma-separated (e.g., "featured,shark tank,reliable")</li>
            <li><strong>Top products:</strong> Comma-separated list (max 10 items)</li>
            <li><strong>Company notes:</strong> Maximum 300 characters</li>
          </ul>
        </div>
        
        <div className="bg-white p-3 rounded border border-gray-200">
          <p className="font-semibold text-gray-800 mb-1">Naming Conventions:</p>
          <ul className="text-gray-700 space-y-1">
            <li>• Use proper capitalization for brand names</li>
            <li>• Include "Ltd", "Pvt Ltd", "Corp" etc. for legal entity names</li>
            <li>• Use descriptive product names</li>
            <li>• Keep URLs clean and functional</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
