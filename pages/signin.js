import { child, get, ref } from "firebase/database";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { database } from "../firebase";
import { Store } from "./_app";

const SignIn = () => {
  const router = useRouter();
  const { url } = router.query;
  const [account, setAccount] = useState();
  const { SignInUser } = useContext(Store);
  //get account cuoi
  const CheckLogin = () => {
    get(child(ref(database), `account`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const arrAccounts = Object.values(snapshot.val());
          const user = arrAccounts.find(
            (pro) =>
              pro.username == account?.username &&
              pro.password == account?.password
          );
          console.log(user);
          if (user) {
            SignInUser(user);
            toast.success("Đăng nhập thành công");
            if (url) {
              router.push(url);
            } else {
              router.push("/");
            }
          } else {
            toast.error("Sai tài khoản hoặc mật khẩu");
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-full-remove-nav">
      <div className="min-w-[500px] border-2 p-10">
        <h2 className="text-center text-2xl font-bold">Sign In now !!!</h2>
        <div className="flex flex-col mt-5">
          <input
            type="text"
            placeholder="username"
            className="p-3 border-2 border-gray-300"
            onChange={(e) =>
              setAccount({ ...account, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="password"
            className="p-3 border-2 border-gray-300 mt-5"
            onChange={(e) =>
              setAccount({ ...account, password: e.target.value })
            }
          />
          <button
            onClick={CheckLogin}
            className="p-3 pl-5 pr-5 mt-5 text-xl rounded-md border-2 border-cyan-500 hover:shadow-cyan-500/50"
          >
            Sign In
          </button>
          <div className="text-center font-bold">Or</div>
          <Link href={`/register${url ? "/?url=" + url : ""}`}>
            <button className="p-3 pl-5 pr-5 mt-5 text-xl rounded-md border-2 border-orange-700 hover:shadow-cyan-500/50">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
