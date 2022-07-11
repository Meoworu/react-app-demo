import { memo, useMemo } from 'react';
import { LeaveForm } from '@/components/LeaveForm';
import { AnimatePresence } from 'framer-motion';
import { UserInfoType } from '@/api/type';

export const formMap: { [key: string]: React.FunctionComponent<any> } = {
  'p1-1': LeaveForm,
};

interface propsType {
  currentSceneId: string;
  userInfo?: UserInfoType;
}
export const SceneForm = memo((props: propsType) => {
  const { currentSceneId, userInfo = {} } = props;
  console.log(currentSceneId);
  const Component = useMemo(() => (formMap[currentSceneId] ? formMap[currentSceneId] : () => null), [currentSceneId]);

  return (
    <AnimatePresence>
      <Component key={currentSceneId} userInfo={userInfo} />
    </AnimatePresence>
  );
});
