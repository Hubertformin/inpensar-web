import React from "react";
import { BudgetModel } from "../../models/budget.model";
import styles from "../../styles/BudgetTile.module.scss";
import { convertHexToRGBA } from "../../utils/colors";
import {RiErrorWarningFill} from "react-icons/ri";
import {calculateBudgetBalance, calculateBudgetExpenditurePercentage} from "../../utils/budget";
import useUtils from "../../hooks/useUtils";

interface BudgetTileProps {
  budget: BudgetModel;
  isSummary?: boolean;
  onClick?: (e: any) => void;
}

function getListTextOfCategories(categories: any[]) {
  const category_names = categories.map((cat) => cat.name);
  return category_names.join(", ");
}

export function BudgetTile({ budget, isSummary = false, onClick }: BudgetTileProps) {
  const utils = useUtils();
  const [expenditurePercent, setExpenditurePercent] = React.useState(0);
  const [isExceeded, setIsExceeded] = React.useState(false);
  React.useEffect(() => {
    setExpenditurePercent(calculateBudgetExpenditurePercentage(budget));
    setIsExceeded(budget.amountSpent > budget.amount);
  }, [budget])
  return (
    <div
      onClick={onClick}
      className={`${styles.tile} cursor-pointer pb-4 mb-8`}
    >
      <div className="header flex items-center mb-3 justify-between">
        <div className="flex items-center border rounded-full px-2 py-1 gap-2">
          <div
            className="circle h-4 w-4 rounded-full"
            style={{ backgroundColor: budget.color }}
          ></div>
          <h2 className="text-sm font-medium" style={{ color: budget.color, ...(isSummary && {fontSize: 12}) }}>
            {budget.name}
          </h2>
        </div>
        <div className="action">
          <h3 className="text-lg font-bold" style={{ color: budget.color, ...(isSummary && {fontSize: 14}) }}>
            {utils.formatCurrency(budget.amount)}
          </h3>
        </div>
      </div>
      {!isSummary && <div title={getListTextOfCategories(budget.categories)} className="categories text-slate-500 md:w-96 truncate pr-6">
        {getListTextOfCategories(budget.categories)}
      </div>}
      <div className={`${styles.containerStyles} mt-3 mb-4`} style={{...(isSummary && {height: 4})}}>
        <div
          style={{
            backgroundColor: convertHexToRGBA(budget.color, 1),
            width: `${expenditurePercent}%`
          }}
          className={`${styles.fillerStyles} ${
            expenditurePercent > 80 ? styles.fillerExceeded : ""
          }`}
        ></div>
        <p className={`${styles.warningLine}`}></p>
      </div>
      <div className="relative">
        <div className={`${styles.spentAmount}`} style={{...(isSummary && {fontSize: 12})}}>
          {utils.formatCurrency(budget.amountSpent)}
        </div>
        <div className={`${styles.balanceAmount}`}>
          {isExceeded ?
              (<p className="text-red-500 flex items-center gap-1">
                <RiErrorWarningFill />
                {isSummary ? <span>Exceeded</span> : <span>You have exceeded this budget</span>}
              </p>):
              <p>{utils.formatCurrency(calculateBudgetBalance(budget))}</p>
          }

        </div>
      </div>
    </div>
  );
}
