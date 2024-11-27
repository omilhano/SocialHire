import React, { useRef, useEffect } from "react";

export default function Paypal({ visible }) {
    const paypal = useRef();

    useEffect(() => {
        if (visible) {
            window.paypal
                .Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    description: "Cool looking table",
                                    amount: {
                                        currency_code: "EUR",
                                        value: 650.0,
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
    }, [visible]);

    if (!visible) return null; // Prevent PayPal rendering when not visible

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    );
}
