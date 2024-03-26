import {Alert, View, Text, StyleSheet, Keyboard, TouchableOpacity, ScrollView, Button, TextInput, Platform } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon3 from 'react-native-vector-icons/Ionicons'
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Loader';
import Chart from './Chart';

export default function Expense(authToken) {
  let [loading, setLoading] = useState(false)

    const url = 'https://spendalyzerbackend.azurewebsites.net'

    const [uname, setUname] = useState('My')
    const [expenseData, setExpenseData] = useState([])

    // To store data
    const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error('Error storing data:', error);
    }
    };

    // To retrieve data
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

    // To remove data
    const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing data:', error);
    }
    };

    useEffect(() => {
        const fetchData = async () => {
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

        const expenseData = async () => {
            try {
                const getThisData = await getData('data');
                if (getThisData) {
                    const parsedData = JSON.parse(getThisData);
                    setExpenseData(parsedData);
                }
            } catch(error) {
                console.error('Error in user data:', error);
            }
        };
    
        fetchData();
        expenseData()
    }, []);
    


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

      let [mainEditBtn, setMainEditBtn] = useState({"month": null, bool:false})
      let [twoBtnShow, setTwoBtnShow] = useState({"index": null, bool:false})

      let [chosenIndex , setChosenIndex] = useState(-1) 
    function editMonthDiv(i){
        // console.log(chosenIndex);
        // console.log("i:",i);
        if(i !== chosenIndex){
            setChosenIndex(i)
            setVal(i)
        }else{
            setChosenIndex(-1)
            setVal(-1)
        }
    }
    
    function setVal(x){
        setMainEditBtn({"month":x, bool:true});
        setTwoBtnShow({"index":x, bool:true})
    }


    let [formTitle2, setFormTitle2] = useState('')
    let [formAmount2, setFormAmount2] = useState(''); 

    const handleTitleChange2 = (text) => {
        setFormTitle2(text)
    }
    const handleAmountChange2 = (text) => {
        setFormAmount2(text);
    }

    let [myFormVisible2, setMyFormVisible2] = useState(false)

    function closeForm2(){
        setMyFormVisible2(false)
        Keyboard.dismiss()
    }


    let [idToEdit, setIdToEdit] = useState(null)

    function editThis(x,y,z){
    
        setFormTitle2(x)
        setFormAmount2(y.toString())

        setMyFormVisible2(true)

        let id = z

        setIdToEdit(id)
    }

    function updExp(x,y){
        setLoading(true)
        let amt2
        if (formAmount2.trim() === "") {
            amt2 = ''
          } else {
            amt2 = parseFloat(formAmount2).toFixed(2)
          }

          if(isNaN(formAmount2) || formAmount2.trim() === '') {
              Alert.alert(
                  'Invalid Format',
                  'Amount must be a number.',
                  [
                      { text: 'OK' }
                    ],
                    { cancelable: false }
                    );
                    setLoading(false)
          } else{

              let data2 = {
                  "title": x,
                  "amount": parseFloat(amt2)
              }
              let id2 = idToEdit

              console.log(data2);
              console.log(typeof(amt2));

              fetch(url+'/expense/'+id2,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data2)
            })
            .then(response => response.json())
            .then(data =>{
                // console.log("UPDATED", data);
                Keyboard.dismiss()
                closeForm2()
                setFormTitle2('')
                setFormAmount2('')
                getDataByUser()
            })
            .catch(error => {
                console.log("UPDATE ERROR", error);
            })
          }
    }

    function deleteThis(x,y){
        console.log("hello", x);
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete "'+y+'"?',
            [
                {
                  text: 'No',
                  style: 'cancel'
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    setLoading(true)
                    const id = x;
                    fetch(url+'/expense/'+id,{
                        method: "DELETE",
                    })
                    .then(response => response.json())
                    .then(data =>{
                        console.log(data);
                        getDataByUser()
                    })
                    .catch(error => {
                        console.error("DELETE Error", error)
                    });
                  }
                }
              ],
              { cancelable: false }
        )

    }

    async function getDataByUser(){
        setLoading(true)
        setTwoBtnShow(false)
        setMainEditBtn(false)
        setChosenIndex(-1)

        try {
            const getThisUser = await getData('user');
            if (getThisUser) {
                const user2 = JSON.parse(getThisUser).username;
                // console.log("User2", user2);

                let fetchedData = await getExpByUser(user2)
    
                // console.log(fetchedData);
                setExpenseData(fetchedData)

            }
        } catch(error) {
            console.error('Error in user details:', error);
        }
    
      }

      async function getExpByUser(name) {
        return fetch(url+'/list/'+name, {
          method: 'GET'
        })
          .then(response => response.json())
          .then(data => {
            setLoading(false)
            storeData('data', JSON.stringify(data))
            return data; // Return the data inside the Promise chain
          })
          .catch(error => {
            console.log('Error in GET function', error);
            throw error; // Rethrow the error to propagate it
          });
      }

    let [myFormVisible, setMyFormVisible] = useState(false)

    function openForm(){
        console.log('open');
        setMyFormVisible(true)
    }
    
    function closeForm(){
        setMyFormVisible(false)
        setViewDate(false)
        setShowDate(false)
        setDate(new Date())
        Keyboard.dismiss()
    }

    let [formTitle, setFormTitle] = useState('')
    let [formAmount, setFormAmount] = useState(''); 

    const handleTitleChange = (text) => {
        setFormTitle(text)
    }
    const handleAmountChange = (text) => {
        setFormAmount(text);
    }

    const [date, setDate] = useState(new Date());
    // const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (selectedDate) => {
        const currentDate = selectedDate || date;
        console.log(currentDate);
        // setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        setShowDate(false)
        setViewDate(true)
    };

    function addExp(){
        setLoading(true)
        Keyboard.dismiss()
        let amt
        if (formAmount.trim() === "") {
            amt = ''
          } else {
            amt = parseFloat(formAmount).toFixed(2)
          }

          let currDate = date.toLocaleDateString()
          let newDate = currDate.split("/")[2]+"-"+currDate.split("/")[0].padStart(2,"0")+"-"+currDate.split("/")[1].padStart(2,"0")

          if(isNaN(formAmount) || formAmount.trim() === '') {
            Alert.alert(
                'Invalid Format',
                'Amount must be a number.',
                [
                    { text: 'OK' }
                  ],
                  { cancelable: false }
                  );
                  setLoading(false)
        } 
        else{
        let exp = {
            "title": formTitle,  
            "amount": amt,
            "date": newDate,
            "username": uname
        }

        fetch(url+'/expense',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exp)
        })
        .then(response => response.json())
        .then(data =>{
            console.log(data);
            setMyFormVisible(false)
            setFormTitle('')
            setFormAmount('')
            setDate(new Date())
            setShowDate(false)
            setViewDate(false)
            getDataByUser()
        })
        .catch(error => {
            console.error("POST Error", error)
        });

        console.log(exp);
    }
    }

    let [showDate, setShowDate] = useState(false)
    let [viewDate, setViewDate] = useState(false)

    let [showChart, setShowChart] = useState(false)

  return (<>
   {loading && <Loader />}
    <View style={Styles.myExpenses}>
    <ScrollView>
     {authToken && 
     <>
        <Text style={Styles.userDetails}>{uname}'s Expenses</Text>

        {/* viewModes  */}
        <View style={{display:'flex', flexDirection:'row', justifyContent:'center', gap:20, marginTop:20}}>
            <TouchableOpacity onPress={() => setShowChart(false)}> 
                <Text style={[Styles.modes, {backgroundColor:showChart?'white':'#228D57', color:showChart? 'black': '#E8E9C9'}]}>List</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowChart(true)}>
                <Text style={[Styles.modes, {backgroundColor:showChart?'#228D57':'white', color:showChart?'#E8E9C9':'black'}]}>Chart</Text>
            </TouchableOpacity>
        </View>

        {showChart ? 
            <Chart/>
        :
        <View style={Styles.listings}>
            {expenseData.length>0 ? 
                <View id='printDataNow' style={Styles.printDataNow}>
                    <View>
                        {expenseData.map((dataItem, index) => (
                            <View key={index} style={Styles.expMonth}>
                            <View style={Styles.monthHeader}>
                                <Text style={Styles.Text}>{allMonths2[dataItem.Month - 1]} {dataItem.Year}:</Text>
                                <Text style={Styles.Text}>${dataItem.MonthlyAmount.toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity style={Styles.editBtnPerMonth} onPress={() => editMonthDiv(index)}>
                            <Text> {(mainEditBtn.month==index && mainEditBtn.bool==true)? <Icon name='check-circle' color='#E8E9C9' size={22}/> : <Icon name='edit' color='#E8E9C9' size={20}/>}</Text>
                            </TouchableOpacity>
                            {dataItem.MonthData.map((monthDataItem, monthDataIndex) => (
                                <View key={monthDataIndex} style={Styles.expenseRow}>
                                <View style={Styles.headerRow}>
                                    <Text style={{fontSize:18}}>{allMonths2[monthDataItem.Date.split('-')[1] - 1]} {monthDataItem.Date.split('-')[2]}</Text>
                                    <Text style={{fontSize:18}}>${monthDataItem.DailyAmount.toFixed(2)}</Text>
                                </View>
                                <View style={Styles.outData}>
                                    {monthDataItem.Data.map((inDataItem, inDataIndex) => (
                                    <View key={inDataIndex} style={Styles.inData} id={inDataItem._id}>
                                        <Text style={{fontSize:16}}>{inDataItem.Title}</Text>
                                        <Text style={{fontSize:16, marginLeft:'auto', marginRight:10}}>${inDataItem.Amount.toFixed(2)}</Text>
                                        <View style={[Styles.twoBtns , {display: (index==twoBtnShow.index && twoBtnShow.bool==true)?  "flex" : "none"}]}>
                                            <TouchableOpacity onPress={() => editThis(inDataItem.Title, inDataItem.Amount, inDataItem._id)}>
                                                <Icon name='edit' color='green' size={18}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => deleteThis(inDataItem._id, inDataItem.Title)}>
                                                <Icon2 name='delete' size={20} color='#f66'/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    ))}
                                </View>
                                </View>
                            ))}
                            </View>
                        ))}
                        </View>
                    </View>
                    :
                    <Text style={{textAlign:'center', marginTop:30}}>** Create your first expense **</Text>
            }
        </View>
        }
        
    </>
    }
    </ScrollView>

    <TouchableOpacity style={[Styles.refreshBtn, {display: showChart?'none':'flex'}]} onPress={getDataByUser}>
        <Icon3 name='refresh' size={22} color='#E8E9C9'/>
    </TouchableOpacity>
    <TouchableOpacity style={[Styles.addForm, {display: showChart?'none':'flex'}]} onPress={openForm}>
        <Icon3 name='add' size={27} color='#E8E9C9'/>
    </TouchableOpacity>

    {/* add form  */}
        <View style={[Styles.formArea, { display: myFormVisible ? 'flex' : 'none' }]}>
            <View style={Styles.myForm}>
                <TouchableOpacity style={Styles.formButton} onPress={closeForm}>
                    <Text style={{color:'white'}}>X</Text>
                </TouchableOpacity>
                <View style={Styles.formItem}>
                    <Text numberOfLines={1} style={Styles.label}>Title:</Text>
                    <TextInput
                    style={Styles.input}
                    value={formTitle}
                    onChangeText={handleTitleChange}
                    />
                </View>
                <View style={Styles.formItem}>
                    <Text numberOfLines={1} style={Styles.label}>Amount:</Text>
                    <TextInput
                    style={Styles.input}
                    value={formAmount}
                    onChangeText={handleAmountChange}
                    keyboardType='numeric'
                    />
                </View>
                <View style={[Styles.formItem, {justifyContent:'center', alignItems:'center'}]}>
                  <TouchableOpacity onPress={() => setShowDate(true)}>
                    <Text style={[{fontSize:17, paddingHorizontal:20, paddingVertical:2, borderRadius:10, color:'black'}, {backgroundColor:viewDate?'lightgreen': '#bbb'}]}>Date</Text>
                  </TouchableOpacity>
                  {viewDate && <Text style={{fontSize:17}}>{date.toLocaleString().split(',')[0]}</Text>}
                    {showDate && 
                    <DateTimePickerModal
                    isVisible={showDate}
                    mode="date"
                    onConfirm={handleDateChange}
                    maximumDate={new Date()}
                    onCancel={() => {
                      console.log('cancel');
                      setShowDate(false);
                    }}
                    is24Hour={true}
                    // This prop will hide the cancel button
                    cancelButtonText=""
                  />
                }
                </View>

                <TouchableOpacity style={Styles.BtnForm} onPress={addExp}>
                    <Text style={{color: '#E8E9C9'}}>Create Expense</Text>
                </TouchableOpacity>          
            </View>
        </View>


        {/* edit form  */}
        <View style={[Styles.formArea, { display: myFormVisible2 ? 'flex' : 'none' }]}>
            <View style={Styles.myForm}>
                <TouchableOpacity style={Styles.formButton} onPress={closeForm2}>
                    <Text style={{color:'white'}}>X</Text>
                </TouchableOpacity>
                <View style={Styles.formItem}>
                    <Text numberOfLines={1}  style={Styles.label}>Title:</Text>
                    <TextInput
                    style={Styles.input}
                    value={formTitle2}
                    onChangeText={handleTitleChange2}
                    />
                </View>
                <View style={Styles.formItem}>
                    <Text numberOfLines={1}  style={Styles.label}>Amount:</Text>
                    <TextInput
                    style={Styles.input}
                    value={formAmount2}
                    onChangeText={handleAmountChange2}
                    keyboardType='numeric'
                    />
                </View>
                <TouchableOpacity style={Styles.BtnForm} onPress={() => updExp(formTitle2,formAmount2)}>
                    <Text style={{color: '#E8E9C9'}}>Update Expense</Text>
                </TouchableOpacity>         
            </View>
        </View>

    </View>
  </>
  )
}
        

