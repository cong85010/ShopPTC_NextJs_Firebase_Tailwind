import React, { createContext, useContext, useEffect, useState } from "react";
import Select from "react-select";
import Breadcum from "../components/Breadcum";
import {
  applyDiscount,
  getCarts,
  getPrice,
  getProduct,
  updateCart,
} from "../util/DB";
import { Store } from "./_app";
import { FaTimes } from "react-icons/fa";
import { child, ref, set } from "firebase/database";
import { database } from "../firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const options = () => {
  let arr = [];
  for (let i = 1; i <= 100; i++) {
    arr.push({ value: i, label: i });
  }
  return arr;
};
const StoreCart = createContext(null);
const SubSubCart = ({ id, brand, amount, name, imageURL, sizePro }) => {
  const { user, SignInUser } = useContext(Store);
  const { handleRemoveItem } = useContext(StoreCart);
  const router = useRouter();
  const updateQuantity = (nameSize, valueSize) => {
    const accountList = ref(database, `account/${user.userId}`);
    child(accountList, user?.userId);
    const productIndex = user.carts?.findIndex((cart) => cart?.productId == id);
    const product = user.carts[productIndex];
    const productSize = product?.size || [];
    const indexSize = productSize.findIndex(
      (subSize) => subSize.name === nameSize
    );
    const size = productSize[indexSize];
    productSize[indexSize] = { ...size, quantity: valueSize };
    user.carts[productIndex] = { ...product, size: productSize };
    const updateUser = { ...user, countUpdate: user?.countUpdate + 1 || 1 };
    set(accountList, updateUser);
    SignInUser(updateUser);
    toast.success("Cập nhật thành công");
    // updateUser = {
    //   ...user,
    //   carts: (user?.carts || []).concat([
    //     { productId: id, size: [{ name: valueSize, quantity: 1 }] },
    //   ]),
    // };
  };
  const onRemoveItem = () => {
    if (confirm("Are you sure you")) {
      handleRemoveItem(id, sizePro?.name);
    }
  };
  return (
    <div
      className="flex flex-row border-2 relative w-[500px] mt-5"
      onClick={() => router.push(`/collections/${id}`)}
    >
      <span
        onClick={onRemoveItem}
        className="absolute top-3 right-3 cursor-pointer hover:text-red-600 p-2"
      >
        <FaTimes />
      </span>
      <div className="h-full max-w-[150px] overflow-hidden flex items-start">
        <img width="100%" height="100%" src={imageURL} alt="hinh anh" />
      </div>
      <div className="ml-5 p-4 pb-0">
        <h4 className="text-md font-medium">{brand}</h4>
        <p className="mt-3 text-neutral-400 text-md h-10">{name}</p>
        <div className="flex items-center">
          <p className="text-md font-medium mt-3 rounded-md bg-slate-300 p-2">
            Size: {sizePro?.name}
          </p>
          <div className="flex ml-3 mt-3">
            {sizePro && (
              <Select
                className="w-40"
                options={options()}
                defaultValue={{
                  value: sizePro?.quantity,
                  label: "Quantity: " + sizePro?.quantity,
                }}
                onChange={(e) => updateQuantity(sizePro.name, e.value)}
              />
            )}
          </div>
        </div>
        <p className="text-md font-medium mt-3">
          {sizePro?.quantity} x {amount}$
        </p>
      </div>
    </div>
  );
};
const SubCart = ({ productId, sizePro }) => {
  const [product, setProduct] = useState(null);
  useEffect(() => {
    getProduct(productId).then((value) => setProduct({ ...value, sizePro }));
  }, [sizePro?.quantity]);
  return <SubSubCart {...product} />;
};
const Carts = ({ carts }) => {
  return (
    <div>
      <h2 className="text-xl font-medium mt-3 mb-3">Carts:({carts?.length})</h2>
      {carts?.map((cart) =>
        cart.size?.map((size) => <SubCart {...cart} sizePro={size} />)
      )}
    </div>
  );
};
const Payment = ({ carts, countUpdate }) => {
  const [priceAll, setPriceAll] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [priceDiscount, setPriceDiscount] = useState(0);
  useEffect(() => {
    getPrice(carts)?.then((value) => setPriceAll(value));
  }, [carts, countUpdate]);
  const handleDiscount = (e) => {
    e.preventDefault();
    if (e.target[0].value.length == 6) {
      //check du tien khong
      applyDiscount(e.target[0].value, priceAll)?.then((voucher) => {
        if (voucher.status == 200) {
          setDiscount(voucher.data);
          setPriceDiscount(
            (priceAll * Number.parseFloat(voucher.data?.price)) / 100
          );
          toast.success("Áp dụng thành công", { position: "top-center" });
        } else {
          toast.error(voucher.message, { position: "top-center" });
          setDiscount({ price: 0 });
          setPriceDiscount(0);
        }
      });
    } else {
      toast.error("Mã chứa 6 kí tự", { position: "top-center" });
    }
  };
  return (
    <div className="ml-10 w-80">
      <h2 className="text-xl font-medium mt-3 mb-3">Price details</h2>
      <div className="flex justify-between text-xl mt-3">
        <span className="text-xl">Price</span>
        <span>{priceAll}$</span>
      </div>
      <div className="flex  items-center  text-xl mt-3">
        <span>Discount</span>
        <div className="w-full">
          <form onSubmit={handleDiscount} className="flex justify-between">
            <input
              type="text"
              placeholder="XXXXX"
              className="border-2  p-1 outline-none w-full ml-3 mr-3"
            />
            <button className="border-2 rounded-md p-1 bg-blue-400 text-white">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="flex justify-end text-xl mt-3">
        <span className="text-red-600 min-w-[100px]  text-right">
          {discount.price}
        </span>
        <span className=" min-w-[100px] text-right">- {priceDiscount}$</span>
      </div>
      <div className="flex justify-between text-xl mt-3">
        <span>Shipping</span>
        <span>Free</span>
      </div>
      <hr className="mt-3 bg- h-[2px]" />
      <div className="flex justify-between text-xl mt-3">
        <span className="font-medium">Total Amount</span>
        <span className="font-bold">{priceAll - priceDiscount}$</span>
      </div>
    </div>
  );
};
const Cart = () => {
  const { user, SignInUser } = useContext(Store);
  const [carts, setCarts] = useState([]);
  useEffect(() => {
    getCarts(user).then((value) => setCarts(value));
  }, [user?.countUpdate]);
  const handleRemoveItem = (idProduct, sizeName) => {
    const proIndex = carts.findIndex((pro) => pro.productId == idProduct);
    const pro = carts[proIndex];
    if (pro.size.length == 1) {
      carts.splice(proIndex, 1);
      updateCart(user, carts);
      SignInUser({ ...user, carts: carts });
      toast.success("Cập nhật thành công");
    } else {
      const indexRemove = pro.size.findIndex((size) => size.name == sizeName);
      pro.size.splice(indexRemove, 1);
      carts[proIndex] = pro;
      updateCart(user, carts);
      SignInUser({ ...user, carts: carts });
      toast.success("Cập nhật thành công");
    }
  };
  return (
    <div>
      <Breadcum />
      <StoreCart.Provider value={{ handleRemoveItem }}>
        <div className="flex flex-wrap justify-center">
          <Carts carts={carts} />
          <Payment carts={carts} countUpdate={user?.countUpdate} />
        </div>
      </StoreCart.Provider>
    </div>
  );
};

export default Cart;
