import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../store/auth-context";

const emailReducer = (state, action) => {
	if (action.type === "USER_INPUT") {
		return { value: action.val, isValid: action.val.includes("@") };
	}
	if (action.type === "INPUT_BLUR") {
		return { value: state.value, isValid: state.value.includes("@") };
	}
	return { value: "", isValid: false };
};

const Login = (props) => {
	const ctx = useContext(AuthContext);

	//const [enteredEmail, setEnteredEmail] = useState("");
	//const [emailIsValid, setEmailIsValid] = useState();
	const [enteredPassword, setEnteredPassword] = useState("");
	const [passwordIsValid, setPasswordIsValid] = useState();
	const [formIsValid, setFormIsValid] = useState(false);

	const [emailState, dispachEmail] = useReducer(emailReducer, { value: "", isValid: null });

	// Eğer email value su edğişir ama valid hala değişmezse gereksiz yere useEffect çalışmayacak.
	const { isValid: emailIsValid } = emailState;

	useEffect(() => {
		const identifier = setTimeout(() => {
			setFormIsValid(emailIsValid && enteredPassword.trim().length > 6);
		}, 600);
		return () => {
			clearTimeout(identifier);
		};
	}, [emailIsValid, enteredPassword]);

	const emailChangeHandler = (event) => {
		dispachEmail({ type: "USER_INPUT", val: event.target.value });
		//setEnteredEmail(event.target.value);

		setFormIsValid(emailState.value.includes("@") && enteredPassword.trim().length > 6);
	};

	const passwordChangeHandler = (event) => {
		setEnteredPassword(event.target.value);
	};

	const validateEmailHandler = () => {
		//setEmailIsValid(emailState.value.includes("@"));
		dispachEmail({ type: "INPUT_BLUR" });
	};

	const validatePasswordHandler = () => {
		setPasswordIsValid(enteredPassword.trim().length > 6);
	};

	const submitHandler = (event) => {
		event.preventDefault();
		ctx.onLogin(emailState.value, enteredPassword);
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<div
					className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ""}`}
				>
					<label htmlFor="email">E-Mail</label>
					<input
						type="email"
						id="email"
						value={emailState.value}
						onChange={emailChangeHandler}
						onBlur={validateEmailHandler}
					/>
				</div>
				<div className={`${classes.control} ${passwordIsValid === false ? classes.invalid : ""}`}>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={enteredPassword}
						onChange={passwordChangeHandler}
						onBlur={validatePasswordHandler}
					/>
				</div>
				<div className={classes.actions}>
					<Button type="submit" className={classes.btn} disabled={!formIsValid}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
