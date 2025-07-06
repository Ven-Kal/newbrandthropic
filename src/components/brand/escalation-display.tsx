
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, ExternalLink, AlertTriangle } from "lucide-react";

interface EscalationLevel {
  id: string;
  title: string;
  link?: string;
  phone?: string;
  email?: string;
  note?: string;
}

interface EscalationDisplayProps {
  escalationLevels: EscalationLevel[];
}

export function EscalationDisplay({ escalationLevels }: EscalationDisplayProps) {
  // Filter out empty escalation levels (levels with no meaningful content)
  const validLevels = escalationLevels.filter(level => 
    level.title || level.phone || level.email || level.link || level.note
  );

  if (validLevels.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center text-orange-800">
        <AlertTriangle className="w-5 h-5 mr-2" />
        Escalation Steps
      </h3>
      
      <div className="space-y-4">
        {validLevels.map((level, index) => (
          <Card key={level.id} className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-orange-800">
                {level.title || `Escalation ${index + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {level.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <a 
                    href={`tel:${level.phone}`}
                    className="text-gray-900 hover:text-gray-700 font-medium"
                  >
                    {level.phone}
                  </a>
                </div>
              )}
              
              {level.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <a 
                    href={`mailto:${level.email}`}
                    className="text-gray-900 hover:text-gray-700 font-medium"
                  >
                    {level.email}
                  </a>
                </div>
              )}
              
              {level.link && (
                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <a 
                    href={level.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Visit Escalation Page
                  </a>
                </div>
              )}
              
              {level.note && (
                <div className="mt-2 p-3 bg-white rounded border border-orange-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {level.note}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
