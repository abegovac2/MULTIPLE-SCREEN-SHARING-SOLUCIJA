import './App.css';
import Login from "../pages/login/Login.jsx"
import EnterMeet from '../pages/meetMeet/EnterMeet.jsx';
import Meet from '../pages/meet/Meet.jsx';
import ListMeets from '../pages/listMeets/ListMeets.jsx';
import SearchMeet from '../pages/searchMeet/SearchMeet.jsx';
import CreateMeet from '../pages/createMeet/CreateMeet.jsx';
import Error from '../pages/error/Error.jsx'

function App() {
	return (
		<Routes>
			<Route exact path="/" element={<Login />} />
			<Route exact path="/enter" element={<EnterMeet />} />
			<Route exact path="/meet" element={<Meet />} />
			<Route exact path="/list-meets" element={<ListMeets />} />
			<Route exact path="/search" element={<SearchMeet />} />
			<Route exact path="/create" element={<CreateMeet />} />
			<Route exact path="/error" element={<Error />} />
		</Routes>
	);
}

export default App;
