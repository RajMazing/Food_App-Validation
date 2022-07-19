import { useEffect, useState } from "react";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";

const AvailableMeals = () => {
	//useState hook
	const [meals, setMeals] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [httpError, setHttpError] = useState();
	useEffect(() => {
		//connecting to firebase backend
		const fetchMeals = async () => {
			const response = await fetch(
				"https://react-http-requests-78a78-default-rtdb.firebaseio.com/meals.json"
			);

			//response validation
			if (!response.ok) {
				throw new Error("SOMETHING WENT WRONG");
			}

			const responseData = await response.json();

			const loadedMeals = [];

			for (const key in responseData) {
				loadedMeals.push({
					id: key,
					name: responseData[key].name,
					description: responseData[key].description,
					price: responseData[key].price,
				});
			}
			setMeals(loadedMeals);
			setIsLoading(false);
		};

		//when fetch method cannot get information from backend
		//this error will display in place of server information
		fetchMeals().catch((error) => {
			setIsLoading(false);
			setHttpError(error.message);
		});
	}, []);

	//If backend is truthy then display this p tag message
	if (isLoading) {
		return (
			<section className={classes.MealsLoading}>
				<p>Loading...</p>
			</section>
		);
	}

	//if backend isnt displaying then this validation eill pass
	if (httpError) {
		return (
			<section className={classes.MealsError}>
				<p>{httpError}</p>
			</section>
		);
	}
	//meals are fetched!
	const mealsList = meals.map((meal) => (
		<MealItem
			key={meal.id}
			id={meal.id}
			name={meal.name}
			description={meal.description}
			price={meal.price}
		/>
	));

	return (
		<section className={classes.meals}>
			<Card>
				<ul>{mealsList}</ul>
			</Card>
		</section>
	);
};

export default AvailableMeals;
