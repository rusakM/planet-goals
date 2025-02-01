import { MouseEvent } from "react";

export type Ttarget = "_self" | "_blank" | "_parent" | "_top";

export function handleClick(url: string, target: Ttarget = "_self") {
    return (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        window.open(url, target);
    };
}
