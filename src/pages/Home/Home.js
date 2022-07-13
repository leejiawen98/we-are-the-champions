import { useEffect, useState } from 'react';
import './Home.css';
import { getAllTeamInformation, insertTeamInformation } from '../../api/TeamInformationAPI';
import { useNavigate } from 'react-router-dom';

export default function Home() {

  let navigate = useNavigate();

  const [teamInformation, setTeamInformation] = useState('');

  useEffect(() => {
    getAllTeams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    let teamList = convertInputToTeamInformation(teamInformation.trim());
    save(teamList);
    navigate('/matchResults');
  }

  async function save(team) {
    try {
      const response = await insertTeamInformation(team);
      if (response) {
        alert('ok');
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
      const xArr = x.split(" ");

      let newTeamInformation = JSON.parse(JSON.stringify(teamInformation)); // deep clone
      newTeamInformation.team_name = xArr[0];
      newTeamInformation.group_number = parseInt(xArr[2]);
      let reg_date_arr = xArr[1].split("/");
      let registration_date = new Date();
      registration_date.setMonth(parseInt(reg_date_arr[1])-1);
      registration_date.setDate(parseInt(reg_date_arr[0]));
      newTeamInformation.registration_date = registration_date.getFullYear() + "-" + (registration_date.getMonth()+1) + "-" + registration_date.getDate();
      inputObjArr.push(newTeamInformation);
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
      <h1>We are the champions!</h1>
      <div className="form">
        <label>Team Information:</label>
        <textarea 
        type="text" 
        name="teamInformation" 
        onChange={handleTeamInformation}
        value={teamInformation}/>

        <button onClick={submit}>Next</button>      
      </div>
    </div>
  );
}

