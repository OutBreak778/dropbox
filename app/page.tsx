import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col lg:flex-row items-center bg-[#1e1919] dark:bg-slate-800">
        <div className="p-10 flex flex-col bg-[#2b2929] dark:bg-slate-800 text-white space-y-5">
          <h1 className="text-4xl font-bold">
            Welcome to Image Dropbox.
            <br />
            <br />
            Store your important images, document and other files at one Place.
          </h1>
          <p className="pb-16">
            Enhance your personal storage with Dropbox, offering a simple and
            efficient way to upload, organise and access files from anywhere.
            Securely store and files and document and media and experience the
            convinience of easy file management and sharing in one solution.
          </p>
          <Link
            href="/dashboard"
            className="flex p-5 cursor-pointer bg-blue-500 w-fit rounded-sm"
          >
            Try it now!
            <ArrowRight className="w-6 h-6 ml-4" />
          </Link>
        </div>
        <div className="bg-[#1e1919] dark:bg-slate-800 h-full p-14">
          <video autoPlay muted loop className="rounded-lg">
            <source src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/dash/dbx-header-blur-1920x1080.mp4" />
          </video>
        </div>
      </div>
      <p className="text-center font-bold text-xl pt-5">Disclaimer</p>
      <p className="text-center font-light px-6 py-4">
        With Dropbox, you get a full suite of tools designed to help you create,
        share, manage, and track content more efficiently.
        <br />
        Keep everything that's important to you and your family shareable and
        safe image in one place. Store your Images here.
        <br />
        <b className="text-md font-bold">
          Your can upload files and any document{" "}
          <u className="underline underline-offset-4">upto 100 MB</u>
        </b>
        <code className="fixed bottom-5 right-5 px-3 py-2 bg-[#2b2929] text-[#f9f9f9] dark:bg-white dark:text-black rounded-md transition-colors">
          by Nikhil Mishra
        </code>
      </p>
    </main>
  );
}
