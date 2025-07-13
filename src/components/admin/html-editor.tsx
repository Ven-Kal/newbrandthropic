
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Link, List, ListOrdered, Heading1, Heading2, Heading3 } from "lucide-react";

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function HtmlEditor({ value, onChange, placeholder, className }: HtmlEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertHtml = (tag: string, closingTag?: string) => {
    const textarea = document.querySelector('textarea[data-html-editor]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    let newText;
    if (closingTag) {
      newText = beforeText + tag + selectedText + closingTag + afterText;
    } else {
      newText = beforeText + tag + afterText;
    }

    onChange(newText);
    
    // Set cursor position after the opening tag
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length + selectedText.length);
    }, 0);
  };

  const formatButtons = [
    { icon: Heading1, label: "H1", action: () => insertHtml('<h1>', '</h1>') },
    { icon: Heading2, label: "H2", action: () => insertHtml('<h2>', '</h2>') },
    { icon: Heading3, label: "H3", action: () => insertHtml('<h3>', '</h3>') },
    { icon: Bold, label: "Bold", action: () => insertHtml('<strong>', '</strong>') },
    { icon: Italic, label: "Italic", action: () => insertHtml('<em>', '</em>') },
    { icon: Link, label: "Link", action: () => insertHtml('<a href="">', '</a>') },
    { icon: List, label: "List", action: () => insertHtml('<ul>\n<li>', '</li>\n</ul>') },
    { icon: ListOrdered, label: "Numbered List", action: () => insertHtml('<ol>\n<li>', '</li>\n</ol>') },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="outline"
            size="sm"
            onClick={button.action}
            className="flex items-center gap-1"
          >
            <button.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{button.label}</span>
          </Button>
        ))}
        <div className="ml-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Editor/Preview */}
      {isPreview ? (
        <div 
          className="min-h-[200px] p-4 border rounded-md bg-white prose max-w-none"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <Textarea
          data-html-editor
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`min-h-[200px] font-mono text-sm ${className}`}
        />
      )}

      {/* HTML Help */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <strong>HTML Tags Supported:</strong> &lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;br&gt;
      </div>
    </div>
  );
}
