import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAllMatchResults, insertMatchResults } from '../../api/MatchResultsAPI';
import './MatchResults.css'

export default function MatchResults() {

    let navigate = useNavigate();


    useEffect(() => {
        getAllResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [matchResults, setMatchResults] = useState('');

    const handleMatchResults = (e) => {
        setMatchResults(e.target.value);
    }

    const submit = () => {
        let matchResultsList = convertInputToMatchResults(matchResults.trim());
        console.log(matchResultsList)
        save(matchResultsList);

    }

    async function save(matchResults) {
        try {
            const response = await insertMatchResults(matchResults);
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
    
    async function getAllResults() {
        try {
            const response = await getAllMatchResults();
            if (response) {
                let input = convertDataToInput(response);
                setMatchResults(input);
            }
        } catch (error) {
            let msg = "";
            if (error ===  400) {
            msg = "Bad Request. Please check input format"
            }
            alert('Error: ' + msg);
        }
    }

    const convertInputToMatchResults = (input) => {
        const inputArr = input.split(/\r?\n/);
        const inputObjArr = [];
        let matchResults = {
          team1: '',
          team2: '',
          team1_goals: '',
          team2_goals: '',
        }
        inputArr.forEach(x => {
          const xArr = x.split(" ");
    
          let newMatchResults = JSON.parse(JSON.stringify(matchResults)); // deep clone
          newMatchResults.team1 = xArr[0];
          newMatchResults.team2 = xArr[1];
          newMatchResults.team1_goals = parseInt(xArr[2]);
          newMatchResults.team2_goals = parseInt(xArr[3]);
          inputObjArr.push(newMatchResults);
        })
        return inputObjArr;
    }

    const convertDataToInput = (data) => {
        let input = "";
        data.forEach(x => {
        input += x.team_1 + " " +  x.team_2 + " " + x.team_1_goals + " " + x.team_2_goals + "\n";
        })
        return input;
    }

    return (
        <div>
            <h1>We are the champions!</h1>
            <div className="form">
                <label>Match Results:</label>
                <textarea 
                type="text" 
                name="matchResults" 
                onChange={handleMatchResults}
                value={matchResults}/>

                <button onClick={submit}>Next</button>      
            </div>
        </div>
    )
}