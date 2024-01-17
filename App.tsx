import React from 'react';
import {StyleSheet, View} from 'react-native';
import Camera from './src/screens/Camera';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Camera />
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
});

export default App;
