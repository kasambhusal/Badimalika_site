"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  Banknote,
  Users,
} from "lucide-react";
import { toNepaliNumber } from "@/utils/NumberConvert";

interface Organization {
  id: number;
  name: string;
  category: string;
  address: string;
}

// Static dummy data
const staticOrganizationsData: Organization[] = [
  {
    id: 1,
    name: "श्री सरस्वती माध्यमिक विद्यालय",
    category: "Schools",
    address: "हरिपुर-१, काठमाडौं",
  },
  {
    id: 2,
    name: "हरिपुर स्वास्थ्य केन्द्र",
    category: "Health Institutions",
    address: "हरिपुर-२, काठमाडौं",
  },
  {
    id: 3,
    name: "नेपाल बैंक शाखा",
    category: "Financial Institutions",
    address: "हरिपुर-३, काठमाडौं",
  },
  {
    id: 4,
    name: "युवा विकास संस्था",
    category: "NGOs",
    address: "हरिपुर-४, काठमाडौं",
  },
  {
    id: 5,
    name: "गौतम बुद्ध प्राथमिक विद्यालय",
    category: "Schools",
    address: "हरिपुर-५, काठमाडौं",
  },
  {
    id: 6,
    name: "महिला सशक्तिकरण केन्द्र",
    category: "NGOs",
    address: "हरिपुर-६, काठमाडौं",
  },
  {
    id: 7,
    name: "राष्ट्रिय वाणिज्य बैंक",
    category: "Financial Institutions",
    address: "हरिपुर-७, काठमाडौं",
  },
  {
    id: 8,
    name: "आयुर्वेदिक अस्पताल",
    category: "Health Institutions",
    address: "हरिपुर-८, काठमाडौं",
  },
  {
    id: 9,
    name: "जनता माध्यमिक विद्यालय",
    category: "Schools",
    address: "हरिपुर-९, काठमाडौं",
  },
  {
    id: 10,
    name: "बाल कल्याण संस्था",
    category: "NGOs",
    address: "हरिपुर-१०, काठमाडौं",
  },
  {
    id: 11,
    name: "कृषि विकास बैंक",
    category: "Financial Institutions",
    address: "हरिपुर-११, काठमाडौं",
  },
  {
    id: 12,
    name: "प्राथमिक स्वास्थ्य केन्द्र",
    category: "Health Institutions",
    address: "हरिपुर-१२, काठमाडौं",
  },
  {
    id: 13,
    name: "हिमालय उच्च माध्यमिक विद्यालय",
    category: "Schools",
    address: "हरिपुर-१३, काठमाडौं",
  },
  {
    id: 14,
    name: "वातावरण संरक्षण समिति",
    category: "NGOs",
    address: "हरिपुर-१४, काठमाडौं",
  },
  {
    id: 15,
    name: "सहकारी बचत तथा ऋण संस्था",
    category: "Financial Institutions",
    address: "हरिपुर-१५, काठमाडौं",
  },
  {
    id: 16,
    name: "मातृत्व अस्पताल",
    category: "Health Institutions",
    address: "हरिपुर-१६, काठमाडौं",
  },
  {
    id: 17,
    name: "शिक्षा विकास संस्था",
    category: "NGOs",
    address: "हरिपुर-१७, काठमाडौं",
  },
  {
    id: 18,
    name: "तकनिकी शिक्षालय",
    category: "Schools",
    address: "हरिपुर-१८, काठमाडौं",
  },
];

export default function OrganizationsPage() {
  const [organizationsData] = useState<Organization[]>(staticOrganizationsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Get unique categories from data
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(organizationsData.map((org) => org.category))
    );
    return uniqueCategories.sort();
  }, [organizationsData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const schoolsCount = organizationsData.filter(
      (org) => org.category === "Schools"
    ).length;
    const ngosCount = organizationsData.filter(
      (org) => org.category === "NGOs"
    ).length;
    const financialCount = organizationsData.filter(
      (org) => org.category === "Financial Institutions"
    ).length;
    const healthCount = organizationsData.filter(
      (org) => org.category === "Health Institutions"
    ).length;

    return {
      schools: schoolsCount,
      ngos: ngosCount,
      financial: financialCount,
      health: healthCount,
    };
  }, [organizationsData]);

  // Filter organizations based on search and category
  const filteredOrganizations = useMemo(() => {
    return organizationsData.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || org.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [organizationsData, searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganizations = filteredOrganizations.slice(
    startIndex,
    endIndex
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "Schools":
        return <GraduationCap className="h-8 w-8" />;
      case "NGOs":
        return <Users className="h-8 w-8" />;
      case "Financial Institutions":
        return <Banknote className="h-8 w-8" />;
      case "Health Institutions":
        return <Heart className="h-8 w-8" />;
      default:
        return <Building2 className="h-8 w-8" />;
    }
  };

  const getCategoryInNepali = (category: string) => {
    switch (category) {
      case "Schools":
        return "विद्यालय";
      case "NGOs":
        return "गैरसरकारी संस्थाहरू";
      case "Financial Institutions":
        return "वित्तीय संस्था";
      case "Health Institutions":
        return "स्वास्थ्य संस्था";
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
              संस्थाहरू / Organizations
            </h1>
            <p className="text-gray-600 mt-2">
              हरिपुर नगरपालिकाका दर्ता संस्थाहरू
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {filteredOrganizations.length} organization(s)
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="bg-blue-500 text-white p-2 sm:p-3 rounded-lg">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-700">
                    {toNepaliNumber(stats.schools)}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium">
                    विद्यालयहरू
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="bg-green-500 text-white p-2 sm:p-3 rounded-lg">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-green-700">
                    {toNepaliNumber(stats.ngos)}
                  </div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">
                    गैरसरकारी संस्थाहरू
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="bg-purple-500 text-white p-2 sm:p-3 rounded-lg">
                  <Banknote className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-700">
                    {toNepaliNumber(stats.financial)}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">
                    वित्तीय संस्थाहरू
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="bg-red-500 text-white p-2 sm:p-3 rounded-lg">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-red-700">
                    {toNepaliNumber(stats.health)}
                  </div>
                  <div className="text-xs sm:text-sm text-red-600 font-medium">
                    स्वास्थ्य संस्थाहरू
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search organizations by name or address..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-64">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryInNepali(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organizations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrganizations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-8 text-gray-500"
                      >
                        No organizations found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentOrganizations.map((org) => (
                      <TableRow key={org.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {org.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="text-gray-500">
                              {getIconForCategory(org.category)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {getCategoryInNepali(org.category)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {org.address}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredOrganizations.length)} of{" "}
                  {filteredOrganizations.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
