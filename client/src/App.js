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

    const userData = []
    for(let i = 0; i<users.length; ++i) {
      userData.push(new User(users[i], eastStats[i], southStats[i]))
    }

    return userData
  };

  return (
    <>
    {
      data !== undefined && data.map(u => <div key={u.account_id}>{u.nickname} - {u.name} - {u.match_east.game_count_sum} - {u.match_south.game_count_sum}</div>)
    }
    </>
  );
}

export default App;
