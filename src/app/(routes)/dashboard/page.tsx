"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogin } from "@/context/login-context";
import {
  Users,
  FileText,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useLogin();

  const stats = [
    {
      name: "Total Citizens",
      value: "2,847",
      icon: Users,
      change: "+12%",
      changeType: "increase",
    },
    {
      name: "Pending Applications",
      value: "23",
      icon: FileText,
      change: "-5%",
      changeType: "decrease",
    },
    {
      name: "Upcoming Events",
      value: "8",
      icon: Calendar,
      change: "+3",
      changeType: "increase",
    },
    {
      name: "New Feedback",
      value: "15",
      icon: MessageSquare,
      change: "+8",
      changeType: "increase",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Birth Certificate",
      applicant: "राम बहादुर श्रेष्ठ",
      status: "Approved",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "Business License",
      applicant: "सीता देवी पौडेल",
      status: "Pending",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "Marriage Certificate",
      applicant: "गोपाल तामाङ",
      status: "Under Review",
      time: "6 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.userName}!
        </h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening in हरिपुर नगरपालिका today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-[#002c58]" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === "increase"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600">
                      {activity.applicant}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 text-left bg-[#002c58] text-white rounded-lg hover:bg-[#003d73] transition-colors">
                <FileText className="h-6 w-6 mb-2" />
                <p className="font-medium">New Application</p>
                <p className="text-sm opacity-90">Process citizen request</p>
              </button>
              <button className="p-4 text-left bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                <Users className="h-6 w-6 mb-2" />
                <p className="font-medium">Citizen Registry</p>
                <p className="text-sm text-gray-600">Manage citizens</p>
              </button>
              <button className="p-4 text-left bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                <Calendar className="h-6 w-6 mb-2" />
                <p className="font-medium">Schedule Event</p>
                <p className="text-sm text-gray-600">Add new event</p>
              </button>
              <button className="p-4 text-left bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                <MessageSquare className="h-6 w-6 mb-2" />
                <p className="font-medium">View Feedback</p>
                <p className="text-sm text-gray-600">Check citizen feedback</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
