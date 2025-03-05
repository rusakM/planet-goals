import { Dispatch, ChangeEvent, MouseEvent, SetStateAction } from "react";
import { v4 as uuid } from "uuid";

export type Ttarget = "_self" | "_blank" | "_parent" | "_top";

export function redirect(url: string, target: Ttarget = "_self") {
    return (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        window.open(url, target);
    };
}

export function generateRandomId(length?: number): string {
    const id = uuid();
    if (length < 20) return id.substring(0, length);
    return id;
}

export function handleInputText(dispatch: Dispatch<SetStateAction<string>>, cb: () => void = void 0) {
    return (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        dispatch(event.target.value);
        cb();
    };
}
