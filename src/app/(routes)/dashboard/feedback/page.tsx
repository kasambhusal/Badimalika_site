"use client";

import type React from "react";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MessageSquare,
  Search,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Get, Delete } from "@/lib/api"

interface FeedbackItem {
  id: number;
  name: string;
  phone: string;
  subject: string;
  address: string;
  message: string;
  submittedAt: string;
}

// Static data - replace with API call later
const staticFeedbackData: FeedbackItem[] = [
  {
    id: 1,
    name: "राम बहादुर श्रेष्ठ",
    phone: "9841234567",
    subject: "सडक मर्मतको बारेमा",
    address: "हरिपुर-१, काठमाडौं",
    message:
      "हाम्रो क्षेत्रको मुख्य सडकमा धेरै खाडलहरू छन्। यसले गाडी चलाउन निकै समस्या भएको छ। कृपया यसलाई तुरुन्त मर्मत गरिदिनुहोस्।",
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "सीता देवी पौडेल",
    phone: "9851234567",
    subject: "पानी आपूर्ति समस्या",
    address: "हरिपुर-२, काठमाडौं",
    message:
      "हाम्रो क्षेत्रमा तीन दिनदेखि पानी आएको छैन। यो समस्या तुरुन्त समाधान गरिदिनुहोस्।",
    submittedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: 3,
    name: "गोपाल तामाङ",
    phone: "9861234567",
    subject: "बिजुली समस्या",
    address: "हरिपुर-३, काठमाडौं",
    message:
      "हाम्रो क्षेत्रमा बारम्बार बिजुली जान्छ। यसले दैनिक जीवनमा धेरै समस्या भएको छ।",
    submittedAt: "2024-01-13T09:15:00Z",
  },
  {
    id: 4,
    name: "कमला खत्री",
    phone: "9871234567",
    subject: "फोहोर व्यवस्थापन",
    address: "हरिपुर-४, काठमाडौं",
    message:
      "हाम्रो क्षेत्रमा फोहोर संकलन नियमित रूपमा भएको छैन। यसले स्वास्थ्य समस्या सिर्जना गरेको छ।",
    submittedAt: "2024-01-12T16:45:00Z",
  },
  {
    id: 5,
    name: "अर्जुन गुरुङ",
    phone: "9881234567",
    subject: "सार्वजनिक शौचालय",
    address: "हरिपुर-५, काठमाडौं",
    message:
      "बजार क्षेत्रमा सार्वजनिक शौचालयको अभाव छ। कृपया यसको व्यवस्था मिलाइदिनुहोस्।",
    submittedAt: "2024-01-11T11:30:00Z",
  },
  {
    id: 6,
    name: "मीरा शर्मा",
    phone: "9891234567",
    subject: "बाल पार्क निर्माण",
    address: "हरिपुर-६, काठमाडौं",
    message:
      "हाम्रो क्षेत्रमा बालबालिकाका लागि खेल्ने ठाउँको अभाव छ। एउटा सानो पार्क बनाइदिनुहोस्।",
    submittedAt: "2024-01-10T13:20:00Z",
  },
  {
    id: 7,
    name: "विष्णु लामा",
    phone: "9801234567",
    subject: "स्ट्रिट लाइट",
    address: "हरिपुर-७, काठमाडौं",
    message:
      "हाम्रो गल्लीमा बत्ती नभएकोले राति हिँड्न समस्या छ। स्ट्रिट लाइटको व्यवस्था गरिदिनुहोस्।",
    submittedAt: "2024-01-09T18:10:00Z",
  },
  {
    id: 8,
    name: "सुनिता राई",
    phone: "9811234567",
    subject: "स्वास्थ्य केन्द्र सेवा",
    address: "हरिपुर-८, काठमाडौं",
    message:
      "स्थानीय स्वास्थ्य केन्द्रमा डाक्टरको अभाव छ। नियमित सेवाको व्यवस्था गरिदिनुहोस्।",
    submittedAt: "2024-01-08T08:45:00Z",
  },
];

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] =
    useState<FeedbackItem[]>(staticFeedbackData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Filter feedback based on search and status
  const filteredFeedback = feedbackData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeedback = filteredFeedback.slice(startIndex, endIndex);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle delete feedback
  const handleDelete = async (id: number) => {
    setIsDeleting(true);

    try {
      // TODO: Uncomment when API is ready
      // await Delete({ url: `/feedback/${id}/` })

      // For now, just remove from local state
      setFeedbackData((prev) => prev.filter((item) => item.id !== id));
      setDeleteSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to delete feedback:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Load feedback data (for future API integration)
  // useEffect(() => {
  //   const loadFeedback = async () => {
  //     try {
  //       const response = await Get({ url: "/feedback/" })
  //       setFeedbackData(response.data || [])
  //     } catch (error) {
  //       console.error("Failed to load feedback:", error)
  //     }
  //   }
  //   loadFeedback()
  // }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            Feedback Management
          </h1>
          <p className="text-gray-600">
            Manage citizen feedback and suggestions
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {filteredFeedback.length} feedback(s)
        </div>
      </div>

      {/* Success Alert */}
      {deleteSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <MessageSquare className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Feedback deleted successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, subject, phone, or address..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Citizen</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentFeedback.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No feedback found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  currentFeedback.map((feedback) => (
                    <TableRow key={feedback.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center">
                            <User className="h-4 w-4 mr-1 text-gray-400" />
                            {feedback.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {feedback.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium truncate">
                            {feedback.subject}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {feedback.message.substring(0, 50)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {feedback.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(feedback.submittedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFeedback(feedback)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Feedback
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this feedback
                                  from <strong>{feedback.name}</strong>? This
                                  action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(feedback.id)}
                                  disabled={isDeleting}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredFeedback.length)} of{" "}
                {filteredFeedback.length} results
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

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <AlertDialog
          open={!!selectedFeedback}
          onOpenChange={() => setSelectedFeedback(null)}
        >
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Feedback Details
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Name
                  </Label>
                  <p className="text-sm">{selectedFeedback.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Phone
                  </Label>
                  <p className="text-sm">{selectedFeedback.phone}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Address
                </Label>
                <p className="text-sm">{selectedFeedback.address}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Subject
                </Label>
                <p className="text-sm font-medium">
                  {selectedFeedback.subject}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Message
                </Label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {selectedFeedback.message}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Submitted
                  </Label>
                  <p className="text-sm">
                    {formatDate(selectedFeedback.submittedAt)}
                  </p>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

function Label({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <label className={className}>{children}</label>;
}
