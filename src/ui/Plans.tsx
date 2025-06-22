"use client";
import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";

interface PlanAttachment {
  id: number;
  name: string;
  type: "pdf" | "image";
  url: string;
}

interface PlanItem {
  id: number;
  title: string;
  description: string;
  attachments: PlanAttachment[];
  progressNote: string;
}

// Static dummy data
const staticPlansData: PlanItem[] = [
  {
    id: 1,
    title: "सडक निर्माण योजना २०८१",
    description:
      "हरिपुर नगरपालिकाको मुख्य सडकहरूको निर्माण र मर्मत सम्बन्धी योजना। यस योजना अन्तर्गत वडा नं १ देखि ५ सम्मका सडकहरूको निर्माण कार्य समावेश छ।",
    attachments: [
      {
        id: 1,
        name: "Road_Construction_Plan_2081.pdf",
        type: "pdf",
        url: "/placeholder.pdf",
      },
      {
        id: 2,
        name: "road_map.jpg",
        type: "image",
        url: "/placeholder.svg?height=400&width=600",
      },
    ],
    progressNote:
      "योजना अनुसार ५०% काम सम्पन्न भएको छ। वडा नं १ र २ को सडक निर्माण कार्य पूरा भएको छ।",
  },
  {
    id: 2,
    title: "पानी आपूर्ति परियोजना",
    description:
      "स्वच्छ खानेपानी आपूर्ति व्यवस्थाको सुधार र विस्तार गर्ने योजना। नयाँ पाइप लाइन र ट्याङ्की निर्माण समावेश छ।",
    attachments: [
      {
        id: 3,
        name: "Water_Supply_Project.pdf",
        type: "pdf",
        url: "/placeholder.pdf",
      },
      {
        id: 4,
        name: "water_tank_design.png",
        type: "image",
        url: "/placeholder.svg?height=300&width=400",
      },
      {
        id: 5,
        name: "pipeline_layout.jpg",
        type: "image",
        url: "/placeholder.svg?height=350&width=500",
      },
    ],
    progressNote:
      "परियोजनाको प्रारम्भिक चरण सुरु भएको छ। भूमि अधिग्रहणको काम चलिरहेको छ।",
  },
  {
    id: 3,
    title: "शिक्षा पूर्वाधार विकास",
    description:
      "स्थानीय विद्यालयहरूमा भवन निर्माण र मर्मत, कम्प्युटर ल्याब स्थापना र पुस्तकालय सुधार कार्यक्रम।",
    attachments: [
      {
        id: 6,
        name: "Education_Infrastructure_Plan.pdf",
        type: "pdf",
        url: "/placeholder.pdf",
      },
    ],
    progressNote:
      "३ वटा विद्यालयमा भवन मर्मतको काम सम्पन्न। कम्प्युटर ल्याब स्थापनाको काम चलिरहेको छ।",
  },
  {
    id: 4,
    title: "स्वास्थ्य सेवा सुधार योजना",
    description:
      "स्थानीय स्वास्थ्य केन्द्रमा उपकरण खरिद, डाक्टर र नर्सहरूको व्यवस्था र आपतकालीन सेवा सुधार।",
    attachments: [
      {
        id: 7,
        name: "Health_Service_Plan.pdf",
        type: "pdf",
        url: "/placeholder.pdf",
      },
      {
        id: 8,
        name: "medical_equipment.jpg",
        type: "image",
        url: "/placeholder.svg?height=300&width=450",
      },
    ],
    progressNote:
      "नयाँ मेडिकल उपकरणहरू खरिद सम्पन्न। २ जना नयाँ नर्स भर्ना भएका छन्।",
  },
  {
    id: 5,
    title: "कृषि विकास कार्यक्रम",
    description:
      "किसानहरूलाई आधुनिक कृषि प्रविधि सिकाउने र बीउ बिजन वितरण कार्यक्रम। जैविक मल उत्पादन केन्द्र स्थापना।",
    attachments: [
      {
        id: 9,
        name: "Agriculture_Development.pdf",
        type: "pdf",
        url: "/placeholder.pdf",
      },
      {
        id: 10,
        name: "farming_techniques.png",
        type: "image",
        url: "/placeholder.svg?height=280&width=420",
      },
      {
        id: 11,
        name: "seed_distribution.jpg",
        type: "image",
        url: "/placeholder.svg?height=320&width=480",
      },
    ],
    progressNote:
      "५०० किसानहरूलाई तालिम दिइएको छ। बीउ वितरण कार्यक्रम सुरु भएको छ।",
  },
  {
    id: 6,
    title: "फोहोर व्यवस्थापन योजना",
    description:
      "नगरपालिका क्षेत्रमा फोहोर संकलन र व्यवस्थापनको सुधार। रिसाइक्लिङ केन्द्र स्थापना र सफाई अभियान।",
    attachments: [
      {
        id: 12,
        name: "Waste_Management_Plan.pdf",
        type: "pdf",
        url: "/placeholder.pdf",
      },
    ],
    progressNote:
      "नयाँ फोहोर संकलन गाडी खरिद। साप्ताहिक सफाई अभियान सुरु भएको छ।",
  },
  {
    id: 7,
    title: "युवा रोजगार कार्यक्रम",
    description:
      "स्थानीय युवाहरूका लागि सीप विकास तालिम र रोजगारीका अवसर सिर्जना गर्ने कार्यक्रम।",
    attachments: [
      {
        id: 13,
        name: "Youth_Employment_Program.pdf",
        type: "pdf",
        url: "/placeholder.pdf",
      },
      {
        id: 14,
        name: "skill_training.jpg",
        type: "image",
        url: "/placeholder.svg?height=300&width=400",
      },
    ],
    progressNote: "२०० युवाहरूले तालिम लिएका छन्। ५०% ले रोजगारी पाएका छन्।",
  },
  {
    id: 8,
    title: "पर्यटन विकास योजना",
    description:
      "स्थानीय पर्यटन स्थलहरूको विकास र प्रवर्द्धन। होमस्टे कार्यक्रम र ट्रेकिङ रुट विकास।",
    attachments: [
      {
        id: 15,
        name: "Tourism_Development.pdf",
        type: "pdf",
        url: "/placeholder.pdf",
      },
      {
        id: 16,
        name: "tourist_spots.png",
        type: "image",
        url: "/placeholder.svg?height=350&width=500",
      },
      {
        id: 17,
        name: "homestay_program.jpg",
        type: "image",
        url: "/placeholder.svg?height=280&width=420",
      },
    ],
    progressNote:
      "५ वटा होमस्टे दर्ता भएका छन्। नयाँ ट्रेकिङ रुटको काम सुरु भएको छ।",
  },
];

