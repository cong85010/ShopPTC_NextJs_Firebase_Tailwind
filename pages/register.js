import { child, set, ref, push, get } from "firebase/database";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { database } from "../firebase";
import { Store } from "./_app";
import Link from "next/link";

const Register = () => {
  const router = useRouter();
  const [account, setAccount] = useState();
  const { SignInUser } = useContext(Store);
  const { url } = router.query;

  const AddAccount = () => {
    try {
      const accountList = child(ref(database), `account`);
      get(accountList)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const arrAccounts = snapshot.val();
            console.log(arrAccounts);
            const boolRegister = arrAccounts.findIndex(
              ({ username }) => account.username === username
            );
            //sucess
            if (boolRegister == -1) {
              toast.success("Đăng ký thành công");
              const id = arrAccounts.length + "";
              const acc = ref(database, `account/` + id);
              const accountSign = { ...account, userId: id };
              set(acc, accountSign);
              SignInUser(accountSign);
              if (url) {
                router.push(url);
              } else {
                router.push("/");
              }
            } else {
              toast.error("Username đã được sử dụng");
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
      // accountList.map((account) => console.log(account));
      // child(accountList, "0");
      // set(accountList, account);
      // SignInUser(account);
      // toast.success("Đăng ký thành công");
      // if (url) {
      //   router.push(url);
      // } else {
      //   router.push("/");
      // }
    } catch (error) {
      console.error(error);
      toast.success("Đăng ký không thành công");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-full-remove-nav">
      <div className="min-w-[500px] border-2 p-10">
        <h2 className="text-center text-2xl font-bold">Register now !!!</h2>
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
            onClick={AddAccount}
            className="p-3 pl-5 pr-5 mt-5 text-xl rounded-md border-2 border-cyan-500 hover:shadow-cyan-500/50"
          >
            Register
          </button>
          <div className="text-center font-bold">Or</div>
          <Link href={`/signin${url ? "/?url=" + url : ""}`}>
            <button className="p-3 pl-5 pr-5 mt-5 text-xl rounded-md border-2 border-orange-700 hover:shadow-cyan-500/50">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
