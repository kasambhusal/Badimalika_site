import HeroCard from "@/components/HeroCard";
import { Home, Users, User, UserCheck } from "lucide-react";

const Hero1 = () => {
  const statsData = [
    {
      icon: Home,
      title: "घरधुरी",
      number: 8390,
    },
    {
      icon: Users,
      title: "जनसंख्या",
      number: 43223,
    },
    {
      icon: User,
      title: "पुरुष संख्या",
      number: 21141,
    },
    {
      icon: UserCheck,
      title: "महिला संख्या",
      number: 22012,
    },
  ];

  return (
    <section
      className="w-full bg-[#002c58] py-12 lg:py-16 px-6 lg:px-12"
      style={{ boxShadow: "0 10px 30px rgba(59, 130, 246, 0.25)" }} // tailwind's blue-500 as rgba
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Side - Welcome Text */}
        <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col gap-3 items-center lg:items-start">
          <h1
            className="text-3xl lg:text-5xl font-bold text-white "
            style={{ lineHeight: "1.2" }}
          >
            हरिपुर नगरपालिकाको
          </h1>
          <h2
            className="text-3xl lg:text-5xl font-bold text-yellow-400 "
            style={{ lineHeight: "1.2" }}
          >
            डिजिटल प्रोफाइलमा
          </h2>
          <p
            className="text-2xl lg:text-5xl text-white "
            style={{ lineHeight: "1.2" }}
          >
            तपाईंलाई स्वागत छ ।
          </p>
        </div>

        {/* Right Side - Stats Grid */}
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-2 gap-4 lg:gap-6 max-w-lg mx-auto">
            {statsData.map((stat, index) => (
              <HeroCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                number={stat.number}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
