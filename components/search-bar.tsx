"use client";

import { FaSearch } from "react-icons/fa";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

interface QueryProps {
  query?: string;
}

export default function SearchBar({ query }: QueryProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(query || "");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    router.replace(`/?query=${encodeURIComponent(searchTerm)}`);
  };

  const reset = () => {
    setSearchTerm("");
    router.replace("/");
  };

  return (
    <form className="w-full h-[60px] flex flex-row gap-x-2 px-2 justify-between items-center rounded-full border-4 border-black">
      <input
        name="query"
        defaultValue={query}
        placeholder="Search Tasks"
        className="block w-full p-2 rounded-full placeholder:text-black placeholder:font-semibold focus:outline-none"
      />
      <div className="flex gap-x-2 items-center">
        {query && (
          <Button onClick={reset} type="button" className="rounded-full">
            X
          </Button>
        )}
        <Button type="submit" className="rounded-full">
          <FaSearch className="bg-black text-white" />
        </Button>
      </div>
    </form>
  );
}
