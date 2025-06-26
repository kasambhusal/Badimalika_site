// "use client"

// import { useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { FileText, Download, RefreshCw, Printer } from "lucide-react"
// import { useReportData } from "@/hooks/use-report-data"
// import { GovernmentReportTable } from "@/components/government-report-table"
// import { ReportMetadata } from "@/components/report-metadata"
// import { useGovernmentExport } from "@/hooks/use-government-export"

// export default function ReportDashboard() {
//   const { reportData, loading, error, refetch } = useReportData()
//   const { exportFullReport, isExporting } = useGovernmentExport()
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")

//   const categories = [
//     { value: "all", label: "सबै डेटा" },
//     { value: "demographics", label: "जनसांख्यिकीय" },
//     { value: "housing", label: "आवास" },
//     { value: "infrastructure", label: "पूर्वाधार" },
//     { value: "social", label: "सामाजिक" },
//     { value: "economic", label: "आर्थिक" },
//     { value: "health", label: "स्वास्थ्य" },
//   ]

//   const handleExportReport = async () => {
//     if (!reportData) return
//     await exportFullReport(reportData, selectedCategory)
//   }

//   const handlePrintReport = () => {
//     window.print()
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-center py-12">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-gray-600">रिपोर्ट लोड हुँदैछ...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 px-4">
//         <div className="max-w-7xl mx-auto space-y-6">
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <FileText className="h-12 w-12 text-red-500 mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">समस्या भयो</h3>
//               <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
//               <Button onClick={refetch} variant="outline">
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 पुनः प्रयास गर्नुहोस्
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   if (!reportData) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <FileText className="h-12 w-12 text-gray-400 mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">कुनै डेटा उपलब्ध छैन</h3>
//               <p className="text-gray-600 text-center">रिपोर्ट डेटा उपलब्ध छैन।</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .print-area,
//           .print-area * {
//             visibility: visible;
//           }
//           .print-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }
//       `}</style>

//       <div className="min-h-screen bg-gray-50 py-8 px-4">
//         <div className="max-w-7xl mx-auto space-y-6">
//           {/* Header - No Print */}
//           <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//                 <FileText className="h-8 w-8 mr-3" />
//                 रिपोर्ट व्यवस्थापन
//               </h1>
//               <p className="text-gray-600 mt-2">हरिपुर नगरपालिका सर्वेक्षण रिपोर्ट</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md bg-white"
//               >
//                 {categories.map((cat) => (
//                   <option key={cat.value} value={cat.value}>
//                     {cat.label}
//                   </option>
//                 ))}
//               </select>
//               <Button onClick={handlePrintReport} variant="outline">
//                 <Printer className="h-4 w-4 mr-2" />
//                 प्रिन्ट गर्नुहोस्
//               </Button>
//               <Button onClick={handleExportReport} disabled={isExporting} className="bg-red-600 hover:bg-red-700">
//                 <Download className="h-4 w-4 mr-2" />
//                 {isExporting ? "निर्यात हुँदैछ..." : "PDF निर्यात"}
//               </Button>
//             </div>
//           </div>

//           {/* Report Content - Print Area */}
//           <div className="print-area">
//             {/* Government Header */}
//             <div className="text-center mb-8 p-6 bg-white rounded-lg shadow-sm">
//               <div className="border-b-4 border-red-600 pb-4">
//                 <h1 className="text-2xl font-bold text-gray-900 mb-2">हरिपुर नगरपालिका</h1>
//                 <h2 className="text-xl font-semibold text-gray-800 mb-2">सर्वेक्षण रिपोर्ट</h2>
//                 <p className="text-gray-600">
//                   मिति: {new Date().toLocaleDateString("ne-NP")} | समय: {new Date().toLocaleTimeString("ne-NP")}
//                 </p>
//               </div>
//             </div>

//             {/* Metadata */}
//             <ReportMetadata metadata={reportData.metadata} />

//             {/* Report Tables */}
//             <GovernmentReportTable reportData={reportData} selectedCategory={selectedCategory} />
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
import React from "react";

export default function page() {
  return <div>page</div>;
}
