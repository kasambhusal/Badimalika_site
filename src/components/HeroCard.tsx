import { toNepaliNumber } from "@/utils/NumberConvert";
import type { LucideIcon } from "lucide-react";

interface HeroCardProps {
  icon: LucideIcon;
  title: string;
  number: number;
}

const HeroCard = ({ icon: Icon, title, number }: HeroCardProps) => {
  return (
    <div className="bg-blue-700/50 backdrop-blur-sm rounded-xl p-6 text-center text-white hover:bg-blue-700/70 transition-colors duration-200">
      <div className="flex justify-center mb-3">
        <Icon className="w-8 h-8 text-blue-200" />
      </div>
      <div className="text-2xl lg:text-3xl font-bold mb-2">
        {toNepaliNumber(number.toLocaleString())}
      </div>
      <div className="text-sm lg:text-base text-blue-100">{title}</div>
    </div>
  );
};

export default HeroCard;
