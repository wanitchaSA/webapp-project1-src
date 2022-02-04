import { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { FaTrash } from 'react-icons/fa';

import React from 'react';
import {Line} from 'react-chartjs-2';

//import GPAList from "./GradesTable";
import Chart from 'chart.js/auto'

const styles ={
  textCenter : {textAlign: 'center'},
  textRight : {textAlign: 'right'},
}

/*var recordObj = {
      year: yearRef.current.value,
      semst: semstRef.current.value,
      courseGroup: courseGroupRef.current.value,
      subjGroup: subjGroupRef.current.value,
      subjName: subjNameRef.current.value,
      grade: gradeRef.current.value,
};*/

const gradeCriteria = [
  {letter: "A", value: 4},
  {letter: "A-", value: 3.75},
  {letter: "B+", value: 3.25},
  {letter: "B", value: 3},
  {letter: "B-", value: 2.75},
  {letter: "C+", value: 2.25},
  {letter: "C", value: 2},
  {letter: "C-", value: 1.75},
  {letter: "D", value: 1},
  {letter: "F", value: 0},
  {letter: "W", value: "-"},
  {letter: "I", value: "-"},
  {letter: "S", value: "-"},
  {letter: "U", value: "-"},
  {letter: "R", value: "-"},
  {letter: "TR", value: "-"}
]

const emptyGradeList = ["W","I","S","U","R","TR"]

let GPAList = []

function GradesTable({ data, setDataItems }) {
  const [dataRows, setDataRows] = useState();
  const [GPA2019, setGPA2019] = useState();
  const [GPA2020, setGPA2020] = useState();
  const [GPA2021, setGPA2021] = useState();
  const [GPAX, setGPAX] = useState();
  const [ChartData, setChartData] = useState();

  GPAList = []

  // USE EFFECT
  useEffect(() => {
    
    // SORT DATA BY YEAR
    data.sort((a, b) => {
    return a.semst - b.semst;
    });
    data.sort((a, b) => {
    return a.year - b.year;
    });
    //console.log(data)

    let numRecord = 0 // number of records
    let currentYear = 0
    let currentSemst = 0

    let undefinedGrade = 0
    let semstGPA = 0
    let calcSemstGPA = 0

    let gpax = 0
    let gpa2019 = 0
    let gpa2020 = 0
    let gpa2021 = 0
    let df2019 = 0
    let df2020 = 0
    let df2021 = 0

    let dfSemstGPA = 0

    const z = data.map((v, i) => {

      numRecord = data.length
      let currentIndex = i
      
      // GET GRADE VALUE
      var subjGPA = fetchGradeValue(v.grade);
      console.log(subjGPA)

      // CALCULATE GPAX
      if (subjGPA != "-") {
        let qualityPoints = subjGPA * 3
        gpax += qualityPoints
        switch(v.year) {
          case "2019":
            gpa2019 += qualityPoints
            df2019++
            break;
          case "2020":
            gpa2020 += qualityPoints
            df2020++
            break;
          case "2021":
            gpa2021 += qualityPoints
            df2021++
            break;
        }
        // console.log("v.year",v.year)
        // console.log("currentYear", currentYear)
       
        if ((currentYear === 0) || ((v.year === currentYear) && v.semst === currentSemst)) {
          currentYear = v.year
          currentSemst = v.semst
          calcSemstGPA += (subjGPA * 3)
          semstGPA = ""
          dfSemstGPA++
          if (numRecord > currentIndex+1) {
            let nextYear = data[i+1].year
            let nextSemst = data[i+1].semst

            if ((nextYear > currentYear) || (nextSemst > currentSemst)) {
              semstGPA = calcSemstGPA/(dfSemstGPA*3)
              semstGPA = "[GPA of " + currentSemst + "/" + currentYear + "]\n" + semstGPA.toFixed(2)
              calcSemstGPA = 0
            }
          } else if (numRecord === currentIndex+1) {
            semstGPA = calcSemstGPA/(dfSemstGPA*3)
            semstGPA = "[GPA of " + currentSemst + "/" + currentYear + "]\n" + (calcSemstGPA/(dfSemstGPA*3)).toFixed(2)
          }

        } else {
          currentYear = v.year
          currentSemst = v.semst
          calcSemstGPA = 0 + (subjGPA * 3)
          semstGPA = ""
          dfSemstGPA = 0 + 1

          if (numRecord > currentIndex+1) {
            let nextYear = data[i+1].year
            let nextSemst = data[i+1].semst

            if ((nextYear > currentYear) || (nextSemst > currentSemst)) {
                semstGPA = calcSemstGPA/(dfSemstGPA*3)
                semstGPA = "[GPA of " + currentSemst + "/" + currentYear + "]\n" + semstGPA.toFixed(2)
                calcSemstGPA = 0
            }
          } else if (numRecord === currentIndex+1) {
            semstGPA = "[GPA of " + currentSemst + "/" + currentYear + "]\n" + (calcSemstGPA/(dfSemstGPA*3)).toFixed(2)
          }

        }

        // console.log("calc",calcSemstGPA)
        // console.log("final",semstGPA)

      } else {
        // filter out undefined grades (exclude from calculation)
        undefinedGrade = undefinedGrade + 1
      }
      
      return (
        <tr key={i}>
          <td><FaTrash onClick={() => deleteClick(i)}/></td>
          {/*<td style={styles.textCenter}>{v.qty}</td>*/}
          <td style={styles.textCenter}>{v.semst}/{v.year}</td>
          {/*<td>{v.subjCode}</td>*/}
          <td>{v.subjName}</td>
          <td style={styles.textCenter}>{v.grade}</td>
          <td style={styles.textRight}>{subjGPA}</td>
          <td style={{textAlign: "right", textDecoration: "underline"}}>{semstGPA}</td>
        </tr>
      );
    });

    gpax = gpax/((numRecord-undefinedGrade)*3)
    gpa2019 = gpa2019/(df2019*3)
    gpa2020 = gpa2020/(df2020*3)
    gpa2021 = gpa2021/(df2021*3)

    setDataRows(z);
    setGPAX(gpax.toFixed(2))
    setGPA2019(gpa2019.toFixed(2))
    setGPA2020(gpa2020.toFixed(2))
    setGPA2021(gpa2021.toFixed(2))

    GPAList.push(gpa2019)
    GPAList.push(gpa2020)
    GPAList.push(gpa2021)
    console.log(GPAList)

    setChartData(GPAList)

  }, [data]);

  function fetchGradeValue(letter) {
    if (letter in emptyGradeList) {
      return;
    } else {
      for (var grade of gradeCriteria) {
        if (letter === grade.letter) {
          return grade.value;
        }
      }
    }
  };

  // DELETE RECORD
  // delete individual row
  const deleteClick = (i) => {
    //console.log(i)
    data.splice(i,1)
    setDataItems([...data])
  }
  // clear all records
  const clearTable = () => {
    setDataItems([]);
    setDataRows([]);
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const state = {
  labels: ['2019', '2020', '2021'],
  datasets: [
    {
      label: 'GPA Per Year',
      fill: false,
      lineTension: 0.5,
      backgroundColor: '#96eeff',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: ChartData
    }
  ]
  }

  /*function rowStyleFormat(row, rowIdx) {
  return { backgroundColor: rowIdx % 2 === 0 ? 'red' : 'blue' };
  }*/

  return (
    <Container>
      <Row>
        {/*The app shows the list of subjects*/}
        <Col>
          <h2 style={{fontFamily: "Garamond", fontWeight: "bold"}}>GRADE LIST</h2>
        </Col>
        <Col style = {styles.textRight}>
          <Button onClick={clearTable} variant="outline-danger">
            Clear
          </Button>
        </Col>
      </Row>
    
      <Row>
        
        {/*The app shows GPAX*/}
        <Col>
          <h4 style={{fontFamily: "Garamond", fontWeight: "bold", color: "#00a2ff"}}>GPAX: {GPAX}</h4>
        </Col>
      </Row>
      
      
      <Table striped bordered hover style={{fontFamily: "Arial", fontSize: 15}}>
        <thead style={styles.textCenter}>
          <tr>
            <th></th>
            <th>ACADEMIC YEAR</th>
            {/*<th>Code</th>*/}
            <th>SUBJECT</th>
            <th>GRADE</th>
            <th>VALUE</th>
            <th>GPA (Per Semester)</th>
          </tr>
        </thead>
        <tbody>
          {dataRows}</tbody>
        <tfoot>
          <tr>
            <th colSpan={4}></th>
            <th></th>
            <th></th>
          </tr>
          <tr style={{color: "#00a2ff"}}>
            <th colSpan={4}></th>
            <th style={{textAlign: "center"}}>TOTAL GPAX</th>
            <th style={{textAlign: "right", borderBottom: "3px double"}}>{GPAX}</th>
          </tr>
          <tr>
            <th colSpan={4}></th>
            <th style={styles.textCenter}>2019</th>
            <th style={{textAlign: "right", borderBottom: "3px double"}}>{GPA2019}</th>
          </tr>
          <tr>
            <th colSpan={4}></th>
            <th style={styles.textCenter}>2020</th>
            <th style={{textAlign: "right", borderBottom: "3px double"}}>{GPA2020}</th>
          </tr>
          <tr>
            <th colSpan={4}></th>
            <th style={styles.textCenter}>2021</th>
            <th style={{textAlign: "right", borderBottom: "3px double"}}>{GPA2021}</th>
          </tr>
        </tfoot>
      </Table>
      <Row>
        <b style={{fontFamily: "Arial", fontSize: 10}}>
            Note: If there exists grade with no value (e.g., W) in a particular year, the current system may not be able to properly show GPA per semester of the year.</b>
      </Row>
      <br></br>

      <div>
        <Line
          data={state}
          options={{
            title:{
              display:true,
              text:'Average GPA Per Year',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
      </div>
      </Container>
  );
}

export default GradesTable;
