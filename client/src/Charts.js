import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const Charts = ({datalist,datatype,label}) => {
    const options = {
        title: {
          text: `Untility Bill Data`,
        },
        xAxis: {
            categories: datalist.mapedData.xAxisCategories,
        },
        yAxis: {
            labels: {// eslint-disable-next-line 
                format: "${text}"
            },
            title: {
                text: label
            }
        },
        series: [{
            data: datalist.mapedData.seriesData,
            name: `${datatype.toUpperCase()}`,
        }]
      } 
    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}

export default Charts
