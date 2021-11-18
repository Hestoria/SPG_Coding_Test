import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button, Container,Row, Col } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import BGIMG from './img/bg_img.png';
import Charts  from './Charts';



function App() {
  const [datatype, setdatatype] = useState('water');
  const [label, setlabel] = useState('water');
  const [StartDate, setStartDate] = useState(new Date("2010-01-01"));
  const [EndDate, setEndDate] = useState(new Date("2020-12-31"));
  const [datalist,setdatalist] = useState({mapedData:[]});
  const style = {
    chars:{
      height:'45vh',
      padding:10
    },
    bg:{
      backgroundImage: `url(${BGIMG})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height:'100%',
    },
    content:{
      height:'55vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    container:{
      height:'100%',
      textAlign:'center',
    },
    row:{
      height:'30%',
    },
    inputlabel:{
     color: '#fff',
    },
    desc:{
      fontSize: 20,
     color: '#fff',
     fontWeight: 'bold'
    }
  }
  const fetchData = () => {
    let URL = `http://[::1]:3000/${datatype}-bill-data`;
    let FILTER = `?filter[where][year][between][0]=${StartDate.getFullYear()}&filter[where][year][between][1]=${EndDate.getFullYear()}&filter[where][month][between][0]=${StartDate.getMonth()}&filter[where][month][between][1]=${EndDate.getMonth()}`;
    //fetch data form backend
    fetch(URL+FILTER)
      .then((response) => response.json())
      .then((datas) =>{
        mapedData(datas);
      })
      .catch((err)=> console.log(err));
  }
  const mapedData = (datas) => {
    const mappingdata = new Map();
    datas.forEach((data)=>{
      var temp;
      if(datatype === 'gas'){
          temp = Number(data.g_j_consumption);
          setlabel('Consumption (gj)');
      }else if(datatype === 'electricity'){
          temp = Number(data.k_wh_consumption);
          setlabel('Consumption (kwh)');
      }else{
          temp = Number(data.m_3_consumption);
          setlabel('Consumption (m^3)');
      }
  
      if(mappingdata.get(data.month+'/'+data.year)){
        mappingdata.set(data.month+'/'+data.year, Number(mappingdata.get(data.month+'/'+data.year)) + temp);
      }else{
        mappingdata.set(data.month+'/'+data.year, temp);
      }
    })
    // create a temp list and push to state
    var seriesData = [];
    var xAxisCategories = [];
    mappingdata.forEach((val,key)=>{
      seriesData.push(val);
      xAxisCategories.push(key);
    })
    // push in to state
    setdatalist({mapedData:{seriesData,xAxisCategories}});
  }
  
  useEffect(() => {
    fetchData();
  }
  , [datatype,StartDate,EndDate])

  return (
    <div className="App" style={style.bg}>
      <div className="Charts" style={style.chars}>
        <Charts datalist={datalist} datatype={datatype} label={label} />
      </div>
      <div style={style.content}>
        <Container fluid="md" style={style.container}>
          <Row style={style.row}>
            <Col><p style={style.desc}>Please click the button and select the range of data.</p></Col>
          </Row>
          <Row style={style.row}>
            <Col><Button variant="outline-light" onClick={()=>setdatatype("water")}>WATER</Button></Col>
            <Col><Button variant="outline-light" onClick={()=>setdatatype("gas")}>GAS</Button></Col>
            <Col><Button variant="outline-light" onClick={()=>setdatatype("electricity")}>ELECTRICITY</Button></Col>
          </Row>
          <Row style={style.row}>
            <Col>
              <p style={style.inputlabel}>StartDate:</p>
              <DatePicker
              selected={StartDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date("2010-01-01")}
              maxDate={new Date("2020-12-31")}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              showFullMonthYearPicker
              showFourColumnMonthYearPicker
              />
              </Col>
            <Col>
              <p style={style.inputlabel}>EndDate:</p>
              <DatePicker
                selected={EndDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="MM/yyyy"
                minDate={new Date("2010-01-01")}
                maxDate={new Date("2020-12-31")}
                showMonthYearPicker
                showFullMonthYearPicker
                showFourColumnMonthYearPicker
                />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
