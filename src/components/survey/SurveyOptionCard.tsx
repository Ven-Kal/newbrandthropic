
import { useState } from 'react';
import { SurveyOption } from '@/types/survey';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Heart, 
  Coffee, 
  Share2, 
  Users, 
  Star, 
  Megaphone, 
  ShoppingBag, 
  Award, 
  Headphones, 
  DollarSign, 
  HeartHandshake, 
  Lightbulb,
  Circle
} from 'lucide-react';

interface SurveyOptionCardProps {
  option: SurveyOption;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
}

// Icon mapping for cleaner lookup
const iconMap: Record<string, any> = {
  smartphone: Smartphone,
  shirt: Shirt,
  home: Home,
  heart: Heart,
  coffee: Coffee,
  'share-2': Share2,
  users: Users,
  star: Star,
  megaphone: Megaphone,
  'shopping-bag': ShoppingBag,
  award: Award,
  headphones: Headphones,
  'dollar-sign': DollarSign,
  'heart-handshake': HeartHandshake,
  lightbulb: Lightbulb
};

export const SurveyOptionCard = ({ option, isSelected, onSelect }: SurveyOptionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get the icon component safely
  const IconComponent = iconMap[option.icon_reference] || Circle;

  return (
    <div
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group
        ${isSelected 
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
          : 'border-gray-200 hover:border-primary/30 hover:shadow-md'
        }
        ${isHovered ? 'transform scale-[1.02]' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(option.option_id)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect(option.option_id)}
            className="mt-1"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300
              ${isSelected 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'
              }`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <h3 className={`text-base font-semibold transition-colors duration-300
              ${isSelected ? 'text-primary' : 'text-gray-900'}
            `}>
              {option.option_title}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            {option.option_description}
          </p>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Circle className="w-3 h-3 text-white fill-current" />
          </div>
        </div>
      )}
    </div>
  );
};
