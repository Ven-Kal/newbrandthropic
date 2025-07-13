
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Share2 } from "lucide-react";
import { toast } from "sonner";

interface BadgeCelebrationProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon_unlocked_url: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeCelebration({ badge, isOpen, onClose }: BadgeCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-hide confetti after 3 seconds
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const shareOnWhatsApp = () => {
    const message = `🎉 I just earned the "${badge.name}" badge on BrandTropic! ${badge.description} Check it out at ${window.location.origin}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareOnInstagram = () => {
    // Copy text to clipboard for Instagram
    const message = `🎉 I just earned the "${badge.name}" badge on BrandTropic! ${badge.description} #BrandTropic #Achievement`;
    navigator.clipboard.writeText(message);
    toast.success("Achievement text copied! You can now paste it on Instagram");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <Card className="w-full max-w-md mx-4 animate-scale-in">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-brandblue-800">Badge Earned! 🎉</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 animate-bounce">
              <img
                src={badge.icon_unlocked_url}
                alt={badge.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6'/%3E%3Cpath d='M14 9h1.5a2.5 2.5 0 0 1 0 5H14'/%3E%3Cpath d='M6 9v6'/%3E%3Cpath d='M14 9v6'/%3E%3Cpath d='M6 15h8'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{badge.name}</h3>
            <p className="text-gray-600 text-sm">{badge.description}</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={shareOnWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share on WhatsApp
            </Button>
            <Button 
              onClick={shareOnInstagram}
              variant="outline"
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share on Instagram
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
