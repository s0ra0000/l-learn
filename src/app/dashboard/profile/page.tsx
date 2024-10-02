"use client";
import { useState, useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";

const Profile = () => {
  const { user } = useKindeBrowserClient();

  const [firstName, setFirstName] = useState(user?.given_name || "");
  const [lastName, setLastName] = useState(user?.family_name || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user) {
      setFirstName(user.given_name || "");
      setLastName(user.family_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  return (
    <section className="flex w-full p-[30px] items-center z-20 justify-center w-full min-h-screen">
      <div className="bg-white rounded-lg flex flex-col items-center justify-center py-8 w-full md:w-[400px] px-8">
        <div className="bg-background w-[100px] h-[100px] rounded-full relative">
          <Image
            src={user?.picture || "/profile.jpg"}
            alt={user?.given_name || "Profile Picture"}
            fill
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <form className="flex flex-col items-center justify-center w-full mt-6">
          <div className="w-full mb-4">
            <label className="block mb-1">Firstname:</label>
            <input
              type="text"
              className="w-full rounded border border-background bg-slate-100 px-4 py-2 round"
              value={firstName}
              readOnly
            />
          </div>
          <div className="w-full mb-4">
            <label className="block mb-1">Lastname:</label>
            <input
              type="text"
              className="w-full rounded border border-background bg-slate-100 px-4 py-2 round"
              value={lastName}
              readOnly
            />
          </div>
          <div className="w-full mb-8">
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              className="w-full rounded border border-background bg-slate-100 px-4 py-2 round"
              value={email}
              readOnly
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
