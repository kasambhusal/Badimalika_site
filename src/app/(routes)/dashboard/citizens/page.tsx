"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Plus, Filter } from "lucide-react"

export default function CitizensPage() {
  const citizens = [
    {
      id: 1,
      name: "राम बहादुर श्रेष्ठ",
      phone: "9841234567",
      address: "हरिपुर-१, काठमाडौं",
      status: "Active",
    },
    {
      id: 2,
      name: "सीता देवी पौडेल",
      phone: "9851234567",
      address: "हरिपुर-२, काठमाडौं",
      status: "Active",
    },
    {
      id: 3,
      name: "गोपाल तामाङ",
      phone: "9861234567",
      address: "हरिपुर-३, काठमाडौं",
      status: "Inactive",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Citizens Management
          </h1>
          <p className="text-gray-600">Manage citizen records and information</p>
        </div>
        <Button className="bg-[#002c58] hover:bg-[#003d73]">
          <Plus className="h-4 w-4 mr-2" />
          Add Citizen
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search citizens by name, phone, or address..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Citizens List */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Citizens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Address</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {citizens.map((citizen) => (
                  <tr key={citizen.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{citizen.name}</td>
                    <td className="py-3 px-4 text-gray-600">{citizen.phone}</td>
                    <td className="py-3 px-4 text-gray-600">{citizen.address}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          citizen.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {citizen.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
