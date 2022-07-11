import { memo } from 'react';
import sayGif from '@/assets/images/say.gif';
import paddingGif from '@/assets/images/padding.gif';
import { getSourcePath } from '@/utils';
import './index.less';

export enum recordStatusMap {
  hear = 1,
  say,
  normal,
  padding,
}

interface RecordingTipsProp {
  status: number;
}

export const RecordingTips = memo((props: RecordingTipsProp) => {
  const { status } = props;
  return (
    <div className="recording-tips">
      {status === recordStatusMap.hear && (
        <div>
          <img src={getSourcePath() + sayGif} alt="" />
        </div>
      )}
      {status === recordStatusMap.say || (recordStatusMap.normal && <div></div>)}
      {status === recordStatusMap.padding && (
        <div>
          <img src={getSourcePath() + paddingGif} alt="" />
        </div>
      )}
    </div>
  );
});
