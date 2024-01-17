import axios from 'axios';
import {PAT, clarifAI_BaseURL} from '../../utils/constants';

export function dall_e({userID, appId, modelId, modelVersionId, text}) {
  return new Promise(async (resolve, reject) => {
    const url = `${clarifAI_BaseURL}users/${userID}/apps/${appId}/models/${modelId}/versions/${modelVersionId}/outputs`;
    const requestData = {
      inputs: [
        {
          data: {
            text: {
              raw: text,
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
          message: 'Image generated successfully',
        });
      })
      .catch(err => {
        reject({result: err, message: 'Image generation failed'});
      });
  });
}
