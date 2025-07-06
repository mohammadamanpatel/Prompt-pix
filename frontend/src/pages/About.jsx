import React from "react";

export const About = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white py-16 px-8 lg:px-32">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-500">
          About This Project
        </h1>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-indigo-400">
            MOHD AMAN NAIM PATEL
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            I'm MOHD AMAN NAIM PATEL, a passionate full-stack developer with
            extensive experience in creating responsive web applications. This
            project, an advanced image generator application, was developed
            using the MERN stack (MongoDB, Express.js, React, Node.js), and it
            integrates modern tools and techniques such as Cloudinary for media
            management and Redux for state management.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            I built this web app to provide users with a seamless experience in
            generating and managing images and GIFs. The application features a
            user-friendly interface, allowing for profile management, image
            previews, and secure cloud storage.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            My expertise in front-end development with React.js and back-end
            development with Node.js and Express.js has been crucial in
            delivering this robust and scalable application. I have also
            focused on ensuring that the app is highly responsive and performs
            well across all devices.
          </p>
          <p className="text-lg leading-relaxed">
            This project reflects my commitment to developing high-quality web
            applications that meet modern standards of performance, design, and
            functionality. I'm excited to continue pushing the boundaries of
            what can be achieved in web development.
          </p>
        </div>
      </div>
    </div>
  );
};
