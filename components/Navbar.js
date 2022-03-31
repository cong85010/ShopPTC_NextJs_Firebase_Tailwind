import React, { useContext } from "react";
import { FaRegHeart, FaOpencart, FaRegUser } from "react-icons/fa";
import Link from "next/link";
import Select from "react-select";
import { useRouter } from "next/router";
const Navbar = ({ user, SignInUser }) => {
  const router = useRouter();
  const options = [
    { value: "profile", label: "Profile" },
    { value: "logOut", label: "Log out" },
  ];
  const hanleUser = (value) => {
    if (value == "profile") {
      router.push("/profile");
    } else {
      localStorage.removeItem("user");
      SignInUser(null);
      router.push("/signin");
    }
  };
  return (
    <div className="flex flex-row justify-between p-5 h-[100px]">
      <div
        className="flex flex-row items-center ml-5 cursor-pointer"
        data-tip="Go home"
      >
        <Link href="/">
          <img
            height="50"
            width="50"
            src="https://icon-library.com/images/icon-shop/icon-shop-3.jpg"
          />
        </Link>
        <Link href="/">
          <span className="ml-2 font-bold">SHOP PTC</span>
        </Link>
      </div>
      <div>
        <ul className="flex flex-row text-right mr-20 items-center h-full">
          <>
            {/* <li className="ml-10 text-2xl" data-tip="Liked">
              <FaRegHeart />
            </li> */}
            <li
              className="ml-10  text-2xl relative  hover:cursor-pointer"
              data-tip={`Cart (${(user?.carts && user?.carts.length) || 0})`}
            >
              <span className=" text-center w-5 h-5 bg-blue-500 text-white font-bold text-sm rounded-full absolute top-[-7px] right-[-12px]">
                {(user?.carts && user?.carts.length) || 0}
              </span>
              <Link href="/cart">
                <FaOpencart />
              </Link>
            </li>
          </>

          <li className="ml-10 text-2xl hover:cursor-pointer">
            {user ? (
              <Select
                styles={{ fontSize: 16 }}
                className="w-32 text-md"
                options={options}
                onChange={(e) => hanleUser(e.value)}
                value={{
                  label: (
                    <div className="text-md">
                      <FaRegUser />
                    </div>
                  ),
                }}
              />
            ) : (
              <Link href="/signin">
                <FaRegUser />
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