const Styles = StyleSheet.create({
    Text:{
        fontSize:20,
        color:'#E8E9C9'
    },
    myExpenses:{
        flex:1,
    },
    userDetails:{
        textAlign:'center',
        marginTop:30,
        fontSize:25,
        fontWeight:'bold'
    },
    modes:{
        fontSize:16,
        width:80,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:2,
        borderWidth:1,
        borderColor:'gray',
        borderRadius:10,
        textAlign:'center'
    },  
    listings:{
        width: '100%',
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    printDataNow:{
        backgroundColor: 'white',
        placeSelf: 'center',
        width: '90%',
        borderColor:'black',
        borderWidth:1,
        marginBottom: 60,
    },
    expMonth: {
        marginBottom: 30,
        position: 'relative',
      },
      monthHeader: {
        width:'100%', 
        height:50, 
        backgroundColor:'#228D57',
        display:'flex', 
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'center',
        gap: 20,
      },
      editBtnPerMonth:{
        position: 'absolute',
        top: 15,
        // top: 65,
        right: 18,
        // right: 30,
        background: 'transparent',
        color: 'black',
        border: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      expenseRow: {
        width: "100%",
        paddingVertical: 20,
        paddingHorizontal: 30,
      },
      headerRow: {
        width: "100%",
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        borderBottomWidth:1,

      },
      outData: {
        width: '100%',
        marginTop: 20,
        paddingVertical: 0,
        paddingHorizontal: 10,
      },
      inData: {
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center',
        // backgroundColor:'red',
        // justifyContent:'space-between'
      },
      twoBtns: {
        // display: "none",
        flexDirection:'row',
        alignItems:'center',
        gap: 10,
        position:'relative',
        left:10
      },
      refreshBtn:{
        position:'absolute',
        bottom:30,
        right:100,
        width:50,
        height:50,
        borderRadius:50,
        backgroundColor:'#228D57',
        alignItems:'center',
        justifyContent:'center',
        color:'#E8E9C9',
        borderWidth:1,
        borderBlockColor:'black',
        elevation:4
      },
      addForm:{
        position:'absolute',
        bottom:30,
        right:30,
        width:50,
        height:50,
        borderRadius:50,
        backgroundColor:'#228D57',
        alignItems:'center',
        justifyContent:'center',
        color:'#E8E9C9',
        borderWidth:1,
        borderBlockColor:'black',
        elevation:4
      },
      formArea:{
        backgroundColor: 'rgba(0,0,0,0.4)',
        position: 'absolute',
        top:0,
        left: 0,
        width: '100%',
        // height:'100%',
        height:'100%',
        zIndex: 3,
        justifyContent:'center',
        alignItems:'center',
      },
      myForm:{
        backgroundColor: '#eee',
        width:"90%",
        zIndex: 2,
        display: 'flex',
        flexDirection:'column',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
        paddingTop: 60,
        paddingBottom:10,
        gap: 20,
        marginTop:-80
      },
      formButton:{
        position: 'absolute',
        top: 15,
        right: 15,
        width: 20,
        height: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(225, 103, 103)',
      },
      formItem:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        gap: 10,
        alignItems:'center'
      },
      label:{
        fontSize:17,
        width:70,
        textAlign:'right',
    },
    input:{
        paddingLeft:8,
        display:'flex',
        flexGrow:1,
        borderWidth:.2,
        height:25,
        backgroundColor:'white',
      },
      BtnForm:{
        backgroundColor: '#228D57',
        paddingHorizontal: 30,
        paddingVertical:6,
        borderRadius:10,
        marginTop:15
      }
})