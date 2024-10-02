import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const routes = [
  {
    title: "Contact Us",
    href: "/contact-us",
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    title: "Terms and Condition",
    href: "/terms-and-condition",
  },
];
const Footer = () => {
  return (
    <div className=" flex flex-col sm:flex-row w-full justify-between px-4 items-center py-2  border-t border-gray-200   transition-all gap-5">
      <div className="flex flex-col gap-2 items-center">
        <div>
          <Logo />
        </div>
        <div className="flex gap-2 font-semibold">
          &copy; 2024, All rights reserved
        </div>
      </div>
      <div className="flex flex-col sm:flex-row">
        {routes?.map((route, key) => {
          return (
            <Link
              key={key}
              className={cn(
                buttonVariants({
                  variant: "link",
                })
              )}
              href={route.href}
            >
              {route?.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