export default function PlansPage() {
  const [plansData] = useState<PlanItem[]>(staticPlansData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Filter plans based on search
  const filteredPlans = plansData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.progressNote.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);

  // Handle download
  const handleDownload = (attachment: PlanAttachment) => {
    // In a real app, this would trigger actual file download
    console.log(`Downloading: ${attachment.name}`);
    alert(`Downloading: ${attachment.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="h-8 w-8 mr-3" />
              योजनाहरू / Plans
            </h1>
            <p className="text-gray-600 mt-2">
              हरिपुर नगरपालिकाका विकास योजनाहरू
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {filteredPlans.length} plan(s)
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search plans by title, description, or progress note..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle>Development Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Progress Note</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPlans.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-gray-500"
                      >
                        No plans found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPlans.map((plan) => (
                      <TableRow key={plan.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {plan.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {plan.description.length > 100
                                ? `${plan.description.substring(0, 100)}...`
                                : plan.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {plan.progressNote.length > 80
                                ? `${plan.progressNote.substring(0, 80)}...`
                                : plan.progressNote}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center">
                                  <FileText className="h-5 w-5 mr-2" />
                                  {plan.title}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Description */}
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Description
                                  </h3>
                                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                    {plan.description}
                                  </p>
                                </div>

                                {/* Progress Note */}
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Progress Note
                                  </h3>
                                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    {plan.progressNote}
                                  </p>
                                </div>

                                {/* Attachments */}
                                {plan.attachments.length > 0 && (
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                      Attachments
                                    </h3>
                                    <div className="space-y-4">
                                      {/* Images */}
                                      {plan.attachments.filter(
                                        (att) => att.type === "image"
                                      ).length > 0 && (
                                        <div>
                                          <h4 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                                            <ImageIcon className="h-4 w-4 mr-1" />
                                            Images
                                          </h4>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {plan.attachments
                                              .filter(
                                                (att) => att.type === "image"
                                              )
                                              .map((attachment) => (
                                                <div
                                                  key={attachment.id}
                                                  className="border rounded-lg overflow-hidden"
                                                >
                                                  <Image
                                                    src={
                                                      attachment.url ||
                                                      "/placeholder.svg"
                                                    }
                                                    alt={attachment.name}
                                                    width={300}
                                                    height={200}
                                                    className="w-full h-48 object-cover"
                                                  />
                                                  <div className="p-2">
                                                    <p className="text-xs text-gray-600 truncate">
                                                      {attachment.name}
                                                    </p>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* PDFs */}
                                      {plan.attachments.filter(
                                        (att) => att.type === "pdf"
                                      ).length > 0 && (
                                        <div>
                                          <h4 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                                            <FileText className="h-4 w-4 mr-1" />
                                            Documents
                                          </h4>
                                          <div className="space-y-2">
                                            {plan.attachments
                                              .filter(
                                                (att) => att.type === "pdf"
                                              )
                                              .map((attachment) => (
                                                <div
                                                  key={attachment.id}
                                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                                >
                                                  <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-red-500 mr-2" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                      {attachment.name}
                                                    </span>
                                                  </div>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleDownload(attachment)
                                                    }
                                                    className="text-blue-600 hover:text-blue-700"
                                                  >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Download
                                                  </Button>
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredPlans.length)} of{" "}
                  {filteredPlans.length} results
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
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
