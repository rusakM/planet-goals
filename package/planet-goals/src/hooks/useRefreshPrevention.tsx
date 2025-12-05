import { useEffect, useRef } from 'react';

export default function useRefreshPrevention() {
		const lastTouchY = useRef<number>(0);

	useEffect(() => {
		// Funkcja sprawdzająca czy element jest scrollowalny
		const isScrollable = (element: Element | null): boolean => {
			if (!element || element === document.body || element === document.documentElement) {
				return false;
			}

			const style = window.getComputedStyle(element);
			const overflowY = style.overflowY;
			const isOverflowing = element.scrollHeight > element.clientHeight;

			return (overflowY === 'auto' || overflowY === 'scroll') && isOverflowing;
		};

		// Funkcja znajdująca najbliższy scrollowalny element
		const findScrollableParent = (element: Element | null): Element | null => {
			let current = element;
			while (current && current !== document.body) {
				if (isScrollable(current)) {
					return current;
				}
				current = current.parentElement;
			}
			return null;
		};

		const handleTouchStart = (e: TouchEvent) => {
			lastTouchY.current = e.touches[0].clientY;
		};

		const handleTouchMove = (e: TouchEvent) => {
			const touch = e.touches[0];
			const currentY = touch.clientY;
			const deltaY = currentY - lastTouchY.current;

			// Znajdź scrollowalny kontener
			const target = e.target as Element;
			const scrollableParent = findScrollableParent(target);

			// Jeśli dotykamy scrollowalnego elementu, sprawdź jego granice
			if (scrollableParent) {
				const scrollTop = scrollableParent.scrollTop;
				const scrollHeight = scrollableParent.scrollHeight;
				const clientHeight = scrollableParent.clientHeight;

				const isAtTop = scrollTop <= 0;
				const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

				// Blokuj tylko overscroll w scrollowalnym kontenerze
				if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
					e.preventDefault();
				}

				lastTouchY.current = currentY;
				return;
			}

			// Jeśli nie ma scrollowalnego rodzica, sprawdź scrollowanie głównego okna
			const windowScrollTop = window.scrollY || document.documentElement.scrollTop;
			const windowScrollHeight = document.documentElement.scrollHeight;
			const windowClientHeight = document.documentElement.clientHeight;

			const isAtTop = windowScrollTop <= 0;
			const isAtBottom = windowScrollTop + windowClientHeight >= windowScrollHeight - 1;

			// Blokuj pull-to-refresh tylko na samej górze
			if (isAtTop && deltaY > 0) {
				e.preventDefault();
			}
			// Blokuj bottom bounce tylko na samym dole
			else if (isAtBottom && deltaY < 0) {
				e.preventDefault();
			}

			lastTouchY.current = currentY;
		};

		const handleTouchEnd = () => {
			lastTouchY.current = 0;
		};

		document.addEventListener('touchstart', handleTouchStart, { passive: false });
		document.addEventListener('touchmove', handleTouchMove, { passive: false });
		document.addEventListener('touchend', handleTouchEnd, { passive: true });

		return () => {
			document.removeEventListener('touchstart', handleTouchStart);
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleTouchEnd);
		};
	}, []);
}