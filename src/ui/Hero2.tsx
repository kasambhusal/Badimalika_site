"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const Hero2 = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample images - replace with your actual municipality images
  const images = [
    {
      src: "/assets/images/HeroImages/one.jpeg",
      alt: "हरिपुर नगरपालिकाको प्राकृतिक दृश्य",
    },
    {
      src: "/assets/images/HeroImages/two.jpeg",
      alt: "हरिपुरको सांस्कृतिक धरोहर",
    },
    {
      src: "/assets/images/HeroImages/three.jpeg",
      alt: "स्थानीय जनजीवन",
    },
    {
      src: "/assets/images/HeroImages/four.jpeg",
      alt: "पर्यटकीय स्थलहरू",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Image Carousel */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white p-2">
              <div className="relative h-80 lg:h-96">
                <Image
                  src={images[currentImageIndex].src || "/placeholder.svg"}
                  alt={images[currentImageIndex].alt}
                  fill
                  className="object-cover rounded-xl transition-all duration-500"
                  priority
                />

                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Image Indicators */}
              <div className="flex justify-center space-x-2 mt-4 pb-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? "bg-gray-800 w-6"
                        : "bg-gray-400 hover:bg-gray-600"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Municipality Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-8 py-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-white text-center">
                  बडीमालिकाको परिचय
                </h1>
              </div>

              {/* Content */}
              <div className="px-8 py-8">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="text-base lg:text-lg mb-6">
                    हरिपुर नगरपालिका सर्लाही जिल्लाको ११ नगरपालिका मध्येको एक
                    हो। नगरपालिका घोषणा गर्दा हरिपुर, लक्ष्मीपुर (कोदरहवा),
                    फरहदवा, पिडारी र जानकीनगर (१,२,३ र ५) गाविसहरू यसमा गाभिएका
                    थिए।
                  </p>

                  <p className="text-base lg:text-lg mb-6">
                    राष्ट्रिय जनगणना २०७८को जनगणना अनुसार हरिपुर नगरपालिकाको कुल
                    जनसङ्ख्या ४३,२३३ रहेको छ भने यहाँ ८,३५० घरधुरी रहेका छन्।
                  </p>

                  <p className="text-base lg:text-lg">
                    यस नगरपालिकामा ३० प्रतिशत मध्यपहाडी गरिबीको रेखामुनी रहेका
                    छन्। जिल्लाको सदरमुकाममा अवस्थित नगरपालिकाको रूप भने भौगोलिक
                    विकटताको कारण क्षेत्रकाहरू हिसाबले यस नगरपालिकाको केन्द्र
                    बाट सबै वडा बाट समान दुरीमा छैनन्।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
