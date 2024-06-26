import Modal from "./UI/Modal";
import {currencyFormatter} from "../util/formatter";
import Input from "./UI/Input";
import Button from "./UI/Button";
import classes from "./Checkout.module.css";
import { userProgressActions } from "../reduxStore/UserProgressSlice";
import useHttp from "../hooks/useHttp";
import DesignatedError from "./DesignatedError";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../reduxStore/CartSlice";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
};
export default function Checkout()
{
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const userProgressProgress = useSelector(state => state.userProgress.progress);
    const cartTotal = cartItems.reduce((prevSummary, item) => prevSummary + item.quantity * item.price, 0);

    const { data, isLoading, error, resetError, sendRequest, clearData } = useHttp('http://localhost:8080/orders', requestConfig);
    function handleClose() {
        dispatch(userProgressActions.hideCheckout());
        resetError(null);
    }

    function handleFinish()
    {
        dispatch(userProgressActions.hideCheckout());
        dispatch(cartActions.clearCart());
        clearData();
    }

    function handleSubmit(event) {
        event.preventDefault();

        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(JSON.stringify({
            order: {
                items: cartItems,
                customer: customerData
            }
        }));
    }

    if (data && !error) {
        return <Modal open={userProgressProgress === 'checkout' } onClose={handleFinish}>
            <h2>Success!</h2>
            <p>Your order was submitted successfully.</p>
            <p className='modal-actions'>
                <Button onClick={handleFinish}>Ok</Button>
            </p>
        </Modal>
    }

    return <Modal open={userProgressProgress === 'checkout' } onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

            <Input label="Full Name" type="text" id="name" />
            <Input label="E-mail Address" type="email" id="email" />
            <Input label="Street" type="text" id="street" />
            <div className={classes["control-row"]}>
                <Input label="Postal Code" type="text" id="postal-code" />
                <Input label="City" type="text" id="city" />
            </div>

            {error && <DesignatedError title="Failed to submit order!" message={error} />}

            <p className={classes["modal-actions"]}>
                { isLoading ?
                    <span>Sending order data...</span>
                    :
                    <>
                        <Button textOnly type="button" onClick={handleClose}>Close</Button>
                        <Button>Submit Order</Button>
                    </>
                }
            </p>
        </form>
    </Modal>;
}
