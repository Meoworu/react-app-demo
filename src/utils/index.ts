import { SceneInfoType } from '@/api/type';

export function guid() {
  const res = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return res;
}

export function getSourcePath() {
  return window.commonConfig?.source ?? '';
}

export const defaultSceneId = 'p0-1';

export const getCurrentSceneId = (scene?: { sceneInfo: SceneInfoType }) =>
  scene?.sceneInfo.slice(-1)[0].sceneId ?? defaultSceneId;

export async function sleep(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, Math.max(time, 0));
  });
}

export function getUrlParameter(key: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) ?? '';
}
