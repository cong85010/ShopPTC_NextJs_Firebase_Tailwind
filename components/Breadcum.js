import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
const Breadcum = ({ hasEndLink = null }) => {
  //arr = ["collection, index"]
  const router = useRouter();

  const arrLink = router.pathname.split("/").slice(1);
  let endLink = arrLink.pop();
  if (hasEndLink) {
    endLink = hasEndLink;
  }
  return (
    <div className="bg-gray-100 p-3 text-center capitalize">
      <Link href="/">Home</Link> /
      {arrLink.map((link) => (
        <>
          {" "}
          <Link href={`\\${link}`}>{link}</Link> /
        </>
      ))}
      <span className="text-zinc-500 ml-1 capitalize">{endLink}</span>
    </div>
  );
};

export default Breadcum;
