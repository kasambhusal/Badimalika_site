"use client";

import { Card, CardContent } from "@/components/ui/card";

interface MemberCardProps {
  name: string;
  position: string;
  phone: string;
  email?: string;
  address?: string;
  imageUrl: string;
  headerColor: string;
  className?: string;
}

export function MemberCard({
  name,
  position,
  phone,
  email,
  address = "बडीमालिका",
  imageUrl,
  headerColor,
  className,
}: MemberCardProps) {
  return (
    <Card className={`overflow-hidden text-center ${className}`}>
      {/* Top Header Color Section */}
      <div
        className="h-28 w-full rounded-t-xl"
        style={{ backgroundColor: headerColor }}
      />

      {/* Image in Circle Overlapping Header */}
      <div className="-mt-12 flex justify-center">
        <div className="w-24 h-24 rounded-full  overflow-hidden shadow-md">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content Below Image */}
      <CardContent className="pt-4 pb-6 px-6">
        <h3 className="text-xl font-extrabold text-black">{name}</h3>
        <p className="text-md font-medium text-gray-800">{position}</p>

        <div className="mt-4 text-left space-y-2 text-sm font-semibold text-black">
          <p>ठेगाना : {address}</p>
          <p>सम्पर्क नं : {phone}</p>
          {email && <p>ईमेल : {email}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
