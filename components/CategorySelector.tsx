import React from 'react';
import styles from '../styles/CategorySelector.module.scss'
import {Avatar} from "@chakra-ui/react";
import {CategoryModel} from "../models/category.model";
import {BiChevronDown} from "react-icons/bi";
import {useSelector} from "react-redux";
import {selectCategoriesState} from "../store/slices/categories.slice";

declare type CategoryType = 'expense' | 'income';

export default function CategorySelector({value, type, onChange}: {type: CategoryType, value?: CategoryModel, onChange: (e: CategoryModel) => void}) {
    const [categoryList, setCategoryList] = React.useState<CategoryModel[]>([]);
    const [selectedCategory, setSelectedCategory] = React.useState<CategoryModel>();
    const [isDropOpen, setIsDropOpen] = React.useState(false);
    const categoriesState = useSelector(selectCategoriesState);

    const loadDefaultCategories = React.useCallback(() => {
        switch (type) {
            case "expense":
            default:
                setCategoryList(categoriesState.expenses);
                break;
            case "income":
                setCategoryList(categoriesState.income);
                break;
        }
    }, [categoriesState.expenses, categoriesState.income, type])

    React.useEffect(() => {
        if (value) {
            setSelectedCategory(value)
        }
        loadDefaultCategories();
    }, [loadDefaultCategories, value]);

    const getCategories = () => {
        switch (type) {
            case "expense":
            default:
                return categoriesState.expenses
            case "income":
                return categoriesState.income
        }
    }

    const showDropDown = (e) => {
        e.stopPropagation();
        setIsDropOpen(true);
    }

    const hideDropDown = () => {
        setIsDropOpen(false);
    }

    const onSearch = (e) => {
        const val = e.target.value;
        if (!val) {
            loadDefaultCategories();
            return;
        }

        const regex = new RegExp(val, 'i');
        const results = getCategories().filter(category => category?.name.match(regex));
        if (results.length > 0) {
        setCategoryList(results);
        } else {
            const other = getCategories().find(category => category.name.toLowerCase() === 'other');
            if (other) {
                setCategoryList([other]);
            } else {
                setCategoryList([]);
            }
        }
    }

    const onSelectCategory = (category) => {
        setSelectedCategory(category);
        hideDropDown();
        if (onChange) {
            onChange(category);
        }
        // reset search results
        loadDefaultCategories();
    }

    return (
        <div className={styles.categorySelectorContainer}>
            <p className={styles.categoryLabel}>Category</p>
            <div className={styles.categorySelectorControl}>
                {!isDropOpen && <div className={styles.valueContainer} onClick={showDropDown}>
                    {selectedCategory && <div className={styles.valueContainerValue}>
                        <div className="flex">
                            <Avatar size="xs" name={selectedCategory?.name} src={selectedCategory?.icon} />
                            <p className={styles.categoryListName}>{selectedCategory?.name}</p>
                        </div>
                        <BiChevronDown />
                    </div>}
                    {!selectedCategory && <div className={styles.valuePlaceholder}>
                        <p className={styles.valuePlaceholderText}>Select category</p>
                        <BiChevronDown />
                    </div>
                    }
                </div>}
                {isDropOpen && <input className={styles.categorySearch} autoFocus={true} type="text" onChange={onSearch} placeholder="Search Category" />}
                <div className={`${styles.dropdownContainerWrapper} ${isDropOpen ? styles.dropdownWrapperActive: ''}`}>
                    <ul className={styles.categoryList}>
                        {
                            categoryList.map((category, index)=> {
                                return (
                                    <li onClick={() => onSelectCategory(category)} key={index}>
                                        <Avatar size="sm" name={category?.name} src={category?.icon} />
                                        <p className={styles.categoryListName}>{category?.name}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            {isDropOpen && <div className={styles.categoryOverlay} onClick={hideDropDown}></div>}
        </div>
    );
}