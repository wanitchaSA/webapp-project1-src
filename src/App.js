import React from 'react';

import { useState, useRef, useEffect } from "react";
import useLocalStorage from 'react-localstorage-hook'

import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import GradesTable from "./GradesTable";

function App() {
  // REFERENCES TO DATA
  const yearRef = useRef(); // year
  const semstRef = useRef(); // semester
  const courseGroupRef = useRef(); // course group
  const subjGroupRef = useRef(); // subject group
  const subjNameRef = useRef(); // subject name
  const subjCodeRef = useRef(); // subject code
  const gradeRef = useRef(); // grade

  // USE LOCAL STORAGE
  const [dataItems, setDataItems] = useLocalStorage("dataItems",[]);
  const [subjCode, setSubjCode] = useState();
  const [subjGroups, setSubjGroups] = useState();

  // FETCH CURRICULUM DATA FROM JSON FILE
  const jsonData= require('./cs-2019.json'); 
  //console.log(jsonData);

  let showCode = "";
  // DUMMY LISTS OF DATA
  const years = [ 2019, 2020, 2021 ]
  const semesters = [ 1, 2, 3 ]

  let dummySubjGroups = [
    "Language Courses", 
    "Humanities Courses", 
    "Social Science Courses", 
    "Science and Mathemetics Courses",
    "Other General Education Courses"
    // ...
  ]

  const grades = [ 
    "A", "A-", 
    "B+", "B", "B-", 
    "C+", "C", "C-", 
    "D", "F", "W", "I", "S", "U", "R", "TR"
  ]

  // FUNCTION TO RECORD DATA
  const addRecord = () => {

    // check for empty fields
    if (subjGroupRef.current.value == "Choose..") {
      alert("You have to choose a Subject Group. \nSorry for inconvenience..");
      return;
    }
    if (subjNameRef.current.value == "Choose subject..") {
      alert("Subject is not chosen.");
      return;
    }
    if (gradeRef.current.value == "Choose grade..") {
      alert("Grade is not specified.");
      return;
    }

    //const rid = semstRef.current.value;
    //const subject = json.find((e) => e.id === rid);
    //const year = years.find((e) => e);

    // record objects
    var recordObj = {
      year: yearRef.current.value,
      semst: semstRef.current.value,
      courseGroup: courseGroupRef.current.value,
      subjGroup: subjGroupRef.current.value,
      subjName: subjNameRef.current.value,
      //subjCode: subjCodeRef.current.value,
      grade: gradeRef.current.value,
    };

    dataItems.push(recordObj);
    setDataItems([...dataItems]);   
  };

  // FUNCTION FOR ONCHANGE
  /*const courseGroupChange = (e) => {
      let subjGroups = [];
      const inputCourse = courseGroupRef.current.value;
      let courseGroups = courseGroupsList.find((e) => e.courseGroup === inputCourse);
      let tempSubjGroups = courseGroups.subjects;
      for (var i=0; i<tempSubjGroups.length; i++) {
        subjGroups.push(tempSubjGroups[i].groupName);
      };
      dummySubjGroups = subjGroups
      //console.log(dummySubjGroups);

  };*/

  useEffect(() => {
    const z = dataItems.map((v, i) => {
      
    });
  }, [dataItems]);

  // DROP-DOWN OPTIONS

  // ACADEMIC YEAR
  // year
  const yearOptions = years.map((v) => {
    return <option key={v}>{v}</option> // value={v} 
  });
  // sem
  const semOptions = semesters.map((v) => {
    return <option key={v}>{v}</option>
  });

  // SUBJECTS
  const courseGroupsList = [];
  const subjGroupsList = [];
  const subjects = [];
  var curriculum = jsonData.curriculum;
  // loop through curriculum: list of 3 course groups
  for (var i=0; i<curriculum.length; i++) {
    var courseGroups = curriculum[i].subjects;
    courseGroupsList.push(curriculum[i]);
    // loop through courseGroupList: list of subject groups
    for (var j=0; j<courseGroups.length; j++) {
      var subjGroupList = courseGroups[j];
      subjGroupsList.push(subjGroupList);
      var subjList = subjGroupList.subjects;
      // loop through subjList: list of all subjects
      for (var subject of subjList) {
        // push each subj name into the array
        subjects.push(subject);
      }
    }
  };

  // course groups
  const courseGroupOptions = courseGroupsList.map((v) => {
    return <option key={v.courseGroup}>{v.courseGroup}</option>
  });

  // subj groups
  /*let subjGroupOptions = []
  function fxSubjGroupOptions() {
    subjGroupOptions = []
    console.log(courseGroupRef.current)
    if (courseGroupRef.current !== undefined) {
      let targetSubjGroup = courseGroupList.find((x) => x.courseGroup === courseGroupRef.current.value);
      console.log(targetSubjGroup.subjects.length)
      for (var i=0; i<targetSubjGroup.subjects.length; i++) {
        let returningSubjGroup = targetSubjGroup.subjects[i].groupName
        console.log(returningSubjGroup)
        subjGroupOptions.push(<option key="returningSubjGroup">{returningSubjGroup}</option>)
      }
    }
  }
  fxSubjGroupOptions()*/

  const subjGroupOptions = subjGroupsList.map((v) => {
    return <option key={v.groupName}>{v.groupName}</option>
  });

  // subj names
  const subjNameOptions = subjects.map((v) => {
    return <option key={v.code}>({v.code}) {v.name}</option>
  });
  
  function fetchCode() {
    //console.log(subjNameRef.current);
    if (subjNameRef.current !== undefined) {
      for (var subj of subjects) {
        if (subjNameRef.current.value === subj.name) {
          showCode = subj.code;
          //console.log(subj.code);
          //subjCodeRef.current = subj.code;
          console.log(subjCodeRef.current)
        }
      }
    }
  };

  // GRADE
  const gradeOptions = grades.map((v) => {
    return <option key={v}>{v}</option>
  });

  // SHOW ON WEB PAGE
  return (

    <Container>
      <Row>
        
        <h1 style={{fontFamily: "Garamond", fontWeight: "bold"}}><br></br>ACADEMIC RECORD SYSTEM</h1>
        {/* FORM TO RECORD ACADEMIC PROGRESS */}
        <Col xs={5} style={{ backgroundColor: "#d1f1ff", fontFamily: "Georgia"}}>
          <br></br>
          <Form>

            {/* ACADEMIC YEAR */}
            <Form.Label>ACADEMIC YEAR</Form.Label>
            {/* year */}
            <Form.Group className="input-group mb-1" controlId="formYear">
              <label className="input-group-text" htmlFor="yearSelection">year</label>
              <Form.Select
                id="yearSelection"
                // aria-label="Year Selection"
                ref={yearRef}
              >
                {yearOptions}
              </Form.Select>
            </Form.Group>
            {/* semester */}
            <Form.Group className="input-group mb-3" controlId="formSem">
              <label className="input-group-text" htmlFor="semSelection">semester</label>
              <Form.Select
                id="semSelection"
                ref={semstRef}
              >
                {semOptions}
              </Form.Select>
            </Form.Group>

            {/* SUBJECT */}
            <Form.Label>SUBJECT</Form.Label>
            <b style={{fontSize: 12, fontFamily:"Arial"}}> *All required</b>
            <br></br>
            {/* course group */}
            <Form.Group className="input-group mb-1" controlId="formCourseGroup">
              <label className="input-group-text" htmlFor="courseGroupSelection">course group</label>
              <Form.Select
                id="courseGroupSelection"
                ref={courseGroupRef}
                //onChange={courseGroupChange}
              >
                {courseGroupOptions}
              </Form.Select>
            </Form.Group>
            {/* subject group */}
            <Form.Group className="input-group mb-1" controlId="formSubjGroup">
              <label className="input-group-text" htmlFor="subjectGroupSelection">subject group</label>
              <Form.Select
                id="subjectGroupSelection"
                ref={subjGroupRef}
                //onChange={courseGroupChange}
              >
                {/*<option value="Choose..">Choose..</option>*/}
                {subjGroupOptions}
              </Form.Select>
            </Form.Group>
            {/* subject name */}
            <Form.Group className="mb-3" controlId="formSubjName">
              <Form.Select 
              ref={subjNameRef}
              onChange={fetchCode}
              >
                <option value="Choose subject..">Choose subject..</option>
                {subjNameOptions}
              </Form.Select>
              {/* <label>{showCode}</label> */}
            </Form.Group>

            {/* grade */}
            <Form.Group className="mb-3" controlId="formGrade">
              <Form.Label>GRADE</Form.Label>
              <Form.Select 
              // type="text" 
              // placeholder="Received Grade" 
              ref={gradeRef}
              >
                <option value="Choose grade..">Choose grade..</option>
                {gradeOptions}
              </Form.Select>
            </Form.Group>

            {/* RECORD DATA */}
            <Button variant="dark" onClick={addRecord}>
              ADD
            </Button>

          </Form>
          <br></br>
        </Col>
        {/* GRADE LIST TABLE */}
        <Col>
          <GradesTable data={dataItems} setDataItems={setDataItems} />
        </Col>
      </Row>
         
    </Container>
  );

}

export default App;
