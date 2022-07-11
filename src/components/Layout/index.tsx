import { createContext, memo, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { recordStatusMap, RecordingTips } from '@/components/RecordingTips';
import { AIHuman, AIHumanProps } from '@commercial/virtual-human';
import './index.less';
import classNames from 'classnames';

interface layoutProps {
  children?: JSX.Element;
}

declare global {
  interface Window {
    AIHuman: typeof AIHuman;
    humanConfig: Omit<AIHumanProps, 'character'>;
    commonConfig: {
      source: 'string';
    };
  }
}

export const GlobalContext = createContext<{
  currentHuman?: AIHuman;
  setRecordingStatus?: Dispatch<SetStateAction<recordStatusMap>>;
  setIsShowForm?: (value: boolean) => void;
}>({});

export const Layout = memo((props: layoutProps) => {
  const [currentHuman, setCurrentHuman] = useState<AIHuman | undefined>();
  const [recordingStatus, setRecordingStatus] = useState(recordStatusMap.say);
  const [isShowForm, setIsShowForm] = useState<boolean>(false);
  const mountRef = useRef(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (AIHuman) {
      const human = new AIHuman({
        character: 'furao', // baizifan, furao
        className: 'ai-human',
        coverRoot: document.body,
        showRecordIcon: false,
        autoPlayText: false,
        autoRecordText: false,
        root: mountRef.current,
        asrConfig: { hotWordId: '50cd76e5fd0211ecacae446a2eb5fd98' },
        scaleRate: 0.82,
        onRecordStart: () => {
          human.closeText();
          setRecordingStatus(recordStatusMap.hear);
        },
        onRecordEnd: () => setRecordingStatus(recordStatusMap.padding),
        onPlayStart: () => setRecordingStatus(recordStatusMap.say),
        onPlayEnd: () => setRecordingStatus(recordStatusMap.normal),
        // 支持webview注入配置
        ...(window.humanConfig || {}),
      });
      setCurrentHuman(human);
    }
  }, []);

  // 布局适配ipad
  useEffect(() => {
    const adaptation = () => {
      const layout = layoutRef.current;
      const scale = Math.min(document.body.clientWidth / 1920, document.body.clientHeight / 1080);
      if (layout) {
        layout.style.cssText = `transform: scale(${scale}) translateX(-50%)`;
      }
    };

    window.addEventListener('resize', adaptation);
    adaptation();
    return () => {
      window.removeEventListener('resize', adaptation);
    };
  }, []);

  return (
    <div className={classNames('layout', { active: isShowForm })} ref={layoutRef}>
      <RecordingTips status={recordingStatus} />
      <div className="human-box" ref={mountRef}></div>
      <div className="form-box">
        {currentHuman && (
          <GlobalContext.Provider value={{ currentHuman, setRecordingStatus, setIsShowForm }}>
            {props.children}
          </GlobalContext.Provider>
        )}
      </div>
    </div>
  );
});
