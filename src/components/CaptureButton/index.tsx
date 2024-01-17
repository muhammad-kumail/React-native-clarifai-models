import React from 'react';
import {StyleSheet, TouchableHighlight, Text} from 'react-native';

interface CaptureButtonProps {
  buttonDisabled: boolean;
  onPress: () => void;
}

const CaptureButton: React.FC<CaptureButtonProps> = props => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={[
        styles.captureButton,
        // eslint-disable-next-line react-native/no-inline-styles
        props.buttonDisabled && {backgroundColor: 'gray'},
      ]}
      disabled={props.buttonDisabled}>
      <Text style={styles.text}>Capture</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  captureButton: {
    marginBottom: 30,
    width: 160,
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: 'lime',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default CaptureButton;
