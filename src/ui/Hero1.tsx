import HeroCard from "@/components/HeroCard";
import {
  Home,
  Users,
  User,
  UserCheck,
  Accessibility,
  Hand,
  Droplet,
  Shield,
  Plane,
  Trees,
} from "lucide-react";

const Hero1 = () => {
  const statsData = [
    {
      icon: Home,
      title: "घरधुरी",
      number: 3185,
    },
    {
      icon: Users,
      title: "जनसंख्या",
      number: 16944,
    },
    {
      icon: User,
      title: "पुरुष संख्या",
      number: 8792,
    },
    {
      icon: UserCheck,
      title: "महिला संख्या",
      number: 8152,
    },
    {
      icon: Accessibility,
      title: "असक्षमता",
      number: 218,
    },
    {
      icon: Hand,
      title: "शौचालय भएको",
      number: 3136,
    },
    {
      icon: Droplet,
      title: "पाइप धारा सार्वजानिक",
      subtitle: "(खानेपानीको मुख्य श्रोत)",
      number: "62.61%",
    },
    {
      icon: Shield,
      title: "सामाजिक सुरक्षा भत्ता",
      number: 1461,
    },
    {
      icon: Plane,
      title: "बैदेशिक रोजगार",
      number: 500,
    },
    {
      icon: Trees,
      title: "वन क्षेत्र",
      number: "10.99%",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            हरिपुर नगरपालिकाको तथ्याङ्क
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            हाम्रो नगरपालिकाका मुख्य तथ्याङ्कहरू र जनसांख्यिकीय विवरणहरू
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {statsData.map((stat, index) => (
            <HeroCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              number={stat.number}
              subtitle={stat.subtitle}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            * तथ्याङ्कहरू नेपाल सरकारको केन्द्रीय तथ्याङ्क विभागको आधारमा
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
