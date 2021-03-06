import React, {Component} from 'react';
import Wrap from '../../hoc/Wrap/Wrap'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummery/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import axios from "../../axios-orders";
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import {connect} from 'react-redux'
import * as actions from '../../store/actions/index'

class BurgerBuilder extends Component {

	state ={
		purchasing: false,
	};

	componentDidMount () {
		this.props.onInitIngredients();
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(ingKey => {
				return ingredients[ingKey]
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0
	}

	purchaseHandler = () => {
		this.setState({purchasing: true})
	};

	purchaseCancelHandler = () => {
		this.setState({purchasing: false})
	};

	purchaseContinueHandler = () => {
		this.props.onInitPurchase();
		this.props.history.push('/checkout');
	};

	render() {
		const disabledInfo = {
			...this.props.ings
		};
		for (let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <= 0
		}
		let orderSummary = null;
		let burger = this.props.error ? <p>Ingredient's can't be loaded</p> : <Spinner/>;

		if (this.props.ings) {
			burger = (
				<Wrap><Burger ingredients = {this.props.ings}/>
					<BuildControls
						ingredientAdded = {this.props.onIgredientAdded}
						ingredientRemoved = {this.props.onIgredientRemoved}
						disabled = {disabledInfo}
						price = {this.props.price}
						purchasable = {this.updatePurchaseState(this.props.ings)}
						ordered = {this.purchaseHandler}
					/>
				</Wrap>);
			orderSummary =
				<OrderSummary
					ingredients = {this.props.ings}
					purchaseCanceled = {this.purchaseCancelHandler}
					purchaseContinued = {this.purchaseContinueHandler}
					price ={this.props.price}
				/>;
		}

		return(
			<Wrap>
				<Modal show = {this.state.purchasing} modalClosed = {this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Wrap>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onIgredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
		onIgredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));