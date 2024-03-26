import { View, Text } from 'react-native'
import React from 'react'
import { Dimensions } from "react-native";
import { LineChart} from "react-native-chart-kit";
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import Loader from './Loader';

export default function Chart() {

    const url = 'https://spendalyzerbackend.azurewebsites.net'


    let [loading, setLoading] = useState(false)
   
    let [selMonth, setSelMonth] = useState()

    const allMonths2 = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

    const screenWidth = Dimensions.get('window').width

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#fff",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        strokeWidth: 1,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
    };


    const getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
            return value;
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
        };

        let [apiData,setApiData] = useState({})
        
        let [uname,setUname] = useState('')

        let [filterMonth, setFilterMonth] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const getThisUser = await getData('user');
                if (getThisUser) {
                    const thisUsername = JSON.parse(getThisUser).username;
                    // console.log("ThisUsername", thisUsername);
                    setUname(thisUsername);
                }
            } catch(error) {
                console.error('Error in user details:', error);
            }
        };

        const fetchData = async () => {
            try {
                const getThisData = await getData('data');
                if (getThisData) {
                    const data2 = JSON.parse(getThisData);
                    // console.log(data2);
                    let filterMonthData = []
                    for (let i=0;i<data2.length;i++){
                        filterMonthData.push({
                            label:`${allMonths2[data2[i].Month-1]} ${data2[i].Year}`, 
                            value: `${data2[i].Year}-${(data2[i].Month).toString().padStart(2,'0')}`
                        })
                    }
                    // console.log("FMD", filterMonthData);
                    setFilterMonth(filterMonthData)
                    // setSelMonth(filterMonthData[0].value)

                }
            } catch(error) {
                console.error('Error in user details:', error);
            }
        };
    
        fetchUser();
        fetchData()
    },[])



    let [showKey, setShowKey] = useState([])
    let [showVal, setShowVal] = useState([])

    function handleChart(x){
        console.log(x);
        if(x === 'none'){
            setShowChart(false)
            setSelMonth('')
        }
        else{
            setSelMonth(x)
        setLoading(true)

        console.log('x', x);

        fetch(url+'/graph/'+x,{
            method: "GET" 
            })
            .then(response => response.json())
            .then(data2 => {
                
                let data = data2.filter(d => d.username === uname)
    
                let xy={}
                data.forEach(item => {
                    xy[item.Date] = item.DailySum.toFixed(2)
                });
            
                console.log("xyNow", xy);

                let arr1 = []
                let arr2 = []
                for(let key in xy){
                    arr1.push(key.split('-')[2]);
                    arr2.push(parseFloat(xy[key]))
                } 


                console.log(arr1);
                console.log(arr2);

                setShowKey(arr1)
                setShowVal(arr2)

                drawChart(arr1, arr2)          

                // setLoading(false)
                // drawChart(xy)
                
            })
            .catch(error => {
                console.log("Error in GET function", error);
            })

        }
    }

    let [showChart, setShowChart] = useState(false)

    let [chartdata, setChartdata] = useState({
        labels: [""],
        datasets: [
          {
            data: [0],
            color: (opacity=1) => `#228D57`
          }
        ]
      })

    function drawChart(x,y){
        
        setChartdata({
        labels: x,
        datasets: [
            {
                data: y,
                color: (opacity=1) => `#228D57`
            }
        ]
        })
        
        setShowChart(true)
        setLoading(false)
    }


  return (
  <>  
  {loading && <Loader />}
    <View style={{ marginHorizontal:20, paddingTop:25, justifyContent:"flex-start", alignItems:"center"}}>
      
      <Picker
        style={{ flex:1, width:200, backgroundColor:'white'}}
        onValueChange={handleChart}
        selectedValue={selMonth}
        >
        <Picker.Item 
        label="Select" 
        value="none" 
        style={{fontSize:14}}
        />
        {filterMonth.map((item, index) => (
            <Picker.Item
            label={item.label}
            value={item.value}
            key={index}
            style={{fontSize:14}}
            />
        ))}
        </Picker>
   
      <View style={{display:'flex', marginTop:0, marginHorizontal:20, paddingTop:15, justifyContent:"center", alignItems:"center"}}>
        
        {showChart ?
        <>
        <View style={{display:'flex', alignSelf:'flex-end', marginBottom:5, paddingRight:15}}>
            <Text style={{fontSize:13, fontStyle:'italic'}}>X: Date</Text>
            <Text style={{fontSize:13, fontStyle:'italic'}}>Y: Amount</Text>
        </View>
        <LineChart
        data={chartdata}
        width={screenWidth - 20}
        height={380}
        chartConfig={chartConfig}
        yAxisLabel= {"$"}
        />
        </> 
        :
        <View style={{height:380}}></View>
        }
        
      </View>

      
    </View>
    </>
  )
}