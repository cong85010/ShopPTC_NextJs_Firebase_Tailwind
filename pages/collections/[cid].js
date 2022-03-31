import React, { useContext, useEffect, useState } from "react";
import { child, get, ref, set } from "firebase/database";
import { database } from "../../firebase";
import Link from "next/link";
import { CheckSignIn } from "../signin";
import { Store, UpdateNewUser } from "../_app";
// import { RadioGroup, RadioButton } from "react-radio-buttons";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Breadcum from "../../components/Breadcum";

const RadioButton = ({ value, handleActiveSize, actived }) => {
  return (
    <div
      onClick={() => handleActiveSize(value)}
      className={`mr-3 border-2 border-neutral-300 rounded-full w-14 h-14 leading-[3.5rem] text-center 
    font-bold cursor-pointer hover:border-teal-400 ${
      actived == value && "!border-teal-400"
    }`}
    >
      {value}
    </div>
  );
};
const ProductDetail = ({ id, brand, amount, name, imageURL }) => {
  const [valueSize, setValueSize] = useState(null);
  const router = useRouter();
  const { user, SignInUser } = useContext(Store);

  const handleActiveSize = (size) => {
    setValueSize(size);
  };
  const SIZE = ["S", "M", "L", "XL"];
  const handleAddToCart = () => {
    if (valueSize == null) {
      toast.error("Vui lòng chọn size");
    } else if (user) {
      const accountList = ref(database, `account/${user.userId}`);
      child(accountList, user?.userId);
      const productIndex = user.carts?.findIndex(
        (cart) => cart?.productId == id
      );
      let updateUser = null;
      if (productIndex != undefined && productIndex != -1) {
        const product = user.carts[productIndex];
        const productSize = product?.size || [];
        const indexSize = productSize.findIndex(
          (subSize) => subSize.name === valueSize
        );
        if (indexSize != -1) {
          const size = productSize[indexSize];
          productSize[indexSize] = { ...size, quantity: size.quantity + 1 };
        } else {
          productSize = [...productSize, { name: valueSize, quantity: 1 }];
        }
        user.carts[productIndex] = { ...product, size: productSize };
        updateUser = { ...user };
        // updateUser = {
        //   ...user,
        //   carts: (user?.carts || []).concat([
        //     { productId: id, size: [{ name: valueSize, quantity: 1 }] },
        //   ]),
        // };
      } else {
        updateUser = {
          ...user,
          carts: (user?.carts || []).concat([
            { productId: id, size: [{ name: valueSize, quantity: 1 }] },
          ]),
        };
      }
      try {
        set(accountList, updateUser);
        SignInUser(updateUser);
        toast.success("Thêm thành công", { position: "top-center" });
      } catch (error) {
        toast.error("Thêm không thành công", { position: "top-center" });
      }
    } else {
      router.push(`/signin/?url=collections/${id}`);
    }
  };
  return (
    <div className="mt-10 flex justify-center items-center">
      <div className="flex flex-row ">
        <div className="min-h-[250px] max-w-[400px] overflow-hidden">
          <img
            width="100%"
            height="100%"
            src={imageURL}
            alt="hinh anh"
            className="hover:scale-105 transition"
          />
        </div>
        <div className="p-5">
          <h4 className="mt-10 text-2xl font-medium">{brand}</h4>
          <p className="mt-3 text-neutral-400 text-xl">{name}</p>
          <p className="text-2xl font-medium mt-3">Price: {amount}$</p>
          <p className="text-xl font-medium mt-3">Select Size</p>
          <div className="flex mt-5">
            {SIZE.map((item, index) => (
              <RadioButton
                key={index}
                value={item}
                handleActiveSize={handleActiveSize}
                actived={valueSize}
              />
            ))}
          </div>
          <div className="mt-5 ">
            {/* <button className="p-3 pl-5 pr-5 mr-5 text-xl rounded-md border-2 border-cyan-500 hover:shadow-cyan-500/50">
              Wishlist
            </button> */}
            <button
              onClick={handleAddToCart}
              className="p-3 pl-5 pr-5 bg-blue-600 text-white text-xl rounded-md shadow-lg shadow-blue-500/50 hover:bg-blue-800"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export const Cid = ({ cid }) => {
  const [productDetail, setProductDetail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    get(child(ref(database), `clothes`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const product = snapshot.val().find((pro) => pro.id === cid);
          setProductDetail(product);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <>
      <Breadcum hasEndLink={productDetail?.brand + " " + productDetail?.name} />
      <ProductDetail {...productDetail} />
    </>
  );
};

export const getServerSideProps = (context) => {
  const { cid } = context.params;
  return {
    props: {
      cid,
    },
  };
};
export default Cid;
