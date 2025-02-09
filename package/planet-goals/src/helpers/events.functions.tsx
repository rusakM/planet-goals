import { Dispatch, ChangeEvent, MouseEvent, SetStateAction } from "react";

export type Ttarget = "_self" | "_blank" | "_parent" | "_top";

export function handleClick(url: string, target: Ttarget = "_self") {
    return (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        window.open(url, target);
    };
}

export function handleInputText(dispatch: Dispatch<SetStateAction<string>>) {
    return (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        dispatch(event.target.value);
    };
}
