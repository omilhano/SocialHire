import React, { useState } from "react";
import Paypal from "../components/Paypal";

const Checkout = () => {
    const [checkout, setCheckOut] = useState(false);

    return (
        <div className="checkout-page">
            {/* Only toggle visibility of the PayPal button */}
            <Paypal visible={checkout} />
            {!checkout && (
                <button
                    onClick={() => {
                        setCheckOut(true);
                    }}
                >
                    Checkout
                </button>
            )}
        </div>
    );
};

export default Checkout;
