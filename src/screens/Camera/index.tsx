import React, {useState, useRef} from 'react';
import {
  Dimensions,
  Alert,
  StyleSheet,
  ActivityIndicator,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {CaptureButton} from '../../components';
import axios from 'axios';
import {capitalize} from '../../utils/helper';
import {PAT, defaultImg} from '../../utils/constants';
import {dall_e} from '../../services/AI_Modals/dall-e';
import {gpt4_vision} from '../../services/AI_Modals/gpt4-vision';
const Clarifai = require('clarifai');

const Camera: React.FC = () => {
  const cameraRef = useRef<RNCamera | null>(null);
  //   const [identifedAs, setIdentifedAs] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState('');
  const [img, setImg] = useState('');

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);

      const options = {
        base64: true,
      };

      const data = await cameraRef.current.takePictureAsync(options);
      cameraRef.current.pausePreview();
      onGenerateText(data.base64);
      // identifyImage(data.base64);
    }
  };
  const displayAnswer = (identifiedImage: object[]) => {
    setLoading(false);

    Alert.alert(
      'Prediction',
      identifiedImage
        .map((item: any) =>
          capitalize(`${item.name} (${(item.value * 100).toFixed(1)}%)`),
        )
        ?.join('\n'),
      [{text: 'OK'}],
    );

    if (cameraRef.current) {
      cameraRef.current.resumePreview();
    }
  };

  const identifyImage = async (imageData: string | undefined) => {
    const apiKey = PAT;
    const modelVersionID = 'aa7f35c01e0642fda5cf400f543e7c40';
    const apiUrl = `https://api.clarifai.com/v2/users/clarifai/apps/main/models/general-image-recognition/versions/${modelVersionID}/outputs`;

    const requestData = {
      inputs: [
        {
          data: {
            image: {
              base64: imageData,
            },
          },
        },
      ],
    };

    const headers = {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    };

    axios
      .post(apiUrl, requestData, {headers})
      .then(response => {
        console.log(
          JSON.stringify(
            response.data?.outputs[0]?.data?.concepts
              ?.map((item: any) => item.name)
              .join(', '),
          ),
        );
        displayAnswer(response.data?.outputs[0]?.data?.concepts);
      })
      .catch(err => {
        Alert.alert('Alert', err.message, [
          {
            text: 'Ok',
            onPress: () => {
              cameraRef.current?.resumePreview();
            },
          },
        ]);
        console.log('error:', err);
        setLoading(false);
      });
  };
  const onGenerateImage = (value: string) => {
    console.log('value:', value);
    setLoading(true);
    dall_e({
      userID: 'openai',
      appId: 'dall-e',
      modelId: 'dall-e-3',
      modelVersionId: 'dc9dcb6ee67543cebc0b9a025861b868',
      text: value,
    })
      .then((res: {result: string | any; message: string}) => {
        console.log(
          '🚀 ~ onGenerateImage ~ res.result:',
          res.result?.data?.image,
        );
        setImg(`data:image/png;base64,${res.result?.data?.image?.base64}`);
      })
      .catch((err: {result: string; message: string}) => {
        console.log(
          '🚀 ~ onGenerateImage ~ err.result:',
          JSON.stringify(err.result),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onGenerateText = (image: string | undefined) => {
    setLoading(true);
    gpt4_vision({
      userID: 'openai',
      appId: 'chat-completion',
      modelId: 'openai-gpt-4-vision',
      modelVersionId: '266df29bc09843e0aee9b7bf723c03c2',
      image: `data:image/png;base64,${image}`,
    })
      .then((res: {result: string | any; message: string}) => {
        console.log(
          '🚀 ~ onGenerateText ~ res.result:',
          JSON.stringify(res.result),
        );
        alert('res:', res.result);
      })
      .catch((err: {result: string | any; message: string}) => {
        console.log('🚀 ~ onGenerateText ~ err.result:', err.result);
        alert('err:', err.result);
      })
      .finally(() => {
        setLoading(false);
        cameraRef.current?.resumePreview();
      });
  };

  return (
    <RNCamera ref={cameraRef} style={styles.preview}>
      <ActivityIndicator
        size="large"
        style={styles.loadingIndicator}
        color="#fff"
        animating={loading}
      />
      <CaptureButton buttonDisabled={loading} onPress={takePicture} />
    </RNCamera>
    // <View style={styles.preview}>
    //   <TextInput
    //     style={styles.textinput}
    //     placeholder="Enter prompt"
    //     onChangeText={e => {
    //       // console.log('e:', e);
    //       setText(e);
    //     }}
    //     value={text}
    //   />
    //   <TouchableOpacity
    //     style={styles.btn}
    //     onPress={() => onGenerateImage(text)}>
    //     {loading ? (
    //       <ActivityIndicator size={'small'} color={'white'} />
    //     ) : (
    //       <Text style={styles.btnText}>Generate</Text>
    //     )}
    //   </TouchableOpacity>
    //   <Image source={{uri: img ? img : defaultImg}} height={300} width={300} />
    // </View>
  );
};

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    // justifyContent: 'flex-start',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  loadingIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    minWidth: '80%',
    paddingHorizontal: 10,
  },
  btn: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 6,
    margin: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Camera;
