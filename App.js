import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function App() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const apiCall = (val) => {
    setLoading(true);
    axios
      .get(`http://www.boredapi.com/api/activity?type=${val}`)
      .then((res) => {
        setLoading(false);
        const { data } = res;
        setText(data.activity);

        storeData({ selectedValue: val, dataText: data.activity });
      })
      .catch((e) => {
        console.log(e, '@api fetch error');
      });
  };

  const refresh = (value) => {
    apiCall(value);
  };

  const storeData = async (value) => {
    console.log({ value });
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
    } catch (e) {
      // saving error
      console.log(e, '@data stotage error');
    }
  };

  const getData = async () => {
    try {
      const valueData = await AsyncStorage.getItem('@storage_Key');
      const filteredValue = JSON.parse(valueData);
      if (valueData !== null) {
        // value previously stored
        const { selectedValue, dataText } = filteredValue;

        setValue(selectedValue);
        setText(dataText);
      }
    } catch (e) {
      // error reading value
      console.log(e, '@error fetching data');
    }
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        items={[
          {
            label: 'education',
            value: 'education',
          },
          {
            label: 'recreational',
            value: 'recreational',
          },
          {
            label: 'social',
            value: 'social',
          },
          {
            label: 'diy',
            value: 'diy',
          },
          {
            label: 'charity',
            value: 'charity',
          },
          {
            label: 'cooking',
            value: 'cooking',
          },
          {
            label: 'relaxation',
            value: 'relaxation',
          },
          {
            label: 'music',
            value: 'music',
          },
          {
            label: 'busywork',
            value: 'busywork',
          },
        ]}
        defaultValue={value}
        containerStyle={{ height: 40, width: 300 }}
        style={{ backgroundColor: '#fafafa' }}
        itemStyle={{
          justifyContent: 'flex-start',
        }}
        dropDownStyle={{ backgroundColor: '#fafafa' }}
        onChangeItem={(item) => {
          setValue(item.value);
          apiCall(item.value);
        }}
      />
      <Text style={styles.activity}> {loading ? 'loading...' : `${text}`}</Text>
      <TouchableOpacity
        style={styles.refresh}
        onPress={() => {
          refresh(value);
        }}
      >
        <Text style={styles.text}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activity: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 15,
  },
  refresh: {
    marginTop: 10,
    backgroundColor: '#0084FF',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
