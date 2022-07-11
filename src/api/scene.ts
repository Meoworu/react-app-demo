import { SceneType } from './type';
import { guid } from '@/utils';

let sessionId = guid();

export function refreshSessionId() {
  sessionId = guid();
}

const isHttps = window.location.protocol === 'https:';

function getReplyUrl() {
  let replyUrl = `http://commercial-virtualhuman-hub.trafficmanager.cn/api/hub/organizations/org-cx-sales/agents/62c42e8a3b7b12c7dc08e93c/sessions/${sessionId}`;
  if (isHttps) {
    replyUrl = `https://commercial-virtualhuman.xiaoice.com/api/hub/organizations/org-cx-sales/agents/62c42e8a3b7b12c7dc08e93c/sessions/${sessionId}`;
  }
  return replyUrl;
}

interface sceneQueryType {
  text: string;
  currentSceneInfo: {
    sceneId: string;
  };
}

export async function getNextScenes(sceneQuery: sceneQueryType) {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(sceneQuery),
    redirect: 'follow',
  } as const;
  try {
    const response = await fetch(getReplyUrl(), requestOptions);
    const { ok } = response;
    const sceneRes = (await response.json()) as SceneType;
    if (!ok) {
      throw Error((sceneRes as any).errmsg);
    }
    if (!sceneRes) {
      throw Error('请求结果有误');
    }
    return sceneRes;
  } catch (e) {
    console.log('请求失败', e);
  }
}
