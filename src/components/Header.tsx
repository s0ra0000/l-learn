"use client";
import { useState, useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import AddWordDialog from "./AddWordDialog";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateString, setDateString] = useState("");
  const [dayString, setDayString] = useState("");

  // Get the user's data from Kinde
  const { user } = useKindeBrowserClient();

  useEffect(() => {
    const updateDateAndDay = () => {
      const today = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      setDateString(today.toLocaleDateString(undefined, options));
      setDayString(today.toLocaleDateString(undefined, { weekday: "long" }));
    };

    updateDateAndDay();
  }, []);

  const openDialog = () => {
    setIsDialogOpen(true); // This should open the dialog
  };

  const closeDialog = () => {
    setIsDialogOpen(false); // This will close the dialog
  };

  const handleDialogSubmit = (data: {
    word: string;
    definition: string;
    translation: string;
  }) => {
    console.log("Data received from dialog:", data);
  };

  return (
    <>
      <header className="flex items-center justify-between px-[30px] py-4 w-full bg-white z-20">
        <div className="flex gap-4 ">
          <p className="hidden md:block">{dateString}</p>
          <p className="ml-8 md:ml-0">{dayString}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={openDialog}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Create word
          </button>
          <div className="flex gap-2 items-center">
            <div className="relative w-[30px] h-[30px]">
              <Image
                src={user?.picture || ""}
                alt={`${user?.given_name} ${user?.family_name}`}
                fill
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <Link href="/dashboard/profile" className="hidden md:block">
              {user ? `${user.given_name} ${user.family_name}` : ""}
            </Link>
          </div>
        </div>
      </header>
      <AddWordDialog
        title="Create New Word"
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSubmit={handleDialogSubmit}
      />
    </>
  );
};

export default Header;
