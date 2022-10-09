import React from 'react';
import styles from '../../styles/CategorySelector.module.scss'
import {Avatar} from "@chakra-ui/react";
import {Data} from '../../data'
import {CategoryModel} from "../../models/category.model";
import {BiChevronDown} from "react-icons/bi";

declare type CategoryType = 'expense' | 'income';

export default function CategorySelector({type, onChange}: {type: CategoryType, onChange: (e: CategoryModel) => void}) {
    const [categoryList, setCategoryList] = React.useState<CategoryModel[]>([]);
    const [selectedCategory, setSelectedCategory] = React.useState<CategoryModel>();
    const [isDropOpen, setIsDropOpen] = React.useState(false);

    React.useEffect(() => {
        loadDefaultCategory();
    }, []);

    const loadDefaultCategory = () => {
        switch (type) {
            case "expense":
            default:
                setCategoryList(Data.expense_categories);
                break;
            case "income":
                setCategoryList(Data.income_categories);
                break;
        }
    }

    const showDropDown = (e) => {
        e.stopPropagation();
        setIsDropOpen(true);
    }

    const hideDropDown = () => {
        console.log('focus out')
        setIsDropOpen(false);
    }

    const onSearch = (e) => {
        const val = e.target.value;
        if (!val) {
            loadDefaultCategory();
            return;
        }

        const regex = new RegExp(val, 'i');
        const results = categoryList.filter(category => regex.test(category?.name));
        if (results.length > 0) {
        setCategoryList(results);
        } else {
            const other = categoryList.find(category => category.name.toLowerCase() === 'other');
            if (other) {
                setCategoryList([other]);
            }
        }
    }

    const onSelectCategory = (category) => {
        setSelectedCategory(category);
        hideDropDown();
        if (onChange) {
            onChange(category);
        }
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