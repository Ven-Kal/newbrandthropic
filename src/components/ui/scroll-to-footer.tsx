import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToFooter() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px from top
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToFooter}
      size="sm"
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
      aria-label="Scroll to footer"
    >
      <ChevronDown className="h-5 w-5" />
    </Button>
  );
}