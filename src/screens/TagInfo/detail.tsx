import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import {useNavigation, useRoute} from '@react-navigation/native';
import {postRemarkAndConditionCode, tagInfo} from '../../services/tagInfo';
import {CONDITION_CODE_OPTIONS} from '../../utils/data';
import {Dropdown} from 'react-native-element-dropdown';
import ModalApp from '../../compnents/ModalApp';
import PreventBackNavigate from '../../utils/preventBack';

const TagInfoDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {listrfid} = route.params;

  const [datas, setDatas] = useState([]);
  const [wmsSerializeditem, setWmsSerializeditem] = useState([]);
  const [wmsBin, setWmsBin] = useState();
  const [loading, setLoading] = useState(false); // <-- Add loading state
  const [remark, setRemark] = useState('');
  const [conditionCode, setConditionCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const getInfo = async () => {
    setLoading(true);
    tagInfo(listrfid[listrfid.length - 1])
      .then((res: any) => {
        if (res.member.length === 0) {
          navigation.navigate('TagInfo');

          // navigation.goBack();
          Alert.alert(
            'No Data',
            'No data found for this PO number.',
            // [{text: 'OK', onPress: () => navigation.goBack()}],
            // {cancelable: false},
          );
        }
        setDatas(res.member[0]);

        if (res.member[0].status === 'Blank') {
          navigation.navigate('TagInfo');

          // navigation.goBack();
          ToastAndroid.show(
            `${listrfid[listrfid.length - 1]} RFID Blank`,
            ToastAndroid.SHORT,
          );
          setLoading(false);
          return;
        }

        if (res.member[0]?.wms_serializeditem) {
          setWmsSerializeditem(res.member[0]?.wms_serializeditem[0] || []);
          setRemark(res.member[0]?.wms_serializeditem[0].remark || '');
          setConditionCode(
            res.member[0]?.wms_serializeditem[0].conditioncode || '',
          );
        }
        if (res.member[0]?.wms_bin) {
          setWmsBin(res.member[0]?.wms_bin[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    getInfo();
  }, []);

  const handleUpdate = async (id: string) => {
    // TODO: Implement update logic
    postRemarkAndConditionCode(id, {
      remark: remark,
      conditioncode: conditionCode,
    })
      .then(res => {
        ToastAndroid.show('Update successful', ToastAndroid.SHORT);
        getInfo(); // Refresh data after update
      })
      .catch(err => {
        console.error('Error updating remark and condition code:', err);
        ToastAndroid.show('Update failed', ToastAndroid.SHORT);
        Alert.alert('Error', err.Error.message || 'Undientified error');
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PreventBackNavigate toScreen="TagInfo" />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#3674B5" />
        </View>
      ) : (
        <View style={styles.flexContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View className="mt-2" style={styles.container}>
              <Text style={styles.label}>Tag Code</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={datas?.tagcode || ''}
                editable={false}
                placeholder="Tag Code"
                placeholderTextColor="#b0b0b0"
              />
              <Text style={styles.label}>Serial Number</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={
                  wmsSerializeditem?.serialnumber || wmsBin?.serialnumber || ''
                }
                editable={false}
                placeholder="Serial Number"
                placeholderTextColor="#b0b0b0"
              />
              {/* info item / bin */}
              {/* tag Asign to bin */}
              {wmsBin ? (
                <View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Bin</Text>
                    <Text style={styles.infoValue}>{wmsBin?.bin}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{wmsBin?.storeloc}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Zone</Text>
                    <Text style={styles.infoValue}>{wmsBin?.wms_zone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Area</Text>
                    <Text style={styles.infoValue}>{wmsBin?.wms_area}</Text>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Item Number</Text>
                    <Text style={styles.infoValue}>
                      {wmsSerializeditem?.itemnum}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Item Name</Text>
                    <Text style={styles.infoValue}>
                      {wmsSerializeditem?.description}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Stored Qty</Text>
                    <Text style={styles.infoValue}>
                      {wmsSerializeditem?.qtystored}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Issue Unit</Text>
                    <Text style={styles.infoValue}>
                      {wmsSerializeditem?.unitstored}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Bin</Text>
                    <Text style={styles.infoValue}>
                      {wmsSerializeditem?.wms_bin}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>
                      {wmsSerializeditem?.storeroom}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Condition Code</Text>
                    <View style={styles.conditionBox}>
                      <Dropdown
                        // style={{height: 40, width: '100%'}}
                        data={CONDITION_CODE_OPTIONS}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Condition Code"
                        value={conditionCode}
                        onChange={item => setConditionCode(item.value)}
                      />
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Remark</Text>
                    <TextInput
                      style={[styles.input, styles.remarkInput]}
                      value={remark}
                      onChangeText={setRemark}
                      multiline
                    />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
          {!wmsBin && (
            <View style={styles.buttonContainerFixed}>
              <ButtonApp
                label="Update"
                onPress={() =>
                  // handleUpdate(wmsSerializeditem.wms_serializeditemid)
                  setModalVisible(true)
                }
                size="large"
                color="primary"
              />
            </View>
          )}
        </View>
      )}
      <ModalApp
        visible={modalVisible}
        content="Do you want to update remark and condition code?"
        onClose={() => setModalVisible(false)}
        title="Confirmation"
        type="confirmation"
        onConfirm={() => {
          handleUpdate(wmsSerializeditem.wms_serializeditemid);
          setModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    // marginTop: 10,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#b0b0b0',
    marginBottom: 8,
    // backgroundColor: '#f8f9fa',
  },
  disabledInput: {
    color: '#b0b0b0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 6,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 15,
    flex: 1,
  },
  infoValue: {
    color: '#222',
    fontSize: 15,
    flex: 1.5,
    textAlign: 'left',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  buttonContainerFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  conditionBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // backgroundColor: '#e7f0ff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // width: 100,
    width: '60%',
    // textAlign: 'left',
  },
  conditionText: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 15,
  },
  remarkInput: {
    height: 60,
    textAlignVertical: 'center',
    width: '60%',
    color: 'black',
  },
});

export default TagInfoDetailScreen;
