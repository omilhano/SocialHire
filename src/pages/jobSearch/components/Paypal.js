import React, { useRef, useEffect } from "react";

export default function Paypal({ totalr }) {
    const paypal = useRef();

    useEffect(() => {
        // Ensure the PayPal button is not rendered twice
        if (paypal.current && window.paypal) {
            window.paypal
                .Buttons({
                    createOrder: (data, actions, err) => {
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    description: "Testing Practice", // You can customize the description
                                    amount: {
                                        currency_code: "EUR",
                                        value: totalr, // Using the totalvalue from the CreatingJobModal
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {
                        const order = await actions.order.capture();
                        console.log(order);
                    },
                    onError: (err) => {
                        console.log(err);
                    },
                })
                .render(paypal.current);
        }
    }, [totalr]); // Re-render PayPal button when totalr changes

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    );
}