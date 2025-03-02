import React from "react";
import { useMediaQuery } from "react-responsive";

type ChildrenT = {
    children: React.ReactElement;
};

enum BREAKPOINT {
    MOBILE_SMALL = 550,
    MOBILE = 767,
    TABLET_START = 768,
    TABLET_END = 1023,
    DESKTOP_START = 1024,
}

export const isIOS = () => {
    return /iPhone|iPod|iPad/.test(navigator.userAgent);
};

export function useMobile() {
    return useMediaQuery({ maxWidth: BREAKPOINT.MOBILE });
}

export function useTablet() {
    return useMediaQuery({
        minWidth: BREAKPOINT.TABLET_START,
        maxWidth: BREAKPOINT.TABLET_END,
    });
}

export function useDesktop() {
    return useMediaQuery({ minWidth: BREAKPOINT.DESKTOP_START });
}

export function useNotMobile() {
    return useMediaQuery({ minWidth: BREAKPOINT.TABLET_START });
}

export function useMobileSmall() {
    return useMediaQuery({ maxWidth: BREAKPOINT.MOBILE_SMALL });
}

export function useDeviceType() {
    const isDesktop = useDesktop();
    const isTablet = useTablet();
    const isMobile = useMobile();
    const isNotMobile = useNotMobile();
    const isMobileSmall = useMobileSmall();

    return {
        isDesktop,
        isTablet,
        isMobile,
        isNotMobile,
        isMobileSmall,
    };
}

export function MobileView({ children }: ChildrenT) {
    const isMobile = useMobile();
    return isMobile ? children : <></>;
}

export function TabletView({ children }: ChildrenT) {
    const isTablet = useTablet();
    return isTablet ? children : <></>;
}

export function DesktopView({ children }: ChildrenT) {
    const isDesktop = useDesktop();
    return isDesktop ? children : <></>;
}

export function NotMobileView({ children }: ChildrenT) {
    const isNotMobile = useNotMobile();
    return isNotMobile ? children : <></>;
}
