import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { AppState, AppDispatch } from "app/store";

// We use these hooks throughout our app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
