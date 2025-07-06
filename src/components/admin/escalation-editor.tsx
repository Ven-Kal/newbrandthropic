
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface EscalationLevel {
  id: string;
  title: string;
  link?: string;
  phone?: string;
  email?: string;
  note?: string;
}

interface EscalationEditorProps {
  escalationLevels: EscalationLevel[];
  onEscalationLevelsChange: (levels: EscalationLevel[]) => void;
}

export function EscalationEditor({ escalationLevels, onEscalationLevelsChange }: EscalationEditorProps) {
  const addEscalationLevel = () => {
    const newLevel: EscalationLevel = {
      id: Date.now().toString(),
      title: `Escalation ${escalationLevels.length + 1}`,
      link: "",
      phone: "",
      email: "",
      note: ""
    };
    onEscalationLevelsChange([...escalationLevels, newLevel]);
  };

  const removeEscalationLevel = (id: string) => {
    const updatedLevels = escalationLevels.filter(level => level.id !== id);
    onEscalationLevelsChange(updatedLevels);
  };

  const updateEscalationLevel = (id: string, field: keyof EscalationLevel, value: string) => {
    const updatedLevels = escalationLevels.map(level =>
      level.id === id ? { ...level, [field]: value } : level
    );
    onEscalationLevelsChange(updatedLevels);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-medium">Escalation Levels</Label>
        <Button
          type="button"
          onClick={addEscalationLevel}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Escalation Level
        </Button>
      </div>

      {escalationLevels.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No escalation levels added yet.</p>
          <p className="text-sm">Click "Add Escalation Level" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {escalationLevels.map((level, index) => (
            <Card key={level.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <CardTitle className="text-base">
                      Step {index + 1}
                    </CardTitle>
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeEscalationLevel(level.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`title-${level.id}`}>Step Title</Label>
                  <Input
                    id={`title-${level.id}`}
                    value={level.title}
                    onChange={(e) => updateEscalationLevel(level.id, 'title', e.target.value)}
                    placeholder="e.g., Escalation 1, Customer Care Manager, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`phone-${level.id}`}>Phone Number</Label>
                    <Input
                      id={`phone-${level.id}`}
                      value={level.phone || ''}
                      onChange={(e) => updateEscalationLevel(level.id, 'phone', e.target.value)}
                      placeholder="+1-800-123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`email-${level.id}`}>Email Address</Label>
                    <Input
                      id={`email-${level.id}`}
                      value={level.email || ''}
                      onChange={(e) => updateEscalationLevel(level.id, 'email', e.target.value)}
                      placeholder="support@company.com"
                      type="email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`link-${level.id}`}>Link/URL</Label>
                  <Input
                    id={`link-${level.id}`}
                    value={level.link || ''}
                    onChange={(e) => updateEscalationLevel(level.id, 'link', e.target.value)}
                    placeholder="https://company.com/escalation-form"
                    type="url"
                  />
                </div>

                <div>
                  <Label htmlFor={`note-${level.id}`}>Note/Description</Label>
                  <Textarea
                    id={`note-${level.id}`}
                    value={level.note || ''}
                    onChange={(e) => updateEscalationLevel(level.id, 'note', e.target.value)}
                    placeholder="Additional information about this escalation step..."
                    className="h-20"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
