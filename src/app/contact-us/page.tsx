"use client";
import React, { useEffect, useState } from "react";
import sendEmailServerHandler from "./action";
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/components/actions/action";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { toast } = useToast();
  const [details, setDetails] = useState({
    fname: "",
    lname: "",
    email: "",
    enquiry: "",
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const getUserAndSetDetails = async () => {
    const response = await getUser();
    const success = response.success;
    if (success && response.user! != "") {
      const user = JSON.parse(response.user!);
      if (response.user != "") {
        setDetails({
          ...details,
          fname: user?.firstName,
          lname: user?.lastName,
          email: user?.emailAddresses[0].emailAddress,
        });
      }
    }
  };

  const sendEmail = async () => {
    // debugger;
    try {
      setIsDisabled(true);
      var fname = details.fname.trim();
      var lname = details.lname.trim();
      var email = details.email.trim();
      var enquiry = details.enquiry.trim();
      if (fname == "" || lname == "" || email == "" || enquiry == "") {
        toast({
          variant: "destructive",
          description: "Please fill in all the details.",
        });
        return;
      }
      // debugger;
      await sendEmailServerHandler({
        email: email,
        fname: fname,
        lname: lname,
        query: enquiry,
      })
        .then((response) => {
          if (response?.success) {
            toast({
              description: response?.message,
              variant: "default",
            });
          } else {
            toast({
              description: response?.message,
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.log("error : ", error);
        });
    } catch (err) {
      console.log("error : ", err);
    } finally {
      setIsDisabled(false);
      setDetails({
        ...details,
        enquiry: "",
      });
    }
  };
  useEffect(() => {
    getUserAndSetDetails();
  }, []);
  return (
    <MaxWidthWrapper className="flex justify-center items-center h-[100vh]">
      <div className="w-full max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl text-white mb-6 text-center">Contact Us</h2>
        <Input
          type="text"
          name="fname"
          placeholder="First Name"
          className="mb-4 p-2 rounded-md bg-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={details.fname}
          onChange={(e) => setDetails({ ...details, fname: e.target.value })}
        />
        <Input
          type="text"
          name="lname"
          placeholder="Last Name"
          className="mb-4 p-2 rounded-md bg-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={details.lname}
          onChange={(e) => setDetails({ ...details, lname: e.target.value })}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-4 p-2 rounded-md bg-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={details.email}
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
        />
        <Textarea
          name="enquiry"
          placeholder="Your enquiry..."
          className="mb-4 p-2 rounded-md bg-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          value={details.enquiry}
          onChange={(e) => setDetails({ ...details, enquiry: e.target.value })}
        />
        <Button
          disabled={isDisabled}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md transition duration-200 flex gap-2"
          onClick={sendEmail}
        >
          {isDisabled == true ? (
            <Loader2 className="h-6 w-6 animate-spin text-zinc-700" />
          ) : (
            ""
          )}
          Send Message
        </Button>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
