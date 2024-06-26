import classes from './ClothesList.module.css';
import { Link } from "react-router-dom";
import {currencyFormatter} from "../util/formatter";
import Button from "./UI/Button";
import { useDispatch } from "react-redux";
import { cartActions } from "../reduxStore/CartSlice";

function ClothesList({ clothes }) {
    const dispatch = useDispatch();

    function handleAddClotheToCart(event, clothe) {
        event.preventDefault();
        dispatch(cartActions.addItem(clothe));
    }

  return (
    <div className={classes.clothes}>
      <h1>All Clothes</h1>
      <ul className={classes.list}>
        {clothes.map((clothe) => (
          <li key={clothe.id} className={classes.item}>
            <Link to={`/clothes/${clothe.id}`} id={clothe.id}>
              <img src={clothe.image} alt={clothe.title} />
              <div className={classes.content}>
                <h2>{clothe.title}</h2>
                <time>{clothe.date}</time>
                <p className={classes["clothe-item-price"]}>Price: {currencyFormatter.format(clothe.price)}</p>
                <p className={classes["clothe-item-action"]}>
                    <Button onClick={(event) => { handleAddClotheToCart(event, clothe) }}>Add to Cart</Button>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClothesList;
