"use client";

import { MemberCard } from "@/components/MemberCard";

interface Member {
  id: string;
  name: string;
  position: string;
  phone: string;
  email?: string;
  imageUrl: string;
  headerColor: string;
}

interface HomeMemberProps {
  members?: Member[];
  title?: string;
  className?: string;
}

const defaultMembers: Member[] = [
  {
    id: "1",
    name: "विनय पौडेल",
    position: "प्रमुख प्रशासकीय अधिकृत ",
    phone: "9854084666",
    email: "mail8haripurmun@gmail.com",
    imageUrl: "/assets/images/Members/vinay-poudel.jpg",
    headerColor: "#7C93F0", // Light blue
  },
  {
    id: "2",
    name: "भुपेन्द्र कुमार सिंह",
    position: "लेखा अधिकृत",
    phone: "9854080113",
    email: "",
    imageUrl: "/assets/images/Members/vupendra-sing-poudel.jpeg",
    headerColor: "#8B7CF0", // Purple
  },
  {
    id: "3",
    name: "विवेक कुमार यादव",
    position: "इन्जिनियर ",
    phone: "9823579764",
    email: "smart45yadav@gmail.com ",
    imageUrl: "/assets/images/Members/bibek-kumar-yadav.jpg",
    headerColor: "#4FFFB0", // Green
  },
];

export function HomeMembers({
  members = defaultMembers,
  title = "सदस्यहरू",
  className,
}: HomeMemberProps) {
  return (
    <div
      className={`bg-white w-full py-3 flex flex-col items-center ${className}`}
    >
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded"></div>
        </div>
      )}

      <div className=" w-8/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              name={member.name}
              position={member.position}
              phone={member.phone}
              email={member.email}
              imageUrl={member.imageUrl}
              headerColor={member.headerColor}
              className="bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
