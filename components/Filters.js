import { child, get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { Checkbox, useCheckboxState } from "pretty-checkbox-react";
import "@djthoms/pretty-checkbox";

const Filter = ({ filter, changeProducts }) => {
  const key = Object.keys(filter);
  const arr = Object.values(filter)[0];
  const checkbox = useCheckboxState([]);

  const onValue = (e, value) => {
    let valueSelected = null;
    if (e.target.checked) {
      valueSelected = [...(checkbox.state || []), value];
      changeProducts(valueSelected);
    } else {
      valueSelected = checkbox.state.filter((item) => item != value);
    }
    checkbox.setState(valueSelected);
    changeProducts(valueSelected);
  };

  return (
    <div className="mt-5">
      <h2 className="text-xl capitalize mb-3">{key}</h2>
      {arr.map((item, index) => (
        <div className="text-lg" key={index}>
          <Checkbox
            name={key}
            color="info-o"
            animation="pulse"
            onChange={(e) => onValue(e, item)}
          >
            {item}
          </Checkbox>
        </div>
      ))}
    </div>
  );
};
const Filters = ({ changeProducts }) => {
  const [filters, setFilters] = useState(null);
  useEffect(() => {
    get(child(ref(database), `filter`))
      .then((snapshot) => {
        setFilters(snapshot.val());
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="p-5 ml-10 min-w-[250px]">
      <h2 className="text-2xl">Filters</h2>
      {filters?.map((filter, index) => (
        <Filter key={index} filter={filter} changeProducts={changeProducts} />
      ))}
    </div>
  );
};

export default Filters;
