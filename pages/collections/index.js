import React, { useEffect, useState } from "react";
import Link from "next/link";
import Filters from "../../components/Filters";
import Collections from "../../components/Collections";
import { child, get, limitToLast, query, ref } from "firebase/database";
import { database } from "../../firebase";
import Breadcum from "../../components/Breadcum";
import { useRouter } from "next/router";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [productsFilter, setProductFilter] = useState([]);
  useEffect(() => {
    get(query(child(ref(database), `clothes`), limitToLast(30)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setProducts(snapshot.val());
          setProductFilter(snapshot.val());
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleChangeProducts = (arrFilter) => {
    if (arrFilter.length === 0) {
      setProductFilter(products);
    } else {
      const arr = products.filter(
        (product) =>
          arrFilter.includes(product.brand) ||
          arrFilter.includes(product.category)
      );
      setProductFilter(arr);
    }
  };
  const sortProducts = (sort) => {
    let arrPrice = null;
    switch (sort) {
      case "low": {
        arrPrice = productsFilter.sort((a, b) => a.amount - b.amount);
        break;
      }
      case "high": {
        arrPrice = productsFilter.sort((a, b) => b.amount - a.amount);
        break;
      }
      default: {
        arrPrice = products;
      }
    }
    setProductFilter([...arrPrice]);
  };
  return (
    <div>
      <Breadcum />
      <div className="flex flex-row">
        <Filters changeProducts={handleChangeProducts} />
        <Collections {...{ productsFilter, sortProducts }} />
      </div>
    </div>
  );
};

export default Index;
