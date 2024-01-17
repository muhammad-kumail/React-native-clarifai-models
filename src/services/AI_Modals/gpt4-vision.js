import axios from 'axios';
import {PAT, clarifAI_BaseURL} from '../../utils/constants';

export function gpt4_vision({userID, appId, modelId, modelVersionId, image}) {
  return new Promise(async (resolve, reject) => {
    const url = `${clarifAI_BaseURL}models/${modelId}/versions/${modelVersionId}/outputs`;
    const requestData = {
      user_app_id: {
        user_id: userID,
        app_id: appId,
      },
      inputs: [
        {
          data: {
            text: {
              url: image, //'https://images.all-free-download.com/images/graphiclarge/iphone_6_sample_photo_566464.jpg',
            },
          },
        },
      ],
    };

    const headers = {
      Authorization: `Key ${PAT}`,
      'Content-Type': 'application/json',
    };

    await axios
      .post(url, requestData, {headers})
      .then(response => {
        resolve({
          result: response.data?.outputs[0],
          message: 'Text generated successfully',
        });
      })
      .catch(err => {
        reject({result: err, message: 'Text generation failed'});
      });
  });
}
