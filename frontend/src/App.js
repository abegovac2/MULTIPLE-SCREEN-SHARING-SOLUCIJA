import './App.css';
import { useCookies } from "react-cookie";
import Login from "./pages/login/Login.jsx"
import EnterMeet from './pages/enterMeet/EnterMeet.jsx';
import Meet from './pages/meet/Meet.jsx';
import ListUsers from './pages/listUsers/ListUsers.jsx';
import SearchMeet from './pages/searchMeet/SearchMeet.jsx';
import CreateMeet from './pages/createMeet/CreateMeet.jsx';
import Error from './pages/error/Error.jsx'
import { Routes, Route } from 'react-router-dom';

import NavigationBar from './components/NavigationBar/NavigationBar';

function App() {
	const [cookies, setCookie] = useCookies([
		'userName', 'email', 'token'
	]);

	function setUserAndToken(user) {
		setCookie('userName', user.userName, { path: '/' });
		setCookie('email', user.email, { path: '/' });
		setCookie('token', user.token, { path: '/' });
	}

	let renderComp = <></>
	if (cookies.token === "undefined")
		renderComp = <Login setCookie={setUserAndToken} />
	else renderComp = <>
		<NavigationBar user={cookies.userName} setCookie={setUserAndToken} />
		<Routes>
			<Route exact path="/" element={<Login />} />
			<Route exact path="/enter" element={<EnterMeet />} />
			<Route exact path="/meet" element={<Meet />} />
			<Route exact path="/list-users" element={<ListUsers />} />
			<Route exact path="/search" element={<SearchMeet />} />
			<Route exact path="/create" element={<CreateMeet />} />
			<Route exact path="/error" element={<Error />} />
		</Routes>
	</>
	return (
		<div className="container">
			{renderComp}
		</div>
	);
}

export default App;
