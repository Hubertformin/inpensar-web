import { Avatar, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { useCombobox, useMultipleSelection } from "downshift";
import React from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "../../styles/CategoryChipSelect.module.scss";
import { convertHexToRGBA } from "../../utils/colors";

interface CategoryChipMultiSelectProps {
  onChange?: (items: any[]) => void;
  selectedOptions?: any[];
  options: any[];
  label?: string;
  optionProps: {
    icon: string;
    label: string;
  };
}

function CategoryChipMultiSelect({
  selectedOptions = [],
  ...props
}: CategoryChipMultiSelectProps) {
  const [inputValue, setInputValue] = React.useState("");

  function getFilteredOptions(selectedItems, inputValue) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return props.options.filter((propOption) => {
      return (
        !selectedItems.includes(propOption) &&
        propOption[props.optionProps.label]
          .toLowerCase()
          .includes(lowerCasedInputValue)
        // || category.author.toLowerCase().includes(lowerCasedInputValue))
      );
    });
  }

  const [selectedItems, setSelectedItems] = React.useState(selectedOptions);
  const items = React.useMemo(
    () => getFilteredOptions(selectedItems, inputValue),
    [selectedItems, inputValue]
  );
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
  } = useMultipleSelection({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          setSelectedItems(newSelectedItems);
          if (props.onChange) {
            props.onChange(newSelectedItems);
          }
          break;
        default:
          break;
      }
    },
  });
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
    items,
    itemToString(item) {
      return item ? item[props.optionProps.label] : "";
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && { isOpen: true, highlightedIndex: 0 }),
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          setSelectedItems([...selectedItems, newSelectedItem]);
          if (props.onChange) {
            props.onChange([...selectedItems, newSelectedItem]);
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue);

          break;
        default:
          break;
      }
    },
  });

  return (
    <div className="w-full relative">
      <div className="flex flex-col gap-1">
        {props.label && (
          <label className="w-fit" {...getLabelProps()}>
            {props.label}
          </label>
        )}
        <div className="shadow-sm bg-white inline-flex gap-2 items-center flex-wrap p-1.5">
          <div
            className={`${styles.formContainer} mb-3`}
            {...getComboboxProps()}
          >
            <input
              placeholder="Search categories.."
              className={styles.formInput}
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
            <button
              aria-label="toggle menu"
              className="px-4"
              type="button"
              {...getToggleButtonProps()}
            >
              <FiChevronDown />
            </button>
          </div>
          {selectedItems.map(function renderSelectedItem(
            selectedItemForRender,
            index
          ) {
            return (
              <Tag
                size="lg"
                // colorScheme={getRandomItemFromList([
                //   "orange",
                //   "red",
                //   "black",
                //   "blue",
                //   "green",
                //   "purple",
                // ])}
                bg={convertHexToRGBA(selectedItemForRender["color"], 0.1)}
                color={selectedItemForRender["color"]}
                borderRadius="full"
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index,
                })}
              >
                <Avatar
                  src={selectedItemForRender[props.optionProps.icon]}
                  size="xs"
                  name={selectedItemForRender[props.optionProps.label]}
                  ml={-1}
                  mr={2}
                />
                <TagLabel>
                  {selectedItemForRender[props.optionProps.label]}
                </TagLabel>
                <TagCloseButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedItem(selectedItemForRender);
                  }}
                />
              </Tag>
            );
          })}
        </div>
      </div>
      <ul
        {...getMenuProps()}
        className={`absolute p-0 bg-white shadow-md overflow-scroll px-1 w-full ${styles.dropContainer}`}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={cx(
                highlightedIndex === index && styles.selectOptions__highlighted,
                selectedItem === item && styles.selectOptions__selected,
                `py-3 px-3 ${styles.selectOptions}`
              )}
              key={`${item.name}${index}`}
              {...getItemProps({ item, index })}
            >
              <div className="leading flex">
                <Avatar
                  size="sm"
                  src={item[props.optionProps.icon]}
                  name={item[props.optionProps.label]}
                  bg="orange.500"
                  color="white"
                />
                <div className="text ml-2">
                  <h2 className="text-lg">{item[props.optionProps.label]}</h2>
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

export default CategoryChipMultiSelect;
