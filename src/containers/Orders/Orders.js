import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from '../../axios-orders'
import Order from '../../components/Order/Order'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Spinner from '../../components/UI/Spinner/Spinner'
import Wrap from '../../hoc/Wrap/Wrap'
import * as actions from '../../store/actions/index'

class Orders extends Component {

	state = {
		orders: [],
		loading: true
	};

	componentDidMount() {
		this.props.onFetchOrders();
	}

	render(){
		let orders =
			<Wrap>
				{this.props.orders.map(order => (
					<Order
						key = {order.id}
						ingredients ={order.ingredients}
						price = {order.price}
					/>
				))}
			</Wrap>;

		if (this.props.loading){
			orders = <Spinner/>
		}
		return(
			<div>
				{orders}
			</div>
		)
	}
}

const mapStatetoProps = state => {
	return {
		orders: state.order.orders,
		loading: state.order.loading
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onFetchOrders: () => dispatch(actions.fetchOrders())
	}
};

export default connect(mapStatetoProps, mapDispatchToProps)(withErrorHandler(Orders, axios));