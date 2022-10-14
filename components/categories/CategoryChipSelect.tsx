import React from "react";
import { useCombobox } from "downshift";
import { Data } from "../../data";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Avatar } from "@chakra-ui/react";
import styles from "../../styles/CategoryChipSelect.module.scss";

function getItemsFilter(inputValue) {
  return function booksFilter(category) {
    return (
      !inputValue || category.name.toLowerCase().includes(inputValue)
      // || category.author.toLowerCase().includes(inputValue)
    );
  };
}

export default function CategoryChipShiftSelect() {
  const [items, setItems] = React.useState(Data.expense_categories);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setItems(Data.expense_categories.filter(getItemsFilter(inputValue)));
    },
    items,
    itemToString(item) {
      return item ? item.name : "";
    },
  });

  return (
    <div>
      <div className={styles.selectContainer}>
        {/* <label className="w-fit" {...getLabelProps()}>
          Choose categories
        </label> */}
        <div
          className={`flex shadow-sm bg-white gap-0.5 ${styles.formContainer}`}
          {...getComboboxProps()}
        >
          <input
            placeholder="Search category.."
            className={styles.formInput}
            {...getInputProps()}
          />
          <button
            aria-label="toggle menu"
            className="px-2"
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
      </div>
      <ul {...getMenuProps()} className={styles.dropdownContainer}>
        {isOpen &&
          items.map((item, index) => (
            <li
              className={cx(
                highlightedIndex === index && styles.selectOptions__highlighted,
                selectedItem === item && styles.selectOptions__selected,
                `py-2 px-3 border-b ${styles.selectOptions}`
              )}
              key={`${item.name}${index}`}
              {...getItemProps({ item, index })}
            >
              <div className="leading flex">
                <Avatar
                  size="sm"
                  src={item.icon}
                  name={item.name}
                  bg="orange.500"
                  color="white"
                />
                <div className="text ml-2">
                  <h2 className="text-lg">{item.name}</h2>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
function cx(arg0: string, arg1: string, arg2: string): string {
  return `${arg0} ${arg1} ${arg2}`;
}
