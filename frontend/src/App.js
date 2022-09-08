import './App.css';
import { useCookies } from "react-cookie";
import Login from "./pages/login/Login.jsx"
import EnterMeet from './pages/enterMeet/EnterMeet.jsx';
import Meet from './pages/meet/Meet.jsx';
import ListUsers from './pages/listUsers/ListUsers.jsx';
import SearchMeet from './pages/searchMeet/SearchMeet.jsx';
import CreateMeet from './pages/createMeet/CreateMeet.jsx';
import Error from './pages/error/Error.jsx'
import { Routes, Route, useLocation } from 'react-router-dom';

import NavigationBar from './components/NavigationBar/NavigationBar';
import MeetInfo from './pages/meetInfo/MeetInfo';

function App() {

	const location = useLocation();

	const hasTokenValidation = (transition) => {
		if (!document.cookie.split(';').some(c =>
			c.trim().startsWith('token=')
		)) transition.redirect('/error')
	}

	return (
		<div className={location.pathname === "/meet" ? "" : "container"}>
			<>
				{location.pathname !== "/meet" && <NavigationBar user={document.cookie.user} setCookie={null} />}
				<Routes>
					<Route exact path="/" element={<Login />} />
					{/*<Route exact path="/enter" element={<EnterMeet />}  />*/}
					<Route exact path="/meet" element={<Meet />} onEnter={hasTokenValidation} />
					{/*<Route exact path="/list-users" element={<ListUsers />} />*/}
					<Route exact path="/search" element={<SearchMeet />} onEnter={hasTokenValidation} />
					<Route exact path="/create" element={<CreateMeet />} onEnter={hasTokenValidation} />
					<Route exact path="/error" element={<Error />} />
					<Route exact path="/meet-info" element={<MeetInfo />} onEnter={hasTokenValidation} />
				</Routes>
			</>
		</div>
	);
}

export default App;
