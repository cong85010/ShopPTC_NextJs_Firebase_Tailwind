import { child, get, ref, set } from "firebase/database";
import { database } from "../firebase";

export const getCarts = async (account) => {
  const value = await get(child(ref(database), `account`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const arrAccounts = Object.values(snapshot.val());
        const user = arrAccounts.find(
          (pro) =>
            pro.username == account?.username &&
            pro.password == account?.password
        );
        if (user) {
          return user.carts;
        }
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
    });
  return value;
};

export const applyDiscount = async (voucher, priceNow) => {
  const value = await get(child(ref(database), `voucher`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const arrVouchers = Object.values(snapshot.val());
        const voucherDB = arrVouchers.find((vou) => vou.id == voucher);
        if (voucherDB) {
          if (priceNow < voucherDB.minPrice) {
            return {
              status: 400,
              message: "Chỉ áp dụng hoá đơn từ: " + voucherDB.minPrice + "$",
            };
          }
          return { status: 200, data: voucherDB };
        }
      }
      return { status: 400, message: "Không tìm thấy mã" };
    })
    .catch((error) => {
      console.error(error);
    });
  return value;
};
export const getPrice = (carts) => {
  if (carts?.length) {
    const payment = carts?.reduce(async (sum, cur) => {
      const pro = await getProduct(cur.productId);
      const { amount } = pro;
      const quantity = cur.size.reduce(
        (sumSize, sl) => sumSize + sl.quantity,
        0
      );
      if (sum == 0) {
        return amount * quantity;
      }
      const value = await sum.then((result) => result);
      return value + amount * quantity;
      // amountPro = amount * cur.size;
    }, 0);
    return payment;
  }
};

export const getProduct = async (idProduct) => {
  const value = await get(child(ref(database), `clothes`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const arrProducts = Object.values(snapshot.val());
        const product = arrProducts.find((pro) => pro.id == idProduct);
        if (product) {
          return product;
        }
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
    });
  return value;
};

export const updateCart = (user, carts) => {
  const accountList = ref(database, `account/${user.userId}`);
  child(accountList, user?.userId);
  const updateUser = { ...user, carts: carts };
  set(accountList, updateUser);
};
