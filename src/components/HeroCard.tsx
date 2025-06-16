import type { LucideIcon } from "lucide-react";

interface HeroCardProps {
  icon: LucideIcon;
  title: string;
  number: string | number;
  subtitle?: string;
}

const HeroCard = ({ icon: Icon, title, number, subtitle }: HeroCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div className="p-3 bg-gray-50 rounded-full">
          <Icon className="w-8 h-8 text-gray-700" />
        </div>

        {/* Title */}
        <h3 className="text-gray-800 font-semibold text-base leading-tight">
          {title}
          {subtitle && (
            <span className="block text-sm text-gray-600 font-normal mt-1">
              {subtitle}
            </span>
          )}
        </h3>

        {/* Number */}
        <div className="text-2xl lg:text-3xl font-bold text-[#002c58]">
          {typeof number === "string" && number.includes("%") ? (
            <span>{number}</span>
          ) : (
            <span>{number.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
