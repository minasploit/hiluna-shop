import router from "next/router";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { type CartItem } from "~/pages/cart";
import { api } from "~/utils/api";

const HeaderCartButton = () => {

    const [hasMounted, setHasMounted] = useState(false);

    const [cartItemIds] = useLocalStorage<CartItem[]>("cartitems", []);
    const cartItems = api.artwork.getMany.useQuery(cartItemIds.map(c => c.id), { enabled: cartItemIds != undefined });

    useEffect(() => {
        console.log(cartItemIds);
    }, [cartItemIds]);

    useEffect(() => {
        setHasMounted(true)
    }, []);

    if (!hasMounted)
        return null

    return <>
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="badge badge-sm indicator-item">{cartItemIds.length}</span>
                </div>
            </label>
            <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                <div className="card-body">
                    <span className="font-bold text-lg">{cartItemIds.length} Items</span>
                    <span className="text-primary">Subtotal: {' '}
                        <span className="font-bold __next-auth-theme-light">{cartItems.data?.map(c => c.price).length ? cartItems.data?.map(c => c.price).reduce((a, b) => a + b) : 0} ETB</span>
                    </span>
                    <div className="card-actions">
                        <button className="btn btn-primary btn-block mt-1" onClick={() => router.push("/cart")}>View cart</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default HeaderCartButton