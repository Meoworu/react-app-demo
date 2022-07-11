import { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserInfoType } from '@/api/type';
import classnames from 'classnames';
import './index.less';

const animateProps = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 },
};

const delayTime = 0.5;

export const LeaveForm = memo(({ userInfo = {} }: { userInfo: UserInfoType }) => (
  <motion.div className="leave" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: delayTime }}
      className="leave-title"
    >
      请假单
    </motion.div>
    <div className="leave-content">
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: delayTime }}
      >
        <div className={classnames('type', { active: userInfo.vacationtype })}>请假类型</div>
        {userInfo.vacationtype && (
          <motion.div {...animateProps} className="value">
            {userInfo.vacationtype}
          </motion.div>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.15 + delayTime }}
      >
        <div className={classnames('type', { active: userInfo.vacationtotal })}>请假时长</div>
        {userInfo.vacationtotal && (
          <motion.div {...animateProps} className="value">
            {userInfo.vacationtotal.original}
          </motion.div>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 + delayTime }}
      >
        <div className={classnames('type', { active: userInfo.vacationstarts })}>请假开始日期</div>
        {userInfo.vacationstarts && (
          <motion.div {...animateProps} className="value">
            {userInfo.vacationstarts.year}-{userInfo.vacationstarts.month}-{userInfo.vacationstarts.day}
          </motion.div>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.45 + delayTime }}
      >
        <div className={classnames('type', { active: userInfo.vacationends })}>请假结束日期</div>
        {userInfo.vacationends && (
          <motion.div {...animateProps} className="value">
            {userInfo.vacationends.year}-{userInfo.vacationends.month}-{userInfo.vacationends.day}
          </motion.div>
        )}
      </motion.div>
    </div>
  </motion.div>
));
