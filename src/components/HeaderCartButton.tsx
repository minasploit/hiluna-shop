import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { type CartItem } from "~/components/Cart";

const HeaderCartButton = ({ setCartOpen }: { setCartOpen: Dispatch<SetStateAction<boolean>> }) => {

    const [hasMounted, setHasMounted] = useState(false);

    const [cartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);

    useEffect(() => {
        setHasMounted(true)
    }, []);

    if (!hasMounted)
        return null

    return <>
        <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle" onClick={() => setCartOpen(true)}>
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="badge badge-sm badge-primary indicator-item">{cartItemIds.length}</span>
                </div>
            </button>
        </div>
    </>
}

export default HeaderCartButton