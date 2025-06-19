import FeedbackForm from "@/components/contact/feedback";
import React from "react";

export default function Contact() {
  return (
    <div className="w-full mt-[50px] mb-[500px]">
      <h1 className="text-3xl text-center font-semibold my-3">हाम्रो बारेमा</h1>
      <hr />
      <div
        className="text-center mt-[50px] bg-white"
        style={{
          boxShadow: "0 0px 0px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <p>
          हामी एक अग्रणी कम्पनी हौं जसले उच्च गुणस्तरको उत्पादन र सेवाहरू प्रदान
          गर्दछ। Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Consectetur, beatae obcaecati aut mollitia magni voluptas? Numquam
          illo corporis enim laborum tempora porro odit, eius soluta blanditiis
          nemo distinctio cupiditate optio earum, molestiae iste nam nihil! Quae
          laborum harum eum esse quo voluptatibus rerum officia quisquam
          recusandae quaerat, beatae repellat tempore?
        </p>
      </div>
      <div className="flex justify-between">
        <div className="contact-information flex  justify-center mt-10">
          <div className=" w-full flex flex-col gap-1">
            <h2 className=" text-2xl">Contact Information</h2>
            <p>
              {" "}
              <b>Email:</b> info@example.com
            </p>
            <p>
              {" "}
              <b>Phone:</b> +1234567890
            </p>
          </div>
        </div>
        <FeedbackForm />
      </div>
    </div>
  );
}
