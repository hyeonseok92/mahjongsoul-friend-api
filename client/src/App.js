import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { User } from 'dto'

const styles = {
  root: {
    width: '100%',
    height: '100%',
  }
}
const useStyles = makeStyles(styles);

const App = () => {
  const [data, setData] = React.useState();
  React.useEffect(() => {
    callBackendAPI()
      .then(res => setData(res))
      .catch(err => console.log(err));
  }, [])

  // fetching the GET route from the Express server which matches the GET route from server.js
  const callBackendAPI = async () => {
    const resUsers = await fetch('/api/user');
    const resEastStats = await fetch('/api/stat/east');
    const resSouthStats = await fetch('/api/stat/south');
    if (resUsers.status !== 200 || 
      resEastStats.status !== 200 || 
      resSouthStats.status !== 200) {
      throw Error("server error"); 
    }
    const users = await resUsers.json();
    const eastStats = await resEastStats.json();
    const southStats = await resSouthStats.json();

    console.log(eastStats)

    return {
      users: users.map(v=>new User(v)), 
      eastStats, 
      southStats};
  };

  console.log(data && data.users)

  return (
    <>
    {
      data !== undefined && (
        <div className="App">
          <p className="App-intro">{data.users.map(u => <div>{u.nickname} - {u.name}</div>)}</p>
          <p className="App-intro">{JSON.stringify(data.eastStats)}</p>
          <p className="App-intro">{JSON.stringify(data.southStats)}</p>
        </div>)
    }
    </>
  );
}

export default App;
