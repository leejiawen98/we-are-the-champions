import { useEffect, useState } from 'react';
import './Home.css';
import { getAllTeamInformation, insertTeamInformation } from '../../api/TeamInformationAPI';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from 'reactstrap';

export default function Home() {

  let navigate = useNavigate();

  let error = false;

  const [teamInformation, setTeamInformation] = useState('');

  useEffect(() => {
    getAllTeams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (teamInformation !== "") {
      let teamList = convertInputToTeamInformation(teamInformation.trim());
      if (!error) {
        save(teamList);
      } else {
        error = false;
      }
    } else {
      alert("Please input team information");
    }
  }

  function handleTeamScores(teamList) {
    let teamScore = {
      match_points: 0,
      total_goals: 0,
      alt_match_points: 0,
      registration_date: '',
      team_name: '',
      group_number: 0
    }
    let teamScoreMap = new Map();
    teamList.forEach(x => {
      let newTeamScore = JSON.parse(JSON.stringify(teamScore)); // deep clone
      newTeamScore.team_name = x.team_name;
      newTeamScore.group_number = x.group_number;
      let reg_date_arr = x.registration_date.split("-");
      let registration_date = new Date();
      registration_date.setMonth(parseInt(reg_date_arr[1])-1);
      registration_date.setDate(parseInt(reg_date_arr[2]));
      newTeamScore.registration_date = registration_date;
      teamScoreMap.set(x.team_name, newTeamScore);
    })
    return teamScoreMap;
  }

  async function save(team) {
    try {
      const response = await insertTeamInformation(team);
      if (response) {
        let teamScoreMap = handleTeamScores(team);
        navigate('/matchResults', {
          state: {
            teamScoreMap: teamScoreMap
          }
        });
      }
    } catch (error) {
      let msg = "";
      if (error ===  400) {
        msg = "Bad Request. Please check input format"
      }
      alert('Error: ' + msg);
    }
  }

  async function getAllTeams() {
    try {
      const response = await getAllTeamInformation();
      if (response) {
        let input = convertDataToInput(response);
        setTeamInformation(input);
      }
    } catch (error) {
      let msg = "";
      if (error ===  400) {
        msg = "Bad Request. Please check input format"
      }
      alert('Error: ' + msg);
    }
  }

  const handleTeamInformation = (e) => {
    setTeamInformation(e.target.value);
  }

  const convertInputToTeamInformation = (input) => {
    const inputArr = input.split(/\r?\n/);
    const inputObjArr = [];
    let teamInformation = {
      team_name: '',
      group_number: '',
      registration_date: ''
    }
    inputArr.forEach(x => {
      // exit loop if there exists error in input
      if (error) {
        return false;
      }
      const xArr = x.split(" ");
      if (xArr.length === 3) {
        let newTeamInformation = JSON.parse(JSON.stringify(teamInformation)); // deep clone
        newTeamInformation.team_name = xArr[0];
        newTeamInformation.group_number = parseInt(xArr[2]);
        let reg_date_arr = xArr[1].split("/");
        let registration_date = new Date();
        registration_date.setMonth(parseInt(reg_date_arr[1])-1);
        registration_date.setDate(parseInt(reg_date_arr[0]));
        newTeamInformation.registration_date = registration_date.getFullYear() + "-" + (registration_date.getMonth()+1) + "-" + registration_date.getDate();
        inputObjArr.push(newTeamInformation);
      } else {
        alert("Please input in the correct format");
        error = true;
      }
    })
    return inputObjArr;
  }

  const convertDataToInput = (data) => {
    let input = "";
    data.forEach(x => {
      let date = new Date(x.registration_date);
      input += x.team_name + " " + date.getDate() + "/" + (date.getMonth()+1) + " " + x.group_number + "\n";
    })
    return input;
  }

  return (
    <div>
      <Navbar color="light">
        <h1>We Are the Champions!</h1>
      </Navbar>
      <div className="body-content">
        <div className="form">
          <Link to="/ranking" className="view-button"><h4>View current ranking</h4></Link>
          <div className="form-title">
            <h5>Team Information:</h5>
          </div>
          <textarea 
          type="text" 
          name="teamInformation" 
          onChange={handleTeamInformation}
          value={teamInformation}
          placeholder="<Team A name> <Team A registration date in DD/MM> <Team A group number>"
          />
          <button className="next-button" onClick={submit}>Next</button>
        </div>
      </div>
    </div>
  );
}

