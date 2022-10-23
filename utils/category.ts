import { CategoryModel } from "../models/category.model";

export function removeCategoryFromList(
  categories: CategoryModel[],
  name: string
): CategoryModel[] {
  return categories.filter((cat) => cat.name != name);
}
