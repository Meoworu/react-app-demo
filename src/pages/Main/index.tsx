import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { getNextScenes, refreshSessionId } from '@/api/scene';
import { SceneType } from '@/api/type';
import { GlobalContext } from '@/components/Layout';
import { recordStatusMap } from '@/components/RecordingTips';
import { SceneForm } from '@/components/SceneLayout';
import { defaultSceneId, getCurrentSceneId } from '@/utils';
import closeIcon from '@/assets/images/close.png';
import './index.less';

const firstSceneQuery = ['开始', defaultSceneId] as const;

const getSceneQuery = (text: string, sceneId: string) => ({
  text,
  currentSceneInfo: {
    sceneId,
  },
});

interface playQueueItemType {
  text: string;
  displayText?: string;
  callback?: () => void;
  sceneId: string;
}

// 控制播放版本，避免不同版本的播放队列冲突
let currentPlayVersion = 0;

export const Main = memo(() => {
  const globalContext = useContext(GlobalContext);
  const { currentHuman, setIsShowForm } = globalContext;
  const [currentScene, setCurrentScene] = useState<SceneType>();
  const [currentSceneId, setCurrentSceneId] = useState<string>(getCurrentSceneId(currentScene));
  const playQueuesRef = useRef<playQueueItemType[]>([]);

  const playText = useCallback(
    async (text: string, displayText?: string, callback?: () => void, lastText?: string) =>
      await currentHuman?.playTextAsync(text, {
        displayText: displayText,
        onPlayStartOnce: () => {
          if ((displayText ?? text) !== lastText) {
            currentHuman.showText?.(displayText ?? text);
          } else {
            currentHuman.showText?.(displayText ?? text, 'immediate');
          }
        },
        onPlayEndOnce: callback,
      }),
    // TODO:测试代码，省去播放音频时间，需要将上面的内容注释掉改执行下面的部分
    // {
    //   currentHuman?.showText?.(displayText ?? text);
    //   callback?.();
    // },
    [currentHuman]
  );

  const startPlayTexts = async (isSessionEnd: boolean) => {
    currentHuman?.stopRecord();
    await currentHuman?.pause?.();
    currentHuman?.closeText?.();
    let lastText = '';
    // 每当执行一次该函数就更新播放版本，则之前的播放结束后，不再继续播放原有队列里的内容
    const playVersion = ++currentPlayVersion;
    while (playQueuesRef.current.length > 0) {
      if (playVersion !== currentPlayVersion) {
        return;
      }
      const item = playQueuesRef.current.shift();
      if (!item) {
        return;
      }
      const { text, displayText, callback, sceneId } = item;
      // 播放前触发表单切换
      setCurrentSceneId(sceneId);
      if (text) {
        await playText(text, displayText ?? text, callback, lastText);
        lastText = displayText ?? text;
      }
    }
    if (isSessionEnd) {
      if (playQueuesRef.current.length === 0) {
        initSession();
      }
    } else {
      currentHuman?.startRecord();
    }
  };

  const loadScenes = async (text: string, sceneId: string) => {
    const sceneQuery = getSceneQuery(text, sceneId);
    const sceneRes = await getNextScenes(sceneQuery);
    if (sceneRes) {
      setCurrentScene(sceneRes);
    }
  };

  const initSession = useCallback(async () => {
    window.parent?.postMessage?.('close', '*');
    currentPlayVersion++;
    refreshSessionId();
    setCurrentScene(undefined);
    setCurrentSceneId(defaultSceneId);
    setIsShowForm && setIsShowForm(false);
    if (currentHuman) {
      currentHuman.onGetAsrText = async (text: string) => {
        currentHuman.showText(text, 'immediate');
        setTimeout(() => {
          loadScenes(text, defaultSceneId);
        }, 300);
        return false;
      };
      await currentHuman.pause?.();
      currentHuman.closeText?.();
      currentHuman.stopRecord?.();
    }
    globalContext?.setRecordingStatus?.(recordStatusMap.normal);
  }, [globalContext?.setRecordingStatus]);

  const quit = useCallback(
    (e: any) => {
      e.stopPropagation();
      initSession();
    },
    [initSession]
  );

  // 加载初始化播放内容
  useEffect(() => {
    loadScenes(...firstSceneQuery);
    const handleMessage = (e: any) => {
      const msg = e.data;
      if (msg === 'startRecord') {
        currentHuman?.startRecord();
      } else if (msg === 'startPlay') {
        loadScenes(...firstSceneQuery);
      }
    };
    const handleRecordByClick = () => {
      currentHuman?.startRecord();
    };
    window.addEventListener('message', handleMessage);
    window.addEventListener('click', handleRecordByClick);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('click', handleRecordByClick);
    };
  }, []);

  // 当sceneId更新时，切换成对应的form展示
  useEffect(() => {
    if (!currentHuman) return;
    if (currentSceneId !== 'p0-1') {
      setIsShowForm && setIsShowForm(true);
    }
    currentHuman.onGetAsrText = async (text: string) => {
      currentHuman.showText(text, 'immediate');
      setTimeout(() => {
        loadScenes(text, currentSceneId);
      }, 300);
      return false;
    };
  }, [currentSceneId]);

  // 每当变更scene时，按照sceneInfo中的内容去轮播
  useEffect(() => {
    if (!currentScene) return;
    const { isSessionEnd, sceneInfo } = currentScene;
    playQueuesRef.current = [];
    sceneInfo.forEach((scene) => {
      if (Array.isArray(scene.audioText)) {
        scene.audioText.forEach((text) => {
          playQueuesRef.current.push({
            sceneId: scene.sceneId,
            displayText: scene.displayText,
            text,
          });
        });
      }
    });
    startPlayTexts(isSessionEnd);
  }, [currentScene]);

  useEffect(() => {
    render(<img src={closeIcon} alt="close" className="close" onClick={quit} />, document.querySelector('#mount'));
    return () => render(<></>, document.querySelector('#mount'));
  }, [quit]);

  // TODO:测试代码
  const [val, setVal] = useState('');

  return (
    <>
      {/* TODO:测试代码 */}
      {/* <div style={{ position: 'fixed', left: '0', top: '0', zIndex: '10' }}>
        <input
          value={val}
          onChange={(e: any) => setVal(e.target.value)}
          onKeyDown={(e: any) => {
            if (e.code === 'Enter') {
              loadScenes(val, currentSceneId);
              setVal('');
            }
          }}
          style={{ height: '40px' }}
        />
        <button onClick={() => loadScenes(val, currentSceneId)}>sendTest</button>
      </div> */}
      <SceneForm currentSceneId={currentSceneId} userInfo={currentScene?.userInfo} />
    </>
  );
});
